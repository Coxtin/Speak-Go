import { Router } from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import { fetchEvents } from "../controllers/event.controller";

const router = Router();

console.log("Se preiau evenimentele...");

router.get('/', authenticateToken, fetchEvents);

export default router
