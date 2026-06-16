import { prisma } from "../config/db";
import bcrypt from 'bcrypt';
import { ChangePasswordParams } from "../types/user.types";

export const updateUserPassword = async (userId: number, payload: ChangePasswordParams) => {

    try {

        const user = await prisma.user.findFirst({
            where: {
                id: userId
            },
            select: {
                password: true
            }
        });

        if (!user) {
            return { value: false, message: "Utilizatorul nu a fost găsit!" };
        }

        const verify = await bcrypt.compare(payload.oldPassword, user.password)

        if (!verify)
            return { value: false, message: "Verificarea parolei vechi a esuat! Asigurate ca ai scris bine parola!" }

        const hashedPassword = await bcrypt.hash(payload.newPassword, 10);

        await prisma.user.update({
            where:{
                id: userId
            },
            data: {
                password: hashedPassword
            }
        })

        return { value: true, message: "Parola a fost actualizata cu succes!" }

    } catch (error: any){
        console.error(error);
        return { value: false };
    }

}