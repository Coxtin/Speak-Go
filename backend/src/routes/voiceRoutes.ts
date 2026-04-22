import { Router } from "express";
import multer from "multer";
import { handleVoiceCommands } from "../controllers/voice.controller";
import { authentificateToken } from "../middlewares/authentificateToken"

const router = Router();

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const extension = file.originalname.split('.').pop();
        cb(null, `${Date.now()}.${extension}`);
    }
});

const upload = multer({ storage });

router.post('/', authentificateToken, upload.single('audio'), handleVoiceCommands);

export default router;
