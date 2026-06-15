import { prisma } from "../config/db";
import Stripe from "stripe";
import crypto from 'crypto';
import { CreatePaymentRequest } from "../types/payment.types";

export const createPaymentIntent = async(userId: number, eventId: number, selectedTickets: {ticketId: number, quantity: number}[]) => {

    try {

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

        let totalAmount = 0;
        const ticketsToReserve: {ticketTypeId: number, qrCode: string, status: string}[] = [];

        // 1. Verificăm disponibilitatea și calculăm totalul
        for (const ticket of selectedTickets){
                const realTicket = await prisma.ticketType.findUnique({
                    where: {
                        id: ticket.ticketId
                    },
                })

                if (!realTicket){
                    throw new Error(`Biletul cu ID-ul ${ticket.ticketId} nu exista`);
                } 

                if (realTicket.availableCapacity < ticket.quantity) {
                    throw new Error(`Nu mai sunt suficiente bilete de tipul ${realTicket.name}`);
                }

                const priceInteger = realTicket.price.toNumber();
                totalAmount += (priceInteger * ticket.quantity) * 100;

                // Pregătim datele pentru biletele PENDING
                for (let i = 0; i < ticket.quantity; i++) {
                    ticketsToReserve.push({
                        ticketTypeId: ticket.ticketId,
                        qrCode: crypto.randomUUID(),
                        status: "PENDING"
                    });
                }
        }

        const realAmount = Math.round(totalAmount);
        const expirationTime = new Date(Date.now() + 10 * 60 * 1000);

        // 2. Realizăm rezervarea într-o tranzacție
        const result = await prisma.$transaction(async (tx) => {
            
            // Scădem capacitatea pentru fiecare tip de bilet
            for (const ticket of selectedTickets) {
                await tx.ticketType.update({
                    where: { id: ticket.ticketId },
                    data: { availableCapacity: { decrement: ticket.quantity } }
                });
            }

            // Creăm rezervarea (booking)
            const booking = await tx.booking.create({
                data: {
                    userId: userId,
                    eventId: eventId,
                    status: "PENDING",
                    expiresAt: expirationTime,
                    totalPrice: realAmount / 100
                }
            });

            // Creăm biletele cu status PENDING
            await tx.ticket.createMany({
                data: ticketsToReserve.map(t => ({ ...t, bookingId: booking.id }))
            });

            return booking;
        });

        const paymentIntent = await stripe.paymentIntents.create({
            amount: realAmount,
            currency: 'ron',
            metadata: {
                eventId: eventId.toString(),
                userId: userId.toString(),
                bookingId: result.id.toString(),
                selectedTickets: JSON.stringify(selectedTickets)
            }
        });

        await prisma.booking.update({
            where: {
                id: result.id
            },
            data: {
                paymentIntentId: paymentIntent.id
            }
        })

        return { value: true, data: paymentIntent.client_secret, bookingId: result.id};


        } catch(error: any){
            console.error("Eroare la createPaymentIntent:", error.message);
            return {value: false, message: error.message || "Eroare la crearea platii!"}

    }

}

export const confirmPaymentAndGenerateTickets = async (userId: number, bookingId: number) => {

    try {

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

        const booking = await prisma.booking.findUnique({
            where: {
                id: bookingId
            }
        })

        if (!booking || booking.userId !==  userId){
            return { value: false, message: "Comanda nu a fost gasita sau acces interzis!" };
        }

        if (booking.status === "PAID"){
            return { value: true, message: "Comanda a fost deja platita.", bookingId: booking.id };
        }

        if (!booking.paymentIntentId){
            return {value: false, message: "Aceasta comanda nu are o plata initializata!"};
        }

        const paymentIntent = await stripe.paymentIntents.retrieve(booking.paymentIntentId);

        if (paymentIntent.status !== "succeeded"){
            return { value: false, message: "Plata nu a fost finalizata la nivelul bancii!" };
        }

        await prisma.$transaction([
            prisma.booking.update({
                where: {
                    id: booking.id
                },
                data: {
                    status: "PAID"
                },
            }),
            prisma.ticket.updateMany({
                where: {
                    bookingId: booking.id,
                    status: "PENDING"
                },
                data: {
                    status: "ACTIVE"
                }
            })
        ]);

        return { value: true, message: "Plata confirmata si biletele au fost activate!" };

    } catch (error: any){
        console.error(error);
        return { value: false, message: "Eroare la activarea biletelor!" };
    }

}