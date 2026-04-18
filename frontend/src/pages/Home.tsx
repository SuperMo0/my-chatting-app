import React, { useEffect } from 'react'
import { Outlet } from 'react-router'
import Panel from '../components/Panel'
import { useChatStore } from '../stores/chat.store';
import { ClipLoader } from 'react-spinners';

export default function Home() {
    const {
        connectSocket,
        getChats,
        onlineUsers,
        getRequestsToUser,
        isGettingChats,
        isGettingRequestsToUser
    } = useChatStore();

    useEffect(() => {
        getChats();
        getRequestsToUser();
        const socket = connectSocket();
        return () => {
            socket?.disconnect(); console.log('disconnect');
        };
    }, []);

    // console.log(onlineUsers, isGettingChats, isGettingRequestsToUser);

    if (isGettingChats || !onlineUsers || isGettingRequestsToUser) {
        return (
            <div className='flex flex-col items-center justify-center h-screen bg-base-100 gap-4'>
                <ClipLoader color='#3b82f6' size={50} />
                <p className="text-sm font-medium animate-pulse">Loading...</p>
            </div>
        );
    }

    return (
        <div className="h-dvh bg-slate-50 dark:bg-slate-950 p-2 md:p-4 lg:p-6 transition-colors duration-500">
            <div className='max-w-7xl mx-auto h-full glass-card rounded-3xl overflow-hidden'>
                <div className='flex flex-col md:flex-row h-full'>
                    <div className='order-2 md:order-1 bg-white/50 dark:bg-black/20 p-2 md:p-4'>
                        <Panel />
                    </div>

                    <main className='order-1 md:order-2 flex-1 overflow-hidden relative'>
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
}