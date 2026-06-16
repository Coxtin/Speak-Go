import { prisma } from "../config/db";
import { sendEmail } from "./email.service";

export const getEventTicketDetails = async (eventId: number) => {

    const event = await prisma.event.findUnique({
        where: {
            id: eventId
        },
        include: {
            venue: true,
            ticketTypes: true,
        }
    });

    if (!event){
        console.log("Nu exista bilete pentru acest eveniment!");
        return { value: false, message: "A aparut o problema la identificarea evenimentului!" };
    }

    const soldTickets = await prisma.ticket.count({
        where: {
            booking: {
                eventId: eventId
            }
        }
    });

    const ticketSold = soldTickets || 0;
    const capacity = event.venue.capacity;

    let availableSeats = capacity - ticketSold;

    if (availableSeats < 0)
        availableSeats = 0;

    return{
        value: true,
        eventName: event.title,
        ticketInfo: {
            availableSeats: availableSeats,
            ticketTypes: event.ticketTypes
        }
    }

}

export const getUserTickets = async (userId: number) => {
    
    try {

        const tickets = await prisma.ticket.findMany({
            where: {
                booking: {
                    userId: userId,
                    status: "PAID"
                }
            },
            include: {
                ticketType: true,
                booking: {
                    include: {
                        event: true,
                        _count: {
                            select: { tickets: true }
                        }
                    }
                },
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        // Mapăm rezultatul pentru a aplatiza count-ul într-o proprietate mai ușor de folosit
        const formattedTickets = tickets.map(t => ({
            ...t,
            booking: {
                ...t.booking,
                totalTickets: (t.booking as any)._count?.tickets || 0
            }
        }));

        return { tickets: formattedTickets };

    } catch (error: any){
        
        console.error("A aparut o eroare la verificarea numarului de bilete: ", error);
        throw new Error("eroare la conexiune la baza de date!");
        
    }
}

export const deleteTicket = async (ticketId: number, userId: number) => {
    try {
        // Verificăm dacă biletul aparține utilizatorului
        const ticket = await prisma.ticket.findFirst({
            where: {
                id: ticketId,
                booking: {
                    userId: userId
                }
            }
        });

        if (!ticket) {
            return { success: false, message: "Biletul nu a fost găsit sau nu vă aparține!" };
        }

        await prisma.ticket.delete({
            where: {
                id: ticketId
            }
        });

        return { success: true, message: "Biletul a fost șters cu succes!" };
    } catch (error) {
        console.error("Eroare la ștergerea biletului:", error);
        return { success: false, message: "Eroare la ștergerea biletului din baza de date!" };
    }
}

export const sendBookingEmail = async (bookingId: number) => {
    try {
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                user: true,
                event: {
                    include: { venue: true }
                },
                tickets: {
                    include: { ticketType: true }
                }
            }
        });

        if (!booking) {
            console.error("Rezervarea nu a fost găsită pentru email!");
            return;
        }

        const eventDate = new Date(booking.event.date).toLocaleDateString('ro-RO', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const ticketsHtml = booking.tickets.map(ticket => `
            <div style="border: 2px dashed #2563EB; border-radius: 12px; padding: 20px; margin-bottom: 20px; background-color: #ffffff; text-align: center;">
                <p style="margin: 0; font-weight: bold; font-size: 20px; color: #1F2937;">${ticket.ticketType.name}</p>
                <p style="margin: 5px 0; color: #6B7280; font-family: monospace;">ID: ${ticket.qrCode.split('-')[0]}</p>
                <div style="margin: 15px 0;">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${ticket.qrCode}" 
                         alt="QR Code - ${ticket.qrCode}" 
                         style="border: 1px solid #E5E7EB; padding: 10px; border-radius: 8px;">
                </div>
                <p style="margin: 0; font-size: 14px; color: #9CA3AF;">Prezentați acest cod la intrare</p>
            </div>
        `).join('');

        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #374151; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 20px auto; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 1px solid #E5E7EB; }
                .header { background-color: #2563EB; color: white; padding: 40px 20px; text-align: center; }
                .content { padding: 30px; background-color: #f8fafc; }
                .footer { background-color: #ffffff; padding: 20px; text-align: center; font-size: 12px; color: #9CA3AF; border-top: 1px solid #E5E7EB; }
                .event-info { background: white; padding: 20px; border-radius: 12px; margin-bottom: 20px; border: 1px solid #E5E7EB; }
                .label { font-size: 12px; text-transform: uppercase; color: #6B7280; font-weight: bold; margin-bottom: 4px; }
                .value { font-size: 16px; font-weight: bold; color: #111827; margin-bottom: 16px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1 style="margin: 0; font-size: 28px;">Speak&Go</h1>
                    <p style="margin: 10px 0 0; opacity: 0.9;">Biletele tale au fost confirmate!</p>
                </div>
                <div class="content">
                    <div class="event-info">
                        <div class="label">Eveniment</div>
                        <div class="value">${booking.event.title}</div>
                        
                        <div class="label">Data și Ora</div>
                        <div class="value">${eventDate}</div>
                        
                        <div class="label">Locație</div>
                        <div class="value">${booking.event.venue.name}<br><span style="font-weight: normal; color: #6B7280;">${booking.event.venue.address}, ${booking.event.venue.city}</span></div>
                    </div>

                    <h2 style="font-size: 18px; margin-bottom: 15px; color: #1F2937;">Biletele Tale</h2>
                    ${ticketsHtml}
                </div>
                <div class="footer">
                    Vă mulțumim că ați ales Speak&Go!<br>
                    Acest email a fost trimis automat. Vă rugăm să nu răspundeți.
                </div>
            </div>
        </body>
        </html>
        `;

        await sendEmail(booking.user.email, `Biletele tale pentru ${booking.event.title}`, html);

    } catch (error) {
        console.error("Eroare la trimiterea email-ului de confirmare:", error);
    }
}

export const checkTicketQrCode = async (ticketQrCode: string) => {

    try {

        const realTicket = await prisma.ticket.findUnique({
            where: {
                qrCode: ticketQrCode
            },
        });

        if (!realTicket){
            console.error("Acest bilet nu exista!");
            return { value: false, message: "Acest bilet nu exista in baza de date!" }
        }

        if (realTicket.status === "ACTIVE"){
            await prisma.ticket.update({
                where: {
                    qrCode: ticketQrCode
                },
                data: {
                    status: "SCANNED"
                }
            });

            return { value: true, message: "Biletul a fost scanat cu succes! Bine ai venit si distractie placuta!" };

        } else if (realTicket.status === "SCANNED")
            return { value: false, message: "Biletul a fost deja scanat!" };
        else
            return { value: false, message: "Biletul nu a fost recunoscut!" };


    } catch (error: any){
        console.error("Eroare la verificarea codului qr al biletului: ", error);
        return { value: false };
    }

}