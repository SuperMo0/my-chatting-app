import { create } from "zustand"
import api from '../lib/axios.js'
import { toast } from 'react-toastify';
import { useChatStore } from "./chat.store.js";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningIn: false,
    isChecking: true,
    isSigningUp: false,

    check: async () => {
        try {
            const res = await api.get('/auth/check');
            set({ authUser: res.data.user });
        } catch (error) {
            if (error.code === "ERR_NETWORK") {
                toast.error('Connection lost. Please check your internet and try again.');
            }

            set({ authUser: null });
        } finally {
            set({ isChecking: false });
        }
    },

    login: async (data) => {
        set({ isSigningIn: true });
        try {
            const res = await api.post('/auth/login', data);
            set({ authUser: res.data.user });
            toast.success(`Welcome back, ${res.data.user.name}!`);
        } catch (error) {
            if (error.code === "ERR_NETWORK") {
                toast.error('Unable to reach the server. Try again in a moment.');
            } else {
                const message = error.response?.data?.message || "Login failed";
                toast.error(message);
            }
        } finally {
            set({ isSigningIn: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const result = await api.post('/auth/signup', data);
            const user = result.data.user;
            set({ authUser: user });
            toast.success("Account created successfully!");
        } catch (error) {
            const message = error.response?.data?.message || "Sign up failed";
            toast.error(message);
        } finally {
            set({ isSigningUp: false });
        }
    },

    logout: async () => {
        try {
            await api.post('/auth/logout');

            const chatStore = useChatStore.getState();
            if (chatStore.socket) {
                chatStore.socket.disconnect();
            }

            useChatStore.setState({
                messages: null,
                friends: null,
                chats: null,
                users: null,
                onlineUsers: [],
                selectedChat: null,
                selectedFriend: null,
                socket: null
            });

            set({ authUser: null });
            toast.info("Logged out successfully.");
        } catch (error) {
            toast.error("Logout failed. Please try again.");
        }
    }
}))