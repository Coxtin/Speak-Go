import { prisma } from "../config/db";

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
        ticketInfo: {
            availableSeats: availableSeats,
            ticketTypes: event.ticketTypes
        }
    }

}