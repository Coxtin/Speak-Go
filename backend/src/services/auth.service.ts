import bcrypt from 'bcrypt';
import { prisma } from '../config/db';
import jwt from 'jsonwebtoken';

const EMAIL_ALREADY_EXISTS_ERROR = "Exista deja un cont cu acest email!";
const INVALID_CREDENTIALS_ERROR = "Email sau parola incorecta!";
//const JWT_SECRET = process.env.JWT_SECRET_KEY || 'parola-secreta';

export const registerNewUser = async (userData: any) => {

    try{

        const existingUser = await prisma.users.findUnique({
            where: {
                email: userData.email
            }
        });

        if (existingUser){
            throw new Error(EMAIL_ALREADY_EXISTS_ERROR);
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const insertedUser = await prisma.users.create({
            data : {
                firstname: userData.firstName,
                lastname: userData.lastName,
                username: userData.username,
                email: userData.email,
                birthDate: userData.birthDate,
                password: hashedPassword
            }
        });

        return {
            id: insertedUser.id,
            firstName: insertedUser.firstname,
            lastName: insertedUser.lastname,
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

       const person = await prisma.users.findUnique({
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
