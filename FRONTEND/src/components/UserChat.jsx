import React, { useCallback, useEffect } from 'react'
import { useChatStore } from './../stores/chat.store'
import UserChatHeader from './UserChatHeader';
import MeBubble from './MeBubble'
import FriendBubble from './FriendBubble'
import ChatInput from './ChatInput';
import { useAuthStore } from '../stores/auth.store.js';
import { ClipLoader } from 'react-spinners';
import { useChatScroll } from '../hooks/useChatScroll.js';

export default function UserChat() {
    const {
        getMessages,
        selectedChat,
        messages,
        markChatAsRead,
        hasMoreMessages,
        isLoadingMoreMessages
    } = useChatStore();

    const { authUser } = useAuthStore();

    const loadMoreItems = useCallback(() => {
        getMessages({ loadMore: true });
    }, [getMessages]);

    const { containerRef, scrollToBottom } = useChatScroll({
        chatId: selectedChat?.id,
        messages,
        hasMore: hasMoreMessages,
        loadMoreItems,
    });

    useEffect(() => {
        if (!selectedChat?.id) return;
        getMessages();
    }, [selectedChat?.id, getMessages]);

    useEffect(() => {
        if (!messages || !selectedChat?.lastMessage) return;

        const lastMessage = selectedChat.lastMessage;
        const hasUnread = lastMessage.senderId !== authUser.id && !lastMessage.isRead;

        if (hasUnread) {
            markChatAsRead(selectedChat);
        }
    }, [selectedChat, messages, authUser.id, markChatAsRead]);

    if (!messages) return (
        <div className='flex items-center justify-center h-full bg-transparent'>
            <ClipLoader color='#3b82f6' size={40} />
        </div>
    );

    return (
        <div className='h-full flex flex-col bg-white/10 dark:bg-slate-900/20 backdrop-blur-2xl border border-white/20 dark:border-white/5 shadow-2xl overflow-hidden rounded-4xl transition-all duration-500'>
            <div className="z-10">
                <UserChatHeader />
            </div>

            <div
                ref={containerRef}
                className='flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-4 no-scrollbar'
            >
                {isLoadingMoreMessages && (
                    <div className='w-full flex justify-center py-2'>
                        <ClipLoader color='#3b82f6' size={20} />
                    </div>
                )}
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
                        <p className="text-xl font-black italic">Start of a new story...</p>
                    </div>
                ) : (
                    messages.map((message) => (
                        message.senderId === authUser.id
                            ? <MeBubble key={message.id} message={message} />
                            : <FriendBubble key={message.id} message={message} />
                    ))
                )}
            </div>
            <div className='p-2 md:p-4 bg-white/5 dark:bg-black/5 backdrop-blur-md border-t border-white/10 dark:border-white/5'>
                <ChatInput onSend={scrollToBottom} />
            </div>
        </div>
    )
}
