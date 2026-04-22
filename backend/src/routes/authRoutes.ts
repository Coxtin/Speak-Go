import { Router } from "express";
import { register, login, refreshAccesToken } from "../controllers/auth.controller";

const router = Router();

router.post('/register', register);
router.post('/login', login)
router.post('/refresh', refreshAccesToken);

export default router;