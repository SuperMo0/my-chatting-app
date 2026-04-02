import type { Message } from 'shared/chat';

export const createOptimisticMessage = (content: string | null, imageUrl: string | null, type: string, senderId: string): Message => {
    return {
        id: crypto.randomUUID(),
        content,
        type,
        senderId,
        timestamp: new Date(),
        isRead: false,
        readAt: null,
        metaData: imageUrl ? { imageUrl } : undefined
    }
}