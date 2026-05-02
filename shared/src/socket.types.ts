import type { Message } from "./chat.types.js";


export interface ServerToClientEvents {
    messageIsReadEvent: (payload: Message) => void
    onlineUsersListChangeEvent: () => void
}
export interface ClientToServerEvents {
    messageIsReadEvent: (payload: Message) => void

}
export interface InterServerEvents { /* ... */ }
export interface SocketData {
    userId: string;
}