import { useEffect } from 'react'
import { Outlet } from 'react-router'
import Panel from '../components/panel'
import { useChatStore } from '../stores/chat.store';
import { useUserChats, useUserFriendsRequestsTo } from '../hooks/use-chat-queries';
import { useGlobalSocketListeners } from '../hooks/use-global-socket-listeners';
import { useAllUsers } from './../hooks/use-chat-queries';
import LoadingScreen from './../components/ui/loading-screen';

export default function Home() {
    const { connectSocket, disconnectSocket, onlineUsers } = useChatStore();
    const { isLoading: isGettingChats } = useUserChats();
    const { isLoading: isGettingRequestsToUser } = useUserFriendsRequestsTo();
    const { isLoading: isGettingAllUsers } = useAllUsers();

    useGlobalSocketListeners();

    useEffect(() => {
        connectSocket();
        return () => {
            disconnectSocket();
            console.log('disconnect');
        };
    }, []);

    if (isGettingChats || !onlineUsers || isGettingRequestsToUser || isGettingAllUsers) {
        return <LoadingScreen />
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