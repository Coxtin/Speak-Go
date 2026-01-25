import dotenv from 'dotenv'
dotenv.config()

import express, {Request, Response} from "express"
import cors from "cors"
import pool from "./db";

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

app.get('/', async (req: Request, res: Response) => {
    try {
        const users = await getUsers();
        return res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

//app.get('/')

app.listen(port, () => {
    console.log("Server ul merge pe portul : ", port);
})