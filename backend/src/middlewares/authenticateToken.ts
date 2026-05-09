import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token)
        return res.status(401).json({error: "Nu a fost furnizat acces token-ul!"});

    jwt.verify(token, process.env.JWT_SECRET_KEY as string, (err, decodedUser) => {

        if (err){
            return res.status(401).json({error: "Token invalid sau expirat!"});
        }

        res.locals.user = decodedUser;

        next();

    });

}

