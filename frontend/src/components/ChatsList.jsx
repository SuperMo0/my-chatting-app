import React, { useMemo } from 'react'
import { useChatStore } from '../stores/chat.store.js'
import { getFriend, cn } from '../utils/utils.js';
import { useAuthStore } from '../stores/auth.store.js';
import Badge from '@mui/material/Badge';

const ChatSkeleton = () => (
    <div className="flex gap-3 p-3 animate-pulse">
        <div className="w-14 h-14 bg-slate-200 dark:bg-slate-800 rounded-full" />
        <div className="flex-1 space-y-2 py-2">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full" />
        </div>
    </div>
);

export default function ChatsList() {
    const { chats, setSelectedChat, onlineUsers, isGettingChats } = useChatStore();
    const { authUser } = useAuthStore();

    const sortedChats = useMemo(() => {
        if (!chats) return [];
        return [...chats].sort((a, b) => {
            const dateA = new Date(a?.lastMessage?.timestamp || 0);
            const dateB = new Date(b?.lastMessage?.timestamp || 0);
            return dateB - dateA;
        });
    }, [chats]);

    if (isGettingChats) {
        return <div className="p-2 space-y-2">{[1, 2, 3, 4, 5].map(i => <ChatSkeleton key={i} />)}</div>;
    }

    return (
        <div className='h-full flex flex-col gap-1 p-2 overflow-y-auto no-scrollbar'>
            <h2 className="px-3 py-2 text-xl font-black tracking-tight text-slate-800 dark:text-white">Messages</h2>
            {sortedChats.map((chat) => {
                const isGlobal = chat.id === "1";
                const friend = isGlobal ? null : getFriend(authUser.id, chat);
                const lastMsg = chat.lastMessage;
                const isUnread = lastMsg && lastMsg.senderId !== authUser.id && !lastMsg.isRead;

                return (
                    <div
                        key={chat.id}
                        onClick={() => setSelectedChat(chat)}
                        className={cn(
                            'flex gap-3 items-center p-3 cursor-pointer rounded-2xl transition-all duration-200 group hover:bg-white dark:hover:bg-slate-800 shadow-hover',
                            isUnread ? "bg-blue/5 dark:bg-blue/10" : "hover:shadow-md"
                        )}
                    >
                        <div className={cn('avatar', isGlobal || onlineUsers.includes(friend?.id) ? 'avatar-online' : 'avatar-offline')}>
                            <div className="w-14 rounded-full ring-2 ring-transparent group-hover:ring-blue/30 transition-all">
                                <img draggable={false} src={isGlobal ? "https://thumbs.dreamstime.com/b/global-people-network-connection-blue-earth-ai-generated-user-icons-connected-around-glowing-globe-represents-419468051.jpg" : friend?.avatar} alt="avatar" />
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline">
                                <p className="font-bold text-slate-800 dark:text-slate-100 truncate">{isGlobal ? "Global Community" : friend?.name}</p>
                                {lastMsg && <span className="text-[10px] text-slate-400">{new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
                            </div>
                            <p className={cn("text-xs truncate", isUnread ? "text-blue font-bold" : "text-slate-500")}>
                                {lastMsg ? lastMsg.content : "Start a conversation..."}
                            </p>
                        </div>
                        {isUnread && <div className="w-2.5 h-2.5 bg-blue rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />}
                    </div>
                );
            })}
        </div>
    );
}