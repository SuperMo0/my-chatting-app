
import type { Chat } from 'shared/chat'
export function getReceivers(userId: string, chat: Chat) {
    return chat.users.filter((u) => u.id != userId);
}