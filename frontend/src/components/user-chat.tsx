import { useRef, useCallback, useEffect } from 'react'
import { useChatStore } from '../stores/chat.store.ts'
import UserChatHeader from './user-chat-header.jsx';
import MeBubble from './me-bubble.jsx'
import FriendBubble from './friend-bubble.jsx'
import ChatInput from './chat-input.jsx';
import { useCheckSession } from '../hooks/use-auth-queries.ts';
import { useChatMessages } from '../hooks/use-chat-queries.ts';
import { useMarkMessageAsRead } from '../hooks/use-chat-mutations.ts';
import { ClipLoader } from 'react-spinners';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';

export default function UserChat() {
    const { selectedChat } = useChatStore();
    const { data: authUser } = useCheckSession();
    const { mutate: markMessageAsRead } = useMarkMessageAsRead();
    const virtuosoRef = useRef<VirtuosoHandle>(null);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading
    } = useChatMessages(selectedChat?.id || "");

    const messages = data?.pages.flatMap(page => page.messages).reverse() || [];

    const firstItemIndex = 1000000 - messages.length;
    const loadMore = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const scrollToBottom = () => {
        virtuosoRef.current?.scrollToIndex({
            index: 'LAST',
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        if (isLoading) return;
        if (!messages || !messages.length || !selectedChat?.lastMessage) return;

        const lastMessage = selectedChat.lastMessage;
        const hasUnread = lastMessage.senderId !== authUser?.id && !lastMessage.isRead;

        if (hasUnread) {
            markMessageAsRead(lastMessage.id);
        }
    }, [selectedChat, authUser?.id, markMessageAsRead]);

    if (isLoading) return (
        <div className='flex items-center justify-center h-full bg-transparent'>
            <ClipLoader color='#3b82f6' size={40} />
        </div>
    );

    if (!selectedChat) return null;
    return (
        <div className='h-full flex flex-col bg-white/10 dark:bg-slate-900/20 backdrop-blur-2xl border border-white/20 dark:border-white/5 shadow-2xl overflow-hidden rounded-4xl transition-all duration-500'>
            <div className="z-10">
                <UserChatHeader />
            </div>

            <div className='flex-1 overflow-hidden px-4 md:px-6 py-4'>
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
                        <p className="text-xl font-black italic">Start of a new story...</p>
                    </div>
                ) : (
                    <Virtuoso
                        ref={virtuosoRef}
                        className="h-full w-full no-scrollbar"
                        data={messages}
                        firstItemIndex={firstItemIndex}
                        initialTopMostItemIndex={messages.length - 1}
                        startReached={loadMore}
                        followOutput={(isAtBottom) => (isAtBottom ? 'smooth' : false)}
                        alignToBottom
                        itemContent={(index, message) => (
                            <div className="pb-4">
                                {message.senderId === authUser?.id
                                    ? <MeBubble message={message} />
                                    : <FriendBubble message={message} />
                                }
                            </div>
                        )}
                        components={{
                            Header: () => isFetchingNextPage ? (
                                <div className='w-full flex justify-center py-4'>
                                    <ClipLoader color='#3b82f6' size={20} />
                                </div>
                            ) : null
                        }}
                    />
                )}
            </div>

            <div className='p-2 md:p-4 bg-white/5 dark:bg-black/5 backdrop-blur-md border-t border-white/10 dark:border-white/5'>
                <ChatInput onSend={scrollToBottom} chatId={selectedChat.id} />
            </div>
        </div>
    )
}