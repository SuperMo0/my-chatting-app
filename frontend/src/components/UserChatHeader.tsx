import { useChatStore } from '../stores/chat.store.ts'
import { MdKeyboardArrowLeft } from "react-icons/md";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { cn } from '../utils/utils.ts';
import { useCheckSession } from '../hooks/use-auth-queries.ts';

export default function UserChatHeader() {
    const { setSelectedChat, selectedChat, onlineUsers } = useChatStore();
    const { data: authUser } = useCheckSession();

    const isGlobalChat = selectedChat?.id === "1";
    const selectedFriend = isGlobalChat
        ? null
        : selectedChat?.users?.find(u => u.id !== authUser?.id);

    const isOnline = isGlobalChat ? true : (selectedFriend ? onlineUsers.includes(selectedFriend.id) : false);

    const displayName = isGlobalChat ? "Global Public Chat" : selectedFriend?.name;
    const displayAvatar = isGlobalChat ? "https://thumbs.dreamstime.com/b/global-people-network-connection-blue-earth-ai-generated-user-icons-connected-around-glowing-globe-represents-419468051.jpg" : selectedFriend?.avatar;
    const displayStatus = isGlobalChat ? "Always Live" : (isOnline ? "Active Now" : "Offline");

    return (
        <div className='flex gap-3 items-center p-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm'>
            <button
                onClick={() => setSelectedChat(null)}
                className='md:hidden p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors'
            >
                <MdKeyboardArrowLeft className='text-3xl text-slate-500' />
            </button>

            <div className={cn('avatar', isGlobalChat ? '' : (isOnline ? 'avatar-online' : 'avatar-offline'))}>
                <div className="w-12 h-12 rounded-full ring-2 ring-slate-100 dark:ring-slate-800">
                    <img src={displayAvatar || '/avatar.png'} draggable={false} alt="avatar" />
                </div>
            </div>

            <div className="flex-1">
                <p className='font-black text-lg text-slate-800 dark:text-white leading-none'>
                    {displayName}
                </p>
                <span className={cn(
                    'text-[10px] font-bold uppercase tracking-widest',
                    isOnline ? 'text-green-500' : 'text-slate-400'
                )}>
                    {displayStatus}
                </span>
            </div>

            <button className='p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors'>
                <PiDotsThreeOutlineVerticalFill className='text-xl text-slate-400' />
            </button>
        </div>
    )
}