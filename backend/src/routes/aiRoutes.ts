import { Router } from "express";
import { convertText2Intent } from "../controllers/ai.controller";
import { authenticateToken } from "../middlewares/authenticateToken";

const router = Router();

router.post('/', authenticateToken, convertText2Intent);

export default router;
