import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import {
    getUserFriends,
    getAllUsers,
    getUserChats,
    getChatMessages,
    getUserFriendsRequestsTo,
    getUserFriendsRequestsBy
} from '../api/chat.api';

export const useUserFriends = () => {
    return useQuery({
        queryKey: ['chat', 'friends'],
        queryFn: getUserFriends,
        select: (data) => data.friends,
    });
};

export const useAllUsers = () => {
    return useQuery({
        queryKey: ['chat', 'all-users'],
        queryFn: getAllUsers,
        select: (data) => data.users,
    });
};

export const useUserChats = () => {
    return useQuery({
        queryKey: ['chat', 'chats'],
        queryFn: getUserChats,
        select: (data) => data.chats,
    });
};

export const useChatMessages = (chatId: string) => {
    return useInfiniteQuery({
        queryKey: ['chat', 'messages', chatId],
        queryFn: ({ pageParam }) => getChatMessages(chatId, pageParam),
        getNextPageParam: (lastPage) => lastPage.nextCursor || null,
        initialPageParam: null as string | null,
    });
};

export const useUserFriendsRequestsTo = () => {
    return useQuery({
        queryKey: ['chat', 'requests-to'],
        queryFn: getUserFriendsRequestsTo,
        select: (data) => data.requestsTo,
    });
};

export const useUserFriendsRequestsBy = () => {
    return useQuery({
        queryKey: ['chat', 'requests-by'],
        queryFn: getUserFriendsRequestsBy,
        select: (data) => data.requestsBy,
    });
};