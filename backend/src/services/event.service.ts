import { PrismaClientKnownRequestError } from "../../generated/prisma/internal/prismaNamespace"
import { prisma } from "../config/db"
import { Prisma } from "../../generated/prisma"
import { EventFilter } from '../types/event.types'
// import { EventResponse } from "../types/event.types";

export type EventResponse = Prisma.EventGetPayload<{
    include: { venue: true, ticketTypes: {select: { price: true, currency: true } } }
}>;

export const fetchDataBaseForEvents = async(): Promise<{value: boolean, events? : EventResponse[]}> => {

    try {

        const events = await prisma.event.findMany({
            include: {
                venue: true,
                ticketTypes: {
                    select: {
                        price: true,
                        currency: true
                    }
                }
            },
            orderBy: {
                title: 'desc'
            }
        });

        return {value: true, events: events as EventResponse[]};

    } catch (error: any){

        console.error("Eroare la interogarea bazei de date: ", error);
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

    if (filters.eventName)
        whereClause.title = { contains: filters.eventName, mode: 'insensitive' }

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