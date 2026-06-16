import { Router } from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import { fetchTickets, removeTicket, scanTicket } from "../controllers/ticket.controller";

const router = Router();

router.get('/', authenticateToken, fetchTickets);
router.post('/scan', authenticateToken, scanTicket);
router.delete('/:id', authenticateToken, removeTicket);

export default router;