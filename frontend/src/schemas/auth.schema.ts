import { z } from 'zod'

export const signupSchema = z.object({
    firstName: z
        .string()
        .nonempty({message: "Prenumele este obligatoriu!"}),
        lastName: z
            .string()
            .nonempty({message: "Numele este obligatoriu!"}),
        username: z
            .string()
            .min(5, { message: "Numele de utilizator trebuie sa aiba cel putin 5 caractere!" })
            .max(20, { message: "Numele de utilizator trebuie sa aiba cel mult 20 de caractere!" })
            .nonempty({message: "Numele de utilizator este obligatoriu!"}),
        email: z.email({ message: "Introdu o adresa de email valida!" }),
        birthDate: z
        .date({
           error: issue => issue.input === undefined ? "Data nasterii este obligatorie!" : "Data invalida!"
        })
        .min(new Date("1900-01-01"), {message: "Data nasterii este prea veche pentru un cont valid!"})
        .max(new Date(), {message: "Data nasterii nu poate fi in viitor!"}),
        password: z
            .string()
            .min(8, {message: "Parola trebuie sa aiba cel putin 8 caractere!"})
            .regex(/[A-Z]/, {message: "Parola trebuie sa contina cel putin o litera mare!"})
            .regex(/[0-9]/, {message: "Parola trebuie sa contina cel putin o cifra!"})
            .regex(/[^a-zA-Z0-9]/, {message: "Parola trebuie sa contina cel putin un caracter special!"}),
        repeatPassword: z
            .string()
            .nonempty({message: "Reintrodu parola!"})
}).refine((data) => data.password === data.repeatPassword, {message: "Parolele nu coincid!", path: ["repeatPassword"]})

export const loginSchema = z.object({
    email: z
        .email({message: "Introdu o adresa de email valida!"})
        .nonempty({message: "Campul email este gol!"}),
    password: z
        .string()
        .min(1, {message: "Campul parola este gol!"})
})


export type SignUpFormValues = z.infer<typeof signupSchema>
export type LoginFormValues = z.infer<typeof loginSchema>
