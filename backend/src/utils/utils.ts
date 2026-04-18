
import type { Chat } from '../../../shared/src/chat-types.js'
export function getReceivers(userId: string, chat: Chat) {
    return chat.users.filter((u) => u.id != userId);
}