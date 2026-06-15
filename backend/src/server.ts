import dotenv from 'dotenv';
dotenv.config();

console.log("=========================================");
console.log("[BOOT]: Serverul Speak-Go pornește...");
console.log("=========================================");

import express from "express";
import path from 'path';
import cors from "cors";
import { bookingCleanup } from './cron/bookingCleanup';

import { prisma } from "./config/db";

import authRoutes from './routes/authRoutes'
import voiceRoutes from './routes/voiceRoutes';
import aiRoutes from './routes/aiRoutes';
import eventRoutes from './routes/eventRoutes';
import paymentRoutes from './routes/paymentRoutes'
import ticketRoutes from './routes/ticketRoutes'

const port = 5002;


const app = express();
app.use(cors());
app.use(express.json()); 


// app.get('/', async (req: Request, res: Response) => {
//     try {
//         const allUsers = await prisma.users.findMany();

//         console.log("All users:", JSON.stringify(allUsers, null, 2));

//         return res.status(200).json({
//             message: "Users fetched successfully",
//             count: allUsers.length,
//             users: allUsers,
//         });
//     } catch (error) {
//         console.error("Failed to fetch users:", error);
//         return res.status(500).json({ error: "Failed to fetch users" });
//     }
// });


console.log("[SERVER]: Se inițializează rutele...");

app.use('/api/auth', authRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/tickets', ticketRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: "ok", message: "Server is running" });
});

app.use((req, res, next) => {
    console.log(`[RADAR] Cerere primită: ${req.method} ${req.url}`);
    next();
});

app.use('/uploads', express.static(path.join(__dirname, '../public/eventsImages')));

console.log("[SERVER]: Se pornește ascultarea pe portul:", port);

app.listen(port, '0.0.0.0', () => {
    console.log("-----------------------------------------");
    console.log("Server ul merge pe portul : ", port);
    console.log("Server accesibil la: http://192.168.1.133:" + port);
    console.log("-----------------------------------------");
    
    // Pornim cleanup-ul după ce serverul e sus
    bookingCleanup();
})
