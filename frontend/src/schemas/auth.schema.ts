import { z } from 'zod'

export const signupSchema = z.object({
    firstName: z
        .string()
        .nonempty({message: "First name required!"}),
        lastName: z
            .string()
            .nonempty({message: "Last name required!"}),
        username: z
            .string()
            .min(5, { message: "Username must be at least 5 characters!" })
            .max(20, { message: "Username must be at most 20 characters!" })
            .nonempty({message: "Username required!"}),
        email: z.email({ message: "Enter a valid email address!" }),
        birthDate: z
        .date({
           error: issue => issue.input === undefined ? "Please enter your birth date!" : "Invalid date!"
        })
        .min(new Date("1900-01-01"), {message: "You are to old to create an accoun!"})
        .max(new Date(), {message: "You are too young to create an account"}),
        password: z
            .string()
            .min(8, {message: "Password must be at least 8 characters!"})
            .regex(/[A-Z]/, {message: "Password must contain at least one capital letter!"})
            .regex(/[0-9]/, {message: "Password must contain at least one number!"})
            .regex(/[^a-zA-Z0-9]/, {message: "Password must contain at least one special character!"}),
        repeatPassword: z
            .string()
            .nonempty({message: "Retype password!"})
}).refine((data) => data.password === data.repeatPassword, {message: "The passwords do not match!", path: ["repeatPassword"]})

export type SignUpFormValues = z.infer<typeof signupSchema>
