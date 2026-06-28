import { z } from 'zod'

const minAgeDate = new Date();
minAgeDate.setFullYear(minAgeDate.getFullYear() - 11);

export const signupSchema = z.object({
    firstName: z
        .string()
        .nonempty({message: "Prenumele este obligatoriu!"}),
        lastName: z
            .string()
            .nonempty({message: "Numele este obligatoriu!"}),
        username: z
            .string()
            .min(5, { message: "Numele de utilizator trebuie să aibă cel putin 5 caractere!" })
            .max(20, { message: "Numele de utilizator trebuie să aibă cel mult 20 de caractere!" })
            .nonempty({message: "Numele de utilizator este obligatoriu!"}),
        email: z.email({ message: "Introdu o adresa de email valida!" }),
        birthDate: z
        .date({
           error: issue => issue.input === undefined ? "Data nașterii este obligatorie!" : "Dată invalida!"
        })
        .min(new Date("1900-01-01"), {message: "Data nașterii este prea veche pentru un cont valid!"})
        .max(minAgeDate, {message: "Trebuie să ai minim 11 ani pentru a crea un cont!"}),
        password: z
            .string()
            .min(8, {message: "Parola trebuie să aibă cel puțin 8 caractere!"})
            .regex(/[A-Z]/, {message: "Parola trebuie să contină cel puțin o litera mare!"})
            .regex(/[0-9]/, {message: "Parola trebuie să contină cel puțin o cifra!"})
            .regex(/[^a-zA-Z0-9]/, {message: "Parola trebuie să contină cel puțin un caracter special!"}),
        repeatPassword: z
            .string()
            .nonempty({message: "Reintrodu parola!"})
}).refine((data) => data.password === data.repeatPassword, {message: "Parolele nu coincid!", path: ["repeatPassword"]})

export const loginSchema = z.object({
    email: z
        .email({message: "Introdu o adresa de email valida!"})
        .nonempty({message: "Câmpul email este gol!"}),
    password: z
        .string()
        .min(1, {message: "Câmpul parolă este gol!"})
})

export const resetPasswordSchema = z.object({
    email: z
        .email({message: "Introdu o adresa de email valida!"})
        .nonempty({message: "Câmpul email este gol"})
})

export const insertResetCodeSchema = z.object({
    code: z
        .string()
        .regex(/^\d{6}$/, {message: "Codul trebuie să contină exact 6 cifre!"}),
})

export const modifyPasswordSchema = z.object({
    password: z
        .string()
        .min(8, {message: "Parola trebuie să aibă cel puțin 8 caractere!"})
        .regex(/[A-Z]/, {message: "Parola trebuie să contină cel putin o litera mare!"})
        .regex(/[0-9]/, {message: "Parola trebuie să conțină cel puțin o cifra!"})
        .regex(/[^a-zA-Z0-9]/, {message: "Parola trebuie să contină cel puțin un caracter special!"}),
    repeatPassword: z
        .string()
        .nonempty({message: "Reintrodu parola!"})
}).refine((data) => data.password === data.repeatPassword, {message: "Parolele nu coincid!", path: ["repeatPassword"]})

export const changePasswordSchema = z.object({
    oldPassword: z
        .string()
        .nonempty({message: "Parola veche este obligatorie!"}),
    newPassword: z
        .string()
        .min(8, {message: "Parola noua trebuie să aibă cel puțin 8 caractere!"})
        .regex(/[A-Z]/, {message: "Parola trebuie să contină cel puțin o litera mare!"})
        .regex(/[0-9]/, {message: "Parola trebuie să contină cel puțin o cifra!"})
        .regex(/[^a-zA-Z0-9]/, {message: "Parola trebuie să contină cel puțin un caracter special!"}),
    repeatNewPassword: z
        .string()
        .nonempty({message: "Reintrodu noua parola!"})
}).refine((data) => data.newPassword === data.repeatNewPassword, {message: "Parolele nu coincid!", path: ["repeatNewPassword"]})


export type SignUpFormValues = z.infer<typeof signupSchema>
export type LoginFormValues = z.infer<typeof loginSchema>
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>
export type InsertResetCodeValues = z.infer<typeof insertResetCodeSchema>
export type ModifyPasswordValues = z.infer<typeof modifyPasswordSchema>
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>
