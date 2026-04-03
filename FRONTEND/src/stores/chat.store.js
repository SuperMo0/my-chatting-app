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
    isLoadingMoreMessages: false,
    hasMoreMessages: true,
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
            set(produce((state) => { state.friends = result.data.friends; }));
        } catch (error) {
            toast.error("Couldn't sync your friends list.");
        }
    },

    getChats: async () => {
        set(produce((state) => { state.isGettingChats = true; }));
        try {
            const result = await api.get('/app/chats');
            set(produce((state) => { state.chats = result.data.chats; }));
        } catch (error) {
            toast.error("Couldn't load conversations.");
        } finally {
            set(produce((state) => { state.isGettingChats = false; }));
        }
    },

    getUsers: async () => {
        try {
            const result = await api('/app/users');
            set(produce((state) => { state.users = result.data.users; }));
        } catch (error) {
            toast.error("Failed to fetch user directory.");
        }
    },

    setSelectedChat: (selectedChat) => {
        set(produce((state) => {
            state.selectedChat = selectedChat;
            state.messages = null;
            state.hasMoreMessages = true;
            state.isLoadingMoreMessages = false;
        }));
        if (selectedChat && selectedChat.id === "1") {
            set(produce((state) => {
                state.selectedFriend = {
                    id: "1",
                    name: "Global Chat",
                    avatar: "https://thumbs.dreamstime.com/b/global-people-network-connection-blue-earth-ai-generated-user-icons-connected-around-glowing-globe-represents-419468051.jpg"
                };
            }));
            return;
        }
        if (selectedChat) {
            const friend = getFriend(useAuthStore.getState().authUser.id, selectedChat);
            set(produce((state) => { state.selectedFriend = friend; }));
        } else {
            set(produce((state) => { state.selectedFriend = null; }));
        }
    },

    getMessages: async ({ loadMore = false } = {}) => {
        const { selectedChat, messages, hasMoreMessages, isLoadingMoreMessages } = get();
        if (!selectedChat) return;

        if (loadMore && (!hasMoreMessages || isLoadingMoreMessages)) return;

        if (loadMore) {
            set(produce((state) => { state.isLoadingMoreMessages = true; }));
        } else {
            set(produce((state) => {
                state.isLoading = true;
                state.messages = null;
                state.hasMoreMessages = true;
            }));
        }

        try {
            const params = { limit: 20 };
            if (loadMore && messages?.length > 0) {
                params.before = messages[0].timestamp;
            }

            const result = await api.get(`/app/chat/${selectedChat.id}/messages`, { params });
            const fetchedMessages = result.data.messages || [];
            const hasMore = Boolean(result.data.hasMore);

            set(produce((state) => {
                if (loadMore) {
                    const currentIds = new Set(state.messages.map(m => m.id));
                    const uniqueFetched = fetchedMessages.filter(m => !currentIds.has(m.id));

                    uniqueFetched.reverse().forEach((msg) => {
                        state.messages.unshift(msg);
                    });

                    state.hasMoreMessages = hasMore;
                    state.isLoadingMoreMessages = false;
                } else {
                    state.messages = fetchedMessages;
                    state.hasMoreMessages = hasMore;
                    state.isLoading = false;
                }
            }));
        } catch (error) {
            toast.error("Failed to load message history.");
            set(produce((state) => {
                state.isLoading = false;
                state.isLoadingMoreMessages = false;
            }));
        }
    },

    sendMessage: async (content, imageUrl) => {
        const { selectedChat, messages, chats } = get();
        const { authUser } = useAuthStore.getState();
        if (!selectedChat) return;

        const optimisticMsg = createOptimisticMessage(content, imageUrl, imageUrl ? "image" : "text", authUser.id, selectedChat.id);

        const prevMessages = messages ? messages.slice() : [];
        const prevChats = chats ? chats.slice() : [];

        set(produce((state) => {
            if (!state.messages) state.messages = [];
            state.messages.push(optimisticMsg);

            if (state.chats) {
                const chat = state.chats.find(c => c.id === selectedChat.id);
                if (chat) chat.lastMessage = optimisticMsg;
            }
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
            set(produce((state) => { state.requestsByUser = result.data.requestsBy; }));
        } catch (error) {
            console.error(error);
        }
    },

    getRequestsToUser: async () => {
        set(produce((state) => { state.isGettingRequestsToUser = true; }));
        try {
            const result = await api.get('/app/requests/to');
            set(produce((state) => { state.requestsToUser = result.data.requestsTo; }));
        } catch (error) {
            console.error(error);
        } finally {
            set(produce((state) => { state.isGettingRequestsToUser = false; }));
        }
    },

    sendNewRequest: async (receiver) => {
        try {
            const result = await api.post(`/app/request/${receiver.id}`);
            set(produce((state) => {
                if (!state.requestsByUser) state.requestsByUser = [];
                state.requestsByUser.push(result.data.request);
            }));
            toast.success("Request sent!");
        } catch (error) {
            toast.error('Could not send request.');
        }
    },

    acceptRequest: async (request) => {
        try {
            await api.put(`/app/request/${request.id}`);
            set(produce((state) => {
                if (state.requestsToUser) {
                    const idx = state.requestsToUser.findIndex((r) => r.id === request.id);
                    if (idx !== -1) state.requestsToUser.splice(idx, 1);
                }
            }));
            toast.success("Friend request accepted!");
        } catch (error) {
            toast.error('Failed to accept request.');
        }
    },

    markChatAsRead: async (chat) => {
        if (!chat || chat.id === "1") return;

        set(produce((state) => {
            if (state.chats) {
                const targetChat = state.chats.find(c => c.id === chat.id);
                if (targetChat && targetChat.lastMessage) {
                    targetChat.lastMessage.isRead = true;
                }
            }
        }));

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
            set(produce((state) => { state.onlineUsers = onlineUsers; }));
        });

        socket.on("chatUpdate", (chat) => {
            const { selectedChat } = get();
            const { authUser } = useAuthStore.getState();

            const isSelected = selectedChat?.id === chat.id;

            set(produce((state) => {
                if (isSelected && state.messages) {
                    const msgIdx = state.messages.findIndex(m => m.isOptimistic && m.content === chat.lastMessage.content);
                    if (msgIdx !== -1) {
                        state.messages.splice(msgIdx, 1);
                    }

                    state.messages.push(chat.lastMessage);

                    if (chat.lastMessage.senderId !== authUser.id) {
                        chat.lastMessage.isRead = true;
                        if (chat.id !== "1") socket.emit("messageReadUpdate", chat.lastMessage);
                    }
                }

                if (state.chats) {
                    const chatIdx = state.chats.findIndex((c) => c.id === chat.id);
                    if (chatIdx !== -1) {
                        state.chats.splice(chatIdx, 1);
                    }
                    state.chats.unshift(chat);
                }
            }));
        });

        socket.on("friendsUpdate", (friend) => {
            set(produce((state) => {
                if (!state.friends) state.friends = [];
                state.friends.push(friend);
            }));
        });

        socket.on("chatIsRead", (chat) => {
            const { selectedChat } = get();
            const { authUser } = useAuthStore.getState();
            if (!selectedChat || chat.id !== selectedChat.id) return;

            set(produce((state) => {
                if (state.messages) {
                    state.messages.forEach(m => {
                        if (m.senderId === authUser.id) {
                            m.isRead = true;
                            m.readAt = chat.lastMessage.readAt;
                        }
                    });
                }
            }));
        });

        socket.on("requestsToUserUpdate", (request) => {
            set(produce((state) => {
                if (!state.requestsToUser) state.requestsToUser = [];
                state.requestsToUser.push(request);
            }));
        });

        socket.on("messageReadUpdate", (message) => {
            const { selectedChat } = get();
            if (!selectedChat || message.chatId !== selectedChat.id) return;

            set(produce((state) => {
                if (state.messages) {
                    const msg = state.messages.find(m => m.id === message.id);
                    if (msg) {
                        Object.assign(msg, message);
                    }
                }
            }));
        });

        set(produce((state) => { state.socket = socket; }));
        return socket;
    }
}));
