import { Router } from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import { fetchEvents } from "../controllers/event.Controller";

const router = Router();

router.get('/', authenticateToken, fetchEvents);

export default router