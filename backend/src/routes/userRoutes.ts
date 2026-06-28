import { Router } from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import { changePassword, getUserData } from "../controllers/user.controller";

const router = Router();

router.put('/change-password', authenticateToken, changePassword);
router.get('/me', authenticateToken, getUserData);

export default router;