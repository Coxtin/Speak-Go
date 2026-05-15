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
    }

}