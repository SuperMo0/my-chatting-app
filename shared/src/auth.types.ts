import zod from "zod";

export const loginBodySchema = zod.object({
    email: zod.email("Please enter a valid email address."),
    password: zod.string().min(3, "Password must be at least 3 characters long.")
})

export const signupBodySchema = loginBodySchema.extend({
    name: zod.string().min(2, "Name must be at least 2 characters long.")
})

export const safeUserSchema = zod.object({
    name: zod.string(),
    avatar: zod.url().nullable(),
    id: zod.string()
})

export type SafeUser = zod.infer<typeof safeUserSchema>;
export type LoginBody = zod.infer<typeof loginBodySchema>;
export type SignupBody = zod.infer<typeof signupBodySchema>;