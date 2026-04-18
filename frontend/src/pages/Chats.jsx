import React from 'react'
import ChatsList from '../components/ChatsList.jsx'
import UserChat from '../components/UserChat.jsx'
import { useChatStore } from '../stores/chat.store.js'
import { cn } from '../utils/utils.js'
import { RiChatSmile3Line } from "react-icons/ri";

export default function Chats() {
    const { selectedChat } = useChatStore();

    return (
        <div className='flex flex-col md:grid md:grid-cols-[350px_1fr] lg:grid-cols-[400px_1fr] h-full overflow-hidden bg-white/30 dark:bg-slate-900/10 backdrop-blur-sm'>


            <div className={cn(
                "h-full overflow-hidden border-r border-slate-200 dark:border-slate-800 transition-all duration-300",
                selectedChat ? "hidden md:block" : "block"
            )}>
                <ChatsList />
            </div>

            <div className={cn(
                "h-full overflow-hidden transition-all duration-300",
                !selectedChat ? "hidden md:flex" : "flex flex-col"
            )}>
                {selectedChat ? (
                    <UserChat />
                ) : (
                    <div className='flex-1 flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in duration-700'>
                        <div className='relative mb-8'>
                            <div className='absolute inset-0 bg-blue/20 blur-3xl rounded-full scale-150 animate-pulse' />

                            <div className='relative w-32 h-32 bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl flex items-center justify-center rotate-12 hover:rotate-0 transition-transform duration-500'>
                                <RiChatSmile3Line className='text-7xl text-blue' />
                            </div>
                        </div>

                        <div className='text-center max-w-sm space-y-4'>
                            <h1 className='text-5xl font-black text-slate-800 dark:text-white tracking-tighter'>
                                Hello.
                            </h1>
                            <p className='text-lg font-medium text-slate-500 leading-relaxed'>
                                Select a conversation from the sidebar to start connecting freely with your friends.
                            </p>

                            <div className='pt-4 flex gap-2 justify-center'>
                                <div className='px-4 py-1.5 bg-blue/10 text-blue rounded-full text-xs font-bold uppercase tracking-widest'>
                                    Real-time
                                </div>
                                <div className='px-4 py-1.5 bg-green-500/10 text-green-500 rounded-full text-xs font-bold uppercase tracking-widest'>
                                    Secure
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}