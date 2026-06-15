import { prisma } from '../config/db';

let isRunning = false;

export const bookingCleanup = () => {
    
    // 2 minute transformate în milisecunde (2 * 60 secunde * 1000 milisecunde)
    const INTERVAL_MS = 2 * 60 * 1000;

    setInterval(async () => {
        if (isRunning) {
            console.log("[CLEANUP]: Job-ul anterior încă rulează. Dăm skip...");
            return;
        }

        isRunning = true;

        try {
            const now = new Date();
            // console.log("[CLEANUP]: Se verifică comenzile expirate...");

            const expiredBookings = await prisma.booking.findMany({
                where: {
                    status: "PENDING",
                    expiresAt: { lt: now }
                },
                include: {
                    tickets: true
                }
            });

            if (expiredBookings.length === 0) {
                isRunning = false;
                return;
            }

            console.log(`[CLEANUP]: Am găsit ${expiredBookings.length} comenzi expirate. Începem procesarea...`);

            for (const booking of expiredBookings) {
                const ticketCounts: Record<number, number> = {};
                booking.tickets.forEach(t => {
                    ticketCounts[t.ticketTypeId] = (ticketCounts[t.ticketTypeId] || 0) + 1;
                });

                const prismaOperations = [];

                for (const [ticketTypeId, count] of Object.entries(ticketCounts)) {
                    prismaOperations.push(
                        prisma.ticketType.update({
                            where: { id: parseInt(ticketTypeId) },
                            data: { availableCapacity: { increment: count } }
                        })
                    );
                }

                prismaOperations.push(
                    prisma.ticket.deleteMany({
                        where: { bookingId: booking.id, status: "PENDING" }
                    })
                );

                prismaOperations.push(
                    prisma.booking.update({
                        where: { id: booking.id },
                        data: { status: "CANCELLED" }
                    })
                );

                await prisma.$transaction(prismaOperations);
            }

            console.log(`[CLEANUP]: Finalizat! Am anulat și eliberat ${expiredBookings.length} comenzi.`);
        } catch (error: any) {
            console.error("[CLEANUP]: Eroare critică la curățarea comenzilor expirate: ", error);
        } finally {
            isRunning = false;
        }
    }, INTERVAL_MS);

    console.log("[CLEANUP]: Sistemul automat de eliberare a biletelor a pornit!");
};