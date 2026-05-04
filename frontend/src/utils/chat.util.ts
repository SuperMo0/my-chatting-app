import type { Chat } from 'super-chat-shared/chat'

export function getFriend(userId: string, chat: Chat) {
    return chat.users[0].id != userId ? chat.users[0] : chat.users[1];
}