export interface CreatePaymentRequest{
    eventId: number,
    selectedTickets: {
        ticketId: number,
        quantity: number
    }[]
}