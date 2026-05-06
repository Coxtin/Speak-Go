import { Router } from "express";
import { convertText2Intent } from "../controllers/ai.controller";

const router = Router();

router.post('/ai', convertText2Intent);

export default router;