import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import type { Chat } from 'super-chat-shared/chat';


interface ChatState {
    socket: Socket | null;
    isConnected: boolean;
    selectedChat: Chat | null;
    onlineUsers: string[];
    setSelectedChat: (chat: Chat | null) => void;
    connectSocket: () => Socket | undefined;
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
        const socket = io(url, {
            withCredentials: true,
        });

        socket.on('connect', () => set({ isConnected: true }));
        socket.on('disconnect', () => set({ isConnected: false }));

        socket.on('onlineUsers', (users: string[]) => {
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