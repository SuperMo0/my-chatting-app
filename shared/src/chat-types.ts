
import type { User } from "./user-type.js";

export type Chat = {
    id: string,
    users: User[]
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
    metaData?: Record<string, any>
}

export type NewMessage = {
    content: string | null,
    type?: string,
    metaData?: Record<string, any>
}

