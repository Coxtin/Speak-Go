export type PaymentParams = {
    PaymentSummary: {
        selectedTickets: {
            id: number;
            name: string;
            price: number;
            currency: string;
            quantity: number;
            eventName?: string;
        }[];
        totalPrice: number;
        currency: string;
        eventId: number
    };
};