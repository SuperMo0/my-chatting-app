import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import {
    createFriendRequest,
    createNewMessage,
    acceptFriendRequest,
    markMessageAsRead
} from '../api/chat.api';
import type { Message, NewMessageBody } from 'super-chat-shared/chat';
import { createOptimisticMessage } from '../utils/optimistic-factory.util';
import type { GetCheckResponse } from 'super-chat-shared/api';

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
        onMutate: async ({ chatId, messageData }) => {
            await queryClient.cancelQueries({ queryKey: ['chat', 'messages', chatId] });

            const previousMessages = queryClient.getQueryData<InfiniteData<{ messages: Message[] }, string>>(['chat', 'messages', chatId]);

            const sessionData = queryClient.getQueryData<GetCheckResponse>(['auth', 'session']);
            const senderId = sessionData?.user?.id || 'optimistic_sender';

            const optimisticMessage = createOptimisticMessage(
                messageData.content || null,
                null,
                messageData.type || 'TEXT',
                senderId,
                chatId
            );

            queryClient.setQueryData<InfiniteData<{ messages: Message[] }, string>>(['chat', 'messages', chatId], (oldData) => {
                if (!oldData || !oldData.pages || oldData.pages.length === 0) return oldData;
                const newPages = [...oldData.pages];
                newPages[0] = {
                    ...newPages[0],
                    messages: [optimisticMessage, ...newPages[0].messages]
                };

                return {
                    ...oldData,
                    pages: newPages
                };
            });

            return { previousMessages, optimisticMessageId: optimisticMessage.id };
        },
        onError: (_err, variables, context) => {
            if (context?.previousMessages) {
                queryClient.setQueryData(['chat', 'messages', variables.chatId], context.previousMessages);
            }
        },
        onSuccess: (data, variables, context) => {
            queryClient.setQueryData<InfiniteData<{ messages: Message[] }, string>>(['chat', 'messages', variables.chatId], (oldData) => {
                if (!oldData || !oldData.pages || oldData.pages.length === 0) return oldData;
                const newPages = [...oldData.pages];
                newPages[0] = {
                    ...newPages[0],
                    messages: newPages[0].messages.map((msg) =>
                        msg.id === context?.optimisticMessageId ? data.message : msg
                    )
                };

                return {
                    ...oldData,
                    pages: newPages
                };
            });
            queryClient.invalidateQueries({ queryKey: ['chat', 'chats'] });
        },
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