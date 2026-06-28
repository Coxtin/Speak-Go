import { Prisma } from "../../generated/prisma"

export type EventResponse = Prisma.EventGetPayload<{
    include: { 
        venue: true,
        ticketTypes:{ 
            select: { 
                price: true,
                currency: true,
                _count: {
                    select: {
                        tickets: true
                    },
                },
            },
        },
        reviews: {
            select: {
                    userId: true,
                    rating: true
                },
        },
        bookings: {
            select:{
                id: true
            },
        },
    },
}> & { isSoldOut: boolean, averageRating?: string | null } ;

export interface EventFilter  {
    
    category?: string
    genres?: string,
    city?: string,
    artist?: string,
    eventName?: string,
    date_from?: Date,
    date_to?: Date
    
}