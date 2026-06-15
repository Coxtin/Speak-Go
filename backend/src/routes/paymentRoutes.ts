import { Router } from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import { makePayment, bookTicket } from "../controllers/payment.controller";

const router = Router();

router.post('/create-intent', authenticateToken, makePayment);
router.post('/confirm', authenticateToken, bookTicket);

export default router;