export type TicketInfo = {

    id: number,
    name: string,
    price: number,
    currency: string

}

export type EventTicketResponse = {
    ticketInfo: {
        availableSeats: number,
        ticketTypes: TicketInfo[]
    }
}

export type Ticket = {

    id: number;
    qrCode: string;
    status: string;
    ticketType: {
        name: string;
        price: string | number; // Decimal din Prisma poate veni ca string în JSON
    };
    booking: {
        event: {
            name: string;
        };
    };

}