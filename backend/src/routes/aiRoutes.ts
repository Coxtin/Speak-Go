import { Router } from "express";
import { convertText2Intent } from "../controllers/ai.controller";
import { authentificateToken } from "../middlewares/authentificateToken";

const router = Router();

router.post('/', authentificateToken, convertText2Intent);

export default router;
