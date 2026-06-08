import { Router } from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import { fetchEvents, searchEvent } from "../controllers/event.controller";

const router = Router();

console.log("Se preiau evenimentele...");

router.get('/', authenticateToken, fetchEvents);
router.post('/search', authenticateToken, searchEvent);

export default router
