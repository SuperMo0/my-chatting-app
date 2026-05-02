import z from 'zod'
import { safeUserSchema } from './auth.types.js'


export const PostLoginResponseSchema = z.object({
    user: safeUserSchema
})

export type PostLoginResponse = z.infer<typeof PostLoginResponseSchema>

export const PostSignupResponseSchema = z.object({
    user: safeUserSchema
})

export type PostSignupResponse = z.infer<typeof PostSignupResponseSchema>

export const GetCheckResponseSchema = z.object({
    user: safeUserSchema.nullable()
})

export type GetCheckResponse = z.infer<typeof GetCheckResponseSchema>

export const PutUpdateProfileResponseSchema = z.object({
    user: safeUserSchema.nullable()
})

export type PutUpdateProfileResponse = z.infer<typeof PutUpdateProfileResponseSchema>

export const getSignUploadSignutureResponseSchema = z.object({
    signature: z.string(),
    timestamp: z.number(),
    cloudname: z.string(),
    apikey: z.string()
})
export type GetSignUploadSignutureResponse = z.infer<typeof getSignUploadSignutureResponseSchema>