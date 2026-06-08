export interface EventResponse {

    id: number,
    title: string,
    description: string,
    category: string,
    date: Date,
    imageUrl: string | null,
    status: string | null,
    venue: {
        name: string,
        city: string,
        address: string,
        capacity: number
    },
    ticketTypes: {
        id: number,
        name: string,
        price: number,
        quantity: number,
    }[];

}

export interface EventFilter  {
    
    category?: string
    genres?: string,
    city?: string,
    artist?: string,
    eventName?: string,
    date_from?: Date,
    date_to?: Date
    
}