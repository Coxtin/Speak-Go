import { Router } from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import { fetchTickets, removeTicket } from "../controllers/ticket.controller";

const router = Router();

router.get('/', authenticateToken, fetchTickets);
router.delete('/:id', authenticateToken, removeTicket);

export default router;