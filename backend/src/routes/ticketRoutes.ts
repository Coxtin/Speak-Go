import { Router } from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import { fetchTickets } from "../controllers/ticket.controller";

const router = Router();

router.get('/', authenticateToken, fetchTickets);

export default router;