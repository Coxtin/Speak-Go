// import { Pool } from "pg";

// const pool = new Pool({

//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_NAME,
//     password: process.env.DB_PASS,
//     port: Number(process.env.DB_PORT)
    
// })

// async function verifyConnection(): Promise<void> {

//     try{

//         const client = pool.connect();
//         console.log('✅ Connected to PostgreSQL database');
//         (await client).release();

//     }
//     catch (error){
//         console.error('❌ Error connecting to the database:', error)
//     }
// }

// verifyConnection();

// export default pool;

import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma";

const connectionString = `${process.env.DATABASE_URL}`;

console.log("[DB]: Se inițializează conexiunea la baza de date...");
if (!process.env.DATABASE_URL) {
    console.error("[DB]: EROARE: DATABASE_URL nu este definit în .env!");
}

const pool = new Pool({ connectionString });

pool.on('error', (err) => {
    console.error("[DB]: Eroare neașteptată la pool-ul de PostgreSQL:", err);
});

const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

console.log("[DB]: Prisma Client a fost instanțiat.");

export { prisma };
