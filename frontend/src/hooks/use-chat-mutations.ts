import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    createFriendRequest,
    createNewMessage,
    acceptFriendRequest,
    markMessageAsRead
} from '../api/chat.api';
import type { NewMessageBody } from 'super-chat-shared/chat';

export const useCreateFriendRequest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (receiverId: string) => createFriendRequest(receiverId),
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['chat', 'requests-by'] });
        }
    });
};

export const useCreateNewMessage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ chatId, messageData }: { chatId: string; messageData: NewMessageBody }) =>
            createNewMessage(chatId, messageData),
        onSuccess: (data, variables) => {
            // Optimistically update the infinite query 
            queryClient.setQueryData(['chat', 'messages', variables.chatId], (oldData: any) => {
                if (!oldData || !oldData.pages || oldData.pages.length === 0) return oldData;

                const newPages = [...oldData.pages];
                newPages[0] = {
                    ...newPages[0],
                    messages: [data.message, ...newPages[0].messages]
                };

                return {
                    ...oldData,
                    pages: newPages
                };
            });
            // Update chat list
            queryClient.invalidateQueries({ queryKey: ['chat', 'chats'] });
        },
        onSettled: (_, __, variables) => {
            // Fallback invalidation
            // queryClient.invalidateQueries({ queryKey: ['chat', 'messages', variables.chatId] });
        }
    });
};

export const useAcceptFriendRequest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (requestId: string) => acceptFriendRequest(requestId),
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['chat', 'friends'] });
            queryClient.invalidateQueries({ queryKey: ['chat', 'chats'] });
            queryClient.invalidateQueries({ queryKey: ['chat', 'requests-to'] });
        }
    });
};

export const useMarkMessageAsRead = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (messageId: string) => markMessageAsRead(messageId),
        onSuccess: (data) => {
            // Optimistically just swap the message
            queryClient.setQueryData(['chat', 'messages', data.message.chatId], (oldData: any) => {
                if (!oldData || !oldData.pages) return oldData;

                return {
                    ...oldData,
                    pages: oldData.pages.map((page: any) => ({
                        ...page,
                        messages: page.messages.map((msg: any) =>
                            msg.id === data.message.id ? data.message : msg
                        )
                    }))
                };
            });
            queryClient.invalidateQueries({ queryKey: ['chat', 'chats'] });
        }
    });
};