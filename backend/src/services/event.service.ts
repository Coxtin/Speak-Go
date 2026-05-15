import { PrismaClientKnownRequestError } from "../../generated/prisma/internal/prismaNamespace"
import { prisma } from "../config/db"
import Prisma from '@prisma/client';
// import { EventResponse } from "../types/event.types";

export type EventResponse = Prisma.Event

export const fetchDataBaseForEvents = async(): Promise<{value: boolean, events? : EventResponse[]}> => {

    try {

        const events = await prisma.event.findMany({
            include: {
                venue: true
            }
        });

        return {value: true, events: events as EventResponse[]};

    } catch (error: any){

        console.error("Eroare la interogarea bazei de date: ", error);
        return {value: false};

    }

}