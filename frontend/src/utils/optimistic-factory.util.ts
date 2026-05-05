import type { Message } from "super-chat-shared/chat";

export function createOptimisticMessage(content: string | null,
    imageUrl: string | null,
    type: string,
    senderId: string,
    chatId: string): Message {
    return {
        id: crypto.randomUUID(),
        content,
        type,
        senderId,
        chatId,
        timestamp: new Date(),
        isRead: false,
        readAt: null,
    }
}