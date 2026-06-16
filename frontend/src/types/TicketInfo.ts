export type TicketInfo = {
    id: number;
    name: string;
    price: number;
    currency: string;
    // Adăugate pentru a permite afișarea în diverse carduri/sumare
    eventName?: string;
    quantity?: number;
    type?: string;
}

export type EventTicketResponse = {
    eventName?: string;
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
            title?: string;
            date: string;
        };
        // Numărul total de bilete din această rezervare
        totalTickets?: number;
    };
}
