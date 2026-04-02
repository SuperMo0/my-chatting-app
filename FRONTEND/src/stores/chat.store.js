import { create } from "zustand"
import api from "../lib/axios.js";
import { toast } from "react-toastify";
import { getFriend } from "../utils/utils.js";
import { useAuthStore } from "./auth.store.js";
import { io } from 'socket.io-client'
import { produce } from 'immer'
import { createOptimisticMessage } from "./../utils/chat.js";

export const useChatStore = create((set, get) => ({
    isLoading: false,
    messages: null,
    friends: null,
    chats: null,
    users: null,
    onlineUsers: null,
    selectedFriend: null,
    selectedChat: null,
    requestsByUser: null,
    requestsToUser: null,
    isGettingChats: false,
    isGettingRequestsToUser: false,
    socket: null,

    getFriends: async () => {
        try {
            const result = await api.get('/app/friends');
            set({ friends: result.data.friends });
        } catch (error) {
            toast.error("Couldn't sync your friends list.");
        }
    },

    getChats: async () => {
        set({ isGettingChats: true });
        try {
            const result = await api.get('/app/chats');
            set({ chats: result.data.chats });
        } catch (error) {
            toast.error("Couldn't load conversations.");
        } finally {
            set({ isGettingChats: false });
        }
    },

    getUsers: async () => {
        try {
            const result = await api('/app/users');
            set({ users: result.data.users });
        } catch (error) {
            toast.error("Failed to fetch user directory.");
        }
    },

    setSelectedChat: (selectedChat) => {
        set({ selectedChat });
        if (selectedChat && selectedChat.id === "1") {
            set({
                selectedFriend: {
                    id: "1",
                    name: "Global Chat",
                    avatar: "https://thumbs.dreamstime.com/b/global-people-network-connection-blue-earth-ai-generated-user-icons-connected-around-glowing-globe-represents-419468051.jpg"
                }
            });
            return;
        }
        if (selectedChat) {
            const friend = getFriend(useAuthStore.getState().authUser.id, selectedChat);
            set({ selectedFriend: friend });
        } else {
            set({ selectedFriend: null });
        }
    },

    getMessages: async () => {
        const { selectedChat } = get();
        if (!selectedChat) return;
        set({ isLoading: true });
        try {
            const result = await api.get(`/app/chat/${selectedChat.id}/messages`);
            set({ messages: result.data.messages });
        } catch (error) {
            toast.error("Failed to load message history.");
        } finally {
            set({ isLoading: false });
        }
    },

    sendMessage: async (content, imageUrl) => {
        const { selectedChat, messages, chats } = get();
        const { authUser } = useAuthStore.getState();
        if (!selectedChat) return;

        const optimisticMsg = createOptimisticMessage(content, imageUrl, imageUrl ? "image" : "text", authUser.id, selectedChat.id);

        const prevMessages = [...(messages || [])];
        const prevChats = [...(chats || [])];

        set(produce((state) => {
            state.messages.push(optimisticMsg);
            let chatPos = state.chats.findIndex(c => c.id === selectedChat.id);
            state.chats[chatPos].lastMessage = optimisticMsg;
        }));

        try {
            await api.post(`app/message/${selectedChat.id}`, { content, imageUrl });
        } catch (error) {
            toast.error("Message failed to send.");
            set(produce((state) => {
                state.messages = prevMessages;
                state.chats = prevChats;
            }));
            throw error;
        }
    },

    getRequestsByUser: async () => {
        try {
            const result = await api.get('/app/requests/by');
            set({ requestsByUser: result.data.requestsBy });
        } catch (error) {
            console.error(error);
        }
    },

    getRequestsToUser: async () => {
        set({ isGettingRequestsToUser: true });
        try {
            const result = await api.get('/app/requests/to');
            set({ requestsToUser: result.data.requestsTo });
        } catch (error) {
            console.error(error);
        } finally {
            set({ isGettingRequestsToUser: false });
        }
    },

    sendNewRequest: async (receiver) => {
        const prevRequests = [...(get().requestsByUser || [])];
        try {
            const result = await api.post(`/app/request/${receiver.id}`);
            set({ requestsByUser: [...prevRequests, result.data.request] });
            toast.success("Request sent!");
        } catch (error) {
            toast.error('Could not send request.');
        }
    },

    acceptRequest: async (request) => {
        const prevTo = [...(get().requestsToUser || [])];
        try {
            await api.put(`/app/request/${request.id}`);
            set({ requestsToUser: prevTo.filter((r) => r.id !== request.id) });
            toast.success("Friend request accepted!");
        } catch (error) {
            toast.error('Failed to accept request.');
        }
    },

    markChatAsRead: async (chat) => {
        if (!chat || chat.id === "1") return;

        const prevChats = [...(get().chats || [])];
        const newChats = prevChats.map(c =>
            c.id === chat.id ? { ...c, lastMessage: { ...c.lastMessage, isRead: true } } : c
        );

        set({ chats: newChats });
        try {
            await api.put(`app/chat/${chat.id}/read`);
        } catch (error) {
            console.error("Failed to mark as read", error);
        }
    },

    connectSocket: () => {

        const { authUser } = useAuthStore.getState();
        let url = import.meta.env.MODE == 'production' ? '/' : 'http://localhost:3000'
        const socket = io(url, {
            withCredentials: true,
        });


        socket.on('onlineUsers', (onlineUsers) => {
            set({ onlineUsers: onlineUsers })

        });

        socket.on("chatUpdate", (chat) => {
            const { chats, selectedChat, messages } = get();
            const { authUser } = useAuthStore.getState();

            const isSelected = selectedChat?.id === chat.id;

            if (isSelected) {
                const currentMessages = messages || [];

                const filteredMessages = currentMessages.filter(m =>
                    !(m.isOptimistic && m.content === chat.lastMessage.content)
                );

                set({ messages: [...filteredMessages, chat.lastMessage] });

                if (chat.lastMessage.senderId !== authUser.id) {
                    chat.lastMessage.isRead = true;
                    if (chat.id !== "1") socket.emit("messageReadUpdate", chat.lastMessage);
                }
            }

            const otherChats = chats ? chats.filter((c) => c.id !== chat.id) : [];
            set({ chats: [chat, ...otherChats] });
        });

        socket.on("friendsUpdate", (friend) => {
            const currentFriends = get().friends || [];
            set({ friends: [...currentFriends, friend] });
        });

        socket.on("chatIsRead", (chat) => {
            const { selectedChat, messages } = get();
            const { authUser } = useAuthStore.getState();
            if (!selectedChat || chat.id !== selectedChat.id) return;

            const newMessages = (messages || []).map((m) =>
                (m.senderId === authUser.id) ? { ...m, isRead: true, readAt: chat.lastMessage.readAt } : m
            );
            set({ messages: newMessages });
        });

        socket.on("requestsToUserUpdate", (request) => {
            const currentTo = get().requestsToUser || [];
            set({ requestsToUser: [...currentTo, request] });
        });

        socket.on("messageReadUpdate", (message) => {
            const { selectedChat, messages } = get();
            if (!selectedChat || message.chatId !== selectedChat.id) return;

            const newMessages = (messages || []).map((m) => m.id === message.id ? message : m);
            set({ messages: newMessages });
        });

        set({ socket });
        return socket;
    }
}));