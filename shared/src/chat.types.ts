import z from "zod";
import { safeUserSchema } from "./auth.types.js";



export const MessageSchema = z.object({
    id: z.string(),
    content: z.string().nullable(),
    type: z.string(),
    senderId: z.string(),
    timestamp: z.date(),
    isRead: z.boolean(),
    readAt: z.date().nullable(),
});

export type Message = z.infer<typeof MessageSchema>;

export const ChatSchema = z.object({
    id: z.string(),
    users: z.array(safeUserSchema),
    name: z.string().nullable(),
    lastMessage: MessageSchema.nullable()
});

export type Chat = z.infer<typeof ChatSchema>;

export const NewMessageSchema = z.object({
    content: z.string().nullable(),
    type: z.string().optional(),
});

export type NewMessage = z.infer<typeof NewMessageSchema>;

