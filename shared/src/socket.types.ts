import type { Message } from "./chat.types.js";


export interface ServerToClientEvents {
    messageIsReadEvent: (payload: Message) => void
    newMessageEvent: (payload: Message) => void
    onlineUsersListChangeEvent: (payload: string[]) => void
    friendRequestsToUserListChangeEvent: () => void
    friendsListChangeEvent: () => void
    userChatsChangeEvent: () => void
}
export interface ClientToServerEvents {
    // messageIsReadEvent: (payload: Message) => void

}
export interface InterServerEvents { /* ... */ }
export interface SocketData {
    userId: string;
}