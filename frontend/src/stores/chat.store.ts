import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import type { Chat } from 'super-chat-shared/chat';
import type { ClientToServerEvents, ServerToClientEvents } from 'super-chat-shared/socket'

type ClientSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

interface ChatState {
    socket: ClientSocket | null;
    isConnected: boolean;
    selectedChat: Chat | null;
    onlineUsers: string[];
    setSelectedChat: (chat: Chat | null) => void;
    connectSocket: () => ClientSocket | undefined;
    disconnectSocket: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
    socket: null,
    isConnected: false,
    selectedChat: null,
    onlineUsers: [],

    setSelectedChat: (chat) => set({ selectedChat: chat }),

    connectSocket: () => {
        if (get().socket?.connected) return get().socket!;

        let url = import.meta.env.MODE === 'production' ? '/' : 'http://localhost:3000';
        const socket: ClientSocket = io(url, {
            withCredentials: true,
        });

        socket.on('connect', () => set({ isConnected: true }));
        socket.on('disconnect', () => set({ isConnected: false }));

        socket.on('onlineUsersListChangeEvent', (users) => {
            set({ onlineUsers: users });
        });

        set({ socket });
        return socket;
    },

    disconnectSocket: () => {
        get().socket?.disconnect();
        set({ socket: null, isConnected: false, selectedChat: null });
    }
}));