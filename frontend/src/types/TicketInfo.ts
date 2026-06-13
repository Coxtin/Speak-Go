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