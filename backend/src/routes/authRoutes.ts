import { Router, Request, Response } from "express";
import { register, login, refreshAccessToken, sendResetCode, checkResetCode, resetPassword } from "../controllers/auth.controller";
import { authenticateToken } from "../middlewares/authenticateToken";

const router = Router();

router.post('/register', register);
router.post('/login', login)
router.post('/forgot-password', sendResetCode);
router.post('/verify-reset-code', checkResetCode);
router.post('/modify-password', resetPassword);
router.post('/refresh', refreshAccessToken);

router.get('/validate-session', authenticateToken, (req: Request, res: Response) => {
    res.status(200).json({ valid: true });
});


export default router;
