import React from 'react'
import { useChatStore } from '../stores/chat.store'
import { MdKeyboardArrowLeft } from "react-icons/md";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { cn } from '../utils/utils';

export default function UserChatHeader() {
    const { setSelectedChat, selectedFriend, onlineUsers } = useChatStore();
    const isOnline = onlineUsers.includes(selectedFriend?.id);

    return (
        <div className='flex gap-3 items-center p-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm'>
            <button
                onClick={() => setSelectedChat(null)}
                className='md:hidden p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors'
            >
                <MdKeyboardArrowLeft className='text-3xl text-slate-500' />
            </button>

            <div className={cn('avatar', isOnline ? 'avatar-online' : 'avatar-offline')}>
                <div className="w-12 h-12 rounded-full ring-2 ring-slate-100 dark:ring-slate-800">
                    <img src={selectedFriend?.avatar} draggable={false} alt="avatar" />
                </div>
            </div>

            <div className="flex-1">
                <p className='font-black text-lg text-slate-800 dark:text-white leading-none'>
                    {selectedFriend?.name}
                </p>
                <span className={cn(
                    'text-[10px] font-bold uppercase tracking-widest',
                    isOnline ? 'text-green-500' : 'text-slate-400'
                )}>
                    {isOnline ? 'Active Now' : 'Offline'}
                </span>
            </div>

            <button className='p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors'>
                <PiDotsThreeOutlineVerticalFill className='text-xl text-slate-400' />
            </button>
        </div>
    )
}