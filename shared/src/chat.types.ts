import type { SafeUser } from "./auth.types.js";

export type Chat = {
    id: string,
    users: SafeUser[]
    name?: string,
    lastMessage?: Message
}

export type Message = {
    id: string,
    content: string | null,
    type: string,
    senderId: string,
    timestamp: Date,
    isRead: boolean,
    readAt: Date | null,
}

export type NewMessage = {
    content: string | null,
    type?: string,
    metaData?: Record<string, any>
}

