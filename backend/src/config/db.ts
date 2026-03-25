import { Pool } from "pg";


const pool = new Pool({

    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: Number(process.env.DB_PORT)
    
})

async function verifyConnection(): Promise<void> {

    try{

        const client = pool.connect();
        console.log('✅ Connected to PostgreSQL database');
        (await client).release();

    }
    catch (error){
        console.error('❌ Error connecting to the database:', error)
    }
}

verifyConnection();

export default pool;