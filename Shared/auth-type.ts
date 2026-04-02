import zod from "zod";

export const UserLoginSchema = zod.object({
    email: zod.email("Please enter a valid email address."),
    password: zod.string().min(5, "Password must be at least 5 characters long.")
})

export const UserSignupSchema = UserLoginSchema.extend({
    name: zod.string().min(2, "Name must be at least 2 characters long.")
})

export const UserOutSchema = zod.object({
    name: zod.string(),
    email: zod.email(),
    avatar: zod.url(),
    id: zod.string()
})

export type UserOut = zod.infer<typeof UserOutSchema>;
export type UserLogin = zod.infer<typeof UserLoginSchema>;
export type UserSignup = zod.infer<typeof UserSignupSchema>;