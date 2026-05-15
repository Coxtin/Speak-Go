import { Router } from "express";
import { convertText2Intent, convertTTS } from "../controllers/ai.controller";
import { authenticateToken } from "../middlewares/authenticateToken";

const router = Router();

router.post('/', authenticateToken, convertText2Intent);
router.post('/tts', authenticateToken, convertTTS);

export default router;
