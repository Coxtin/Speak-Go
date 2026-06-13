import { Router } from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import { fetchEvents, searchEvent, fetchTicketsForEvents } from "../controllers/event.controller";

const router = Router();

console.log("Se preiau evenimentele...");

router.get('/', authenticateToken, fetchEvents);
router.get('/:id/ticket', authenticateToken, fetchTicketsForEvents);
router.post('/search', authenticateToken, searchEvent);

export default router
