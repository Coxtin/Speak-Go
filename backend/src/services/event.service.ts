import { PrismaClientKnownRequestError } from "../../generated/prisma/internal/prismaNamespace"
import { prisma } from "../config/db"
import { Prisma } from "../../generated/prisma"
import { EventFilter } from '../types/event.types'
// import { EventResponse } from "../types/event.types";

export type EventResponse = Prisma.EventGetPayload<{
    include: { venue: true, ticketTypes: {select: { price: true, currency: true } } }
}>;

export const fetchDataBaseForEvents = async(userId: number): Promise<{value: boolean, events? : EventResponse[]}> => {

    try {
        // console.log("[SERVICE]: Se execută prisma.event.findMany...");
        const events = await prisma.event.findMany({
            include: {
                venue: true,
                ticketTypes: {
                    select: {
                        price: true,
                        currency: true
                    }
                },
                reviews: {
                    where: {
                        userId: userId
                    }
                },
                bookings: {
                    where: {
                        userId: userId,
                        tickets: {
                            some: {
                                status: "SCANNED"
                            }
                        }
                    },
                    select: {
                        id: true
                    }
                }
            },
            orderBy: {
                title: 'desc'
            }
        });

        console.log(`[SERVICE]: findMany a returnat ${events.length} evenimente.`);
        return {value: true, events: events as EventResponse[]};

    } catch (error: any){

        console.error("[SERVICE]: Eroare la interogarea bazei de date: ", error);
        return {value: false};

    }

}

export const searchEventsByFilters = async (filters: EventFilter) => {

    const whereClause: any = {};

    if (filters.category && filters.category !== 'all')
        whereClause.category = { contains: filters.category, mode: 'insensitive' };

    if (filters.genres)
        whereClause.genres = { has: filters.genres };

    if (filters.city)
        whereClause.venue = {city : {contains: filters.city, mode: 'insensitive'}}

    if (filters.artist)
        whereClause.artist = { contains: filters.artist, mode: 'insensitive' }

    if (filters.eventName){
        const cleanSearchText = filters.eventName.replace(/[^a-zA-z0-9]/g, '');
        whereClause.normalizedTitle = { contains: cleanSearchText, mode: 'insensitive' }
    }

    if (filters.date_from || filters.date_to){
        whereClause.date = {};
        if (filters.date_from)
            whereClause.date.gte = new Date(filters.date_from);
        if (filters.date_to)
            whereClause.date.lte = new Date(filters.date_to);
    }

    try {

        const events = await prisma.event.findMany({
            where: whereClause,
            include: {
                venue: true,
                ticketTypes: true
            },
            orderBy: {
                date: 'asc'
            }
        });
        
        if (events.length > 0)

            return { value: true, filteredEvents: events };

        else

            return {value: false, events: null};

    } catch(error: any) {

        console.error("Eroare la interogarea bazei de date!");
        return { value: false, message: error };
        
    }

}

export const addReviewToEvent = async(userId: number, eventId: number, comment: string, rating: number) => {

    try {
        console.log(`[SERVICE addReviewToEvent] Executam verificare duplicate pentru userId: ${userId}, eventId: ${eventId}`);

        const existingReview = await prisma.review.findFirst({
            where: {
                userId: userId,
                eventId: eventId
            }
        });

        if (existingReview){
            console.log(`[SERVICE addReviewToEvent] Eroare logica: Utilizatorul a lasat deja un review (ID existent: ${existingReview.id})`);
            return { value: false, message: "Ai lăsat deja un review pentru acest eveniment!" };
        }

        console.log(`[SERVICE addReviewToEvent] Niciun duplicat gasit. Inseram review-ul: rating=${rating}, comment=${comment}`);
        
        const newReview = await prisma.review.create({
            data: {
                userId: userId,
                eventId: eventId,
                rating: rating,
                comment: comment
            }
        })
        
        console.log(`[SERVICE addReviewToEvent] Review creat cu succes in baza de date! ID-ul este: ${newReview.id}`);
        return { value: true };

    } catch (error: any){
        console.error("[SERVICE addReviewToEvent] EROARE FATALA Prisma: ", error);
        return { value: false, message: "Eroare internă a bazei de date" };
    }

}