import bcrypt from 'bcrypt';
import { prisma } from '../config/db';
import jwt from 'jsonwebtoken';

import { sendEmail } from './email.service';

const EMAIL_ALREADY_EXISTS_ERROR = "Exista deja un cont cu acest email!";
const INVALID_CREDENTIALS_ERROR = "Email sau parola incorecta!";
//const JWT_SECRET = process.env.JWT_SECRET_KEY || 'parola-secreta';

export const registerNewUser = async (userData: any) => {

    try{

        const existingUser = await prisma.user.findUnique({
            where: {
                email: userData.email
            }
        });

        if (existingUser){
            throw new Error(EMAIL_ALREADY_EXISTS_ERROR);
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const insertedUser = await prisma.user.create({
            data : {
                firstName: userData.firstName,
                lastName: userData.lastName,
                username: userData.userName,
                email: userData.email,
                birthDate: userData.birthDate,
                password: hashedPassword
            }
        });

        return {
            id: insertedUser.id,
            firstName: insertedUser.firstName,
            lastName: insertedUser.lastName,
            username: insertedUser.username,
            email: insertedUser.email,
            birthDate: insertedUser.birthDate
        };

    } catch(error: any) {
        if (error?.message === EMAIL_ALREADY_EXISTS_ERROR) {
            throw error;
        }

        console.error("Eroare la crearea contului:", error);
        throw new Error("A aparut o eroare la crearea contului.");
    }
}

export const loginUser = async (credentials: any) => {

    try {

       const person = await prisma.user.findUnique({
            where: {
                email: credentials.email
            }
       })

       if (!person){
            throw new Error(INVALID_CREDENTIALS_ERROR);
       }

       const isPasswordValid = await bcrypt.compare(credentials.password, person.password);

       if (!isPasswordValid){
            throw new Error(INVALID_CREDENTIALS_ERROR);
       } else {

        const accesToken = jwt.sign({

            userId : person.id,
            email : person.email,

        }, process.env.JWT_SECRET_KEY as string ,
        {expiresIn: '10m'}
    );

        const refreshToken = jwt.sign({
            userId: person.id
        }, process.env.JWT_REFRESH_SECRET_KEY as string,
        {expiresIn: '7d'}
    );

        return {
            message: 'Autentificare reusita!',
            user: {
                id: person.id,
                email: person.email,
                username: person.username,
            },
            accesToken: accesToken,
            refreshToken: refreshToken    
        };

       }

    } catch(error: any) {

        if (error.message === INVALID_CREDENTIALS_ERROR) {
            throw error; 
        }

        console.error("Eroare la autentificare:", error);
        throw new Error("A aparut o eroare interna la autentificare.");
    }

};

export const sendResetCode = async (email: string) => {

    try {
       
        const findUser = await prisma.user.findUnique({
            where: { email: email },
            select: { id: true }
        });

        const personId = findUser?.id;

        if (personId){

            const codeCount = await checkResetCodeCount(personId);

            if (codeCount && codeCount >= 3){

                console.log ("Ati depasit limita pentru trimiterea codului de resetare! Va rugam, incercati mai tarziu!");
                return {
                    value: false,
                    status: 429,
                    message: "Ati depasit limita de coduri solicitate. Va rugam sa asteptati 5 minute!"
                };

            }

            const code = Math.floor(100000 + Math.random() * 900000).toString();
            const hashedCode = await bcrypt.hash(code, 10); 

            await prisma.resetCode.create({
                data: {
                    code: hashedCode,
                    userId: personId,
                    expiredAt: new Date(Date.now() + 5 * 60 * 1000)
                }
            })


            const title = "Email pentru resetarea parolei";

            const html = `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #eaeaea; border-radius: 10px; background-color: #ffffff;">
                    <h2 style="color: #1f2937; text-align: center; margin-bottom: 20px;">Resetare Parolă</h2>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">Salut,</p>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">Am primit o solicitare pentru resetarea parolei contului tău. Te rugăm să introduci codul de mai jos în aplicație pentru a continua procesul:</p>
                    
                    <div style="text-align: center; margin: 40px 0;">
                        <span style="display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #4f46e5; background-color: #f3f4f6; padding: 20px 40px; border-radius: 12px; border: 2px dashed #c7d2fe;">
                            ${code}
                        </span>
                    </div>
                    
                    <p style="color: #ef4444; font-size: 14px; text-align: center; font-weight: 500;">⏳ Acest cod este valabil doar 5 minute.</p>
                    <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;" />
                    <p style="color: #9ca3af; font-size: 12px; text-align: center;">Dacă nu ai solicitat tu această resetare, te rugăm să ignori acest mesaj. Contul tău este în siguranță.</p>
                </div>
            `;

            const emailResult = await sendEmail(email, title, html);

            if (!emailResult.success){
                throw new Error("Nu s-a putut trimite email-ul de resetare! Va rugam, incercati din nou!");
            }

            return {
                value: true,
                status: 200,
                message: "Email-ul pentru resetarea parolei a fost trimisa la aceasta adresa!"
            };

        } else {
            console.error("Nu a fost gasit Id-ul utilizatorului!");
            return {
                value: true,
                status: 200,
                message: "Email-ul pentru resetarea parolei a fost trimisa la aceasta adresa!"
            };
        }

    } catch (error) {

        console.error("Eroare la generarea codului de resetare: ", error);
        throw error;

    }
};

export const verifyResetCode = async (email: string, code: string) => {

    const objectPersonId = await prisma.user.findUnique({
        where: {
            email: email
        },
        select: {
            id: true
        }
    });

    if (!objectPersonId)
        return {
            value: false,
            status: 400,
            message: "Codul introdus este invalid sau expirat!"
        };

    const personId = objectPersonId?.id;

    const codeInfo = await prisma.resetCode.findFirst({
        where: {
            userId: personId
        },
        orderBy: {
            createdAt: 'desc'
        },
        select: {
            id: true,
            code: true,
            used: true,
            expiredAt: true
        }
    })

    if (!codeInfo)
        return {
            value: false,
            status: 400,
            message: "Nu a fost solicitat niciun cod de resetare pentru acest cont!"
        }
    

    if (codeInfo?.used){
        return {
            value: false,
            status: 400,
            message: "Acest cod a fost deja folosit!"
       }
    }

    const currentTime = new Date();

    if (codeInfo.expiredAt < currentTime)
        return {
            value: false,
            status: 400,
            message: "Acest cod este expirat. Va rugam sa reluati procesul de resetare a parolei!"
        };

    const codeMatch = await bcrypt.compare(code, codeInfo.code);

    if (!codeMatch){
        return {
            value: false,
            status: 400,
            message: "Codul introdus este incorect!"
        };
    }

    await prisma.resetCode.update({
        where: {
            id: codeInfo.id
        },
        data: {
            used: true
        }
    })

    const resetToken = jwt.sign(
        { userId: personId },
        process.env.JWT_SECRET_KEY as string, 
        {expiresIn: '5m'}
    );

    return {
        value: true,
        status: 200,
        message: "Codul de resetare a fost verificat cu succes!",
        token: resetToken
    };

}

export const modifyPassword = async (newPassword: string, token: string) => {

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as {userId: number};

        const userId = decoded.userId;

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        
        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                password: hashedNewPassword
            }
        });

        return {
            value: true,
            status: 200,
            message: "Parola a fost modificata cu succes! Te poti loga acum!"
        };

    } catch (error: any){

        if (error.name === "TokenExpiredError")
            return {
                value: false,
                status: 401,
                message: "Sesiunea a expirat (au trecut cele 5 minute). Te rugam sa reiei pasii!"
            }

        if (error.name === 'JsonWebTokenError')
            return {
                value: false,
                status: 401,
                message: "Token invalid sau de securitate compromisa"
            }

        console.error("Eroare neasteptata la modificarea parolei: ", error);
        throw error;
    }
}

export const refreshAccesToken = async (refreshToken: string) => {

    if (!refreshToken){
        throw new Error("Nu a fost trimis acel refreshToken!");
    }

    try {

        const decodedUser = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY as string) as any;

        const newAccesToken = jwt.sign({
            userId: decodedUser.id,
            email: decodedUser.email
        }, process.env.JWT_REFRESH_SECRET_KEY as string, 
        {expiresIn: '15m'});

        return {accesToken: newAccesToken}

    } catch (error){
        throw new Error("Din motive de securitate, te rugam sa te loghezi din nou!");
    }

};


async function checkResetCodeCount(id: number) {

    try {

        const codeCount = await prisma.resetCode.count({
            where: { 
                userId: id,
                createdAt: {
                    gte: new Date(Date.now() - 5 * 60 * 1000) //gte: greater than or equal
                }
             }
        })

        return codeCount;

    } catch (error) {
        
        console.error("Nu s-a putut realiza numararea codurilor generate de utilizator!");
        return undefined;

    }

}
