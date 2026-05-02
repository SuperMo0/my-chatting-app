import z from "zod";


export const updateProfileBodySchema = z.object({
    name: z.string().optional(),
    avatar: z.url().optional()
})

export type UpdateProfileBody = z.infer<typeof updateProfileBodySchema>