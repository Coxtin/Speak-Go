import OpenAI from "openai";
import { prisma } from "../config/db";

const DB_CONTEXT = process.env.AI_DB_CONTEXT || "Structura bazei de date nu este disponibila";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_SECRET_KEY,
})

const DATABASE_SCHEME = `

    Schema bazei de date este urmatoarea (PostreSQL via Prisma): ${DB_CONTEXT}

`