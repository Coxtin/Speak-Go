export type EventParams = {

    id: number,
    title: string,
    description: string,
    category: string,
    date: string,
    imageUrl: string | null,
    status: string | null,
    venueId: number,
    venue: {
        name: string,
        city: string,
        address: string,
        capacity: number,
    },
    ticketTypes: {
       price: number,
       currency: string
    }[];
    bookings?: {
        id: number
    }[],
    reviews?: {
        id: number
    }[]


};