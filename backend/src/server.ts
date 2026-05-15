import dotenv from 'dotenv';
import express from "express";
import path from 'path';
import cors from "cors";

dotenv.config();

import { prisma } from "./config/db";

import authRoutes from './routes/authRoutes'
import voiceRoutes from './routes/voiceRoutes';
import aiRoutes from './routes/aiRoutes';
import eventRoutes from './routes/eventRoutes';

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


app.use('/api/auth', authRoutes);

app.use('/api/voice', voiceRoutes);

app.use('/api/ai', aiRoutes);

app.use('/api/events', eventRoutes);


app.use('/uploads', express.static(path.join(__dirname, '../public/eventsImages')));
// app.get('/', async (req: Request, res: Response) => {
//     try {
//         const users = await getUsers();
//         return res.json(users);
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to fetch users' });
//     }
// });



app.listen(port, '0.0.0.0', () => {
    console.log("Server ul merge pe portul : ", port);
    console.log("Server accesibil la: http://192.168.1.133:" + port);
})
