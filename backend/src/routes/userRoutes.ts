import { Router } from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import { changePassword } from "../controllers/user.controller";

const router = Router();

router.put('/change-password', authenticateToken, changePassword);

export default router;