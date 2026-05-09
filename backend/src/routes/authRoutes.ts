import { Router } from "express";
import { register, login, refreshAccessToken, sendResetCode, checkResetCode, resetPassword } from "../controllers/auth.controller";

const router = Router();

router.post('/register', register);
router.post('/login', login)
router.post('/forgot-password', sendResetCode);
router.post('/verify-reset-code', checkResetCode);
router.post('/modify-password', resetPassword);
router.post('/refresh', refreshAccessToken);


export default router;
