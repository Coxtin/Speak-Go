import dotenv from 'dotenv';
import express, {Request, Response} from "express";
import cors from "cors";
import multer from "multer";
import OpenAI from 'openai';
import fs from 'fs'

dotenv.config();

import pool from "./config/db";
import { open } from 'fs';

import authRoutes from './routes/authRoutes'

const port = 5002;

async function getUsers() {
    const query = 'SELECT * FROM users';
    try{
        const data = await pool.query(query); 
        return data.rows;
    }
    catch (error){
        console.error("Eroare :", error);
        throw error;
    }
}


const app = express();
app.use(cors());
app.use(express.json()); 

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const extension = file.originalname.split('.').pop();
        cb(null, `${Date.now()}.${extension}`);
    }
});

const upload = multer({ storage });

app.post("/api/transcribe", upload.single('audio'), async (req: Request, res: Response) => {

    if (!req.file){
        return res.status(400).json({error: "Nu a fost gasit vreun fisier audio!"});
    }

    console.log("Fisier primit:", req.file.filename, "Path:", req.file.path);

    try{

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_SECRET_KEY,
        });

        const response = await openai.audio.transcriptions.create({
            file: fs.createReadStream(req.file.path),
            model: 'whisper-1',
            language: 'ro'
        });
        
        fs.unlinkSync(req.file.path);

        const textTranscris = response.text;
        res.json({text: textTranscris});

    } catch(err){
        console.log("Eroare: ", err);
        return res.status(500).json({error: "Eroare la transcriere"});
    }

});

app.post('/api/register', authRoutes);
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