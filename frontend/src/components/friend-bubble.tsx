import type { Message } from 'super-chat-shared/chat';
import { fixDate } from '../utils/Dates.util.js';
import { useAllUsers } from '../hooks/use-chat-queries';

type FriendBubbleProps = {
    message: Message

}
export default function FriendBubble({ message }: FriendBubbleProps) {

    const { data: people } = useAllUsers();
    // todo: we can optimize this next line by either embedding the user in every message or passing the user as a prop and using a map.
    const friend = people?.find((user) => user.id === message.senderId) || { name: "Unknown", avatar: null };
    return (
        <div className="chat chat-start animate-in fade-in slide-in-from-left-3 duration-300">
            <div className="chat-image avatar">
                <div className="w-10 rounded-full ring-2 ring-slate-200 dark:ring-slate-800">
                    <img
                        alt="Friend avatar"
                        src={friend.avatar || `https://ui-avatars.com/api/?name=${friend.name}&background=random&color=fff&size=128`}
                        draggable={false}
                    />
                </div>
            </div>

            <div className="chat-header mb-1 flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">
                    {friend.name}
                </span>
                <time className="text-[10px] opacity-40">{fixDate(message.timestamp)}</time>
            </div>

            <div className="chat-bubble bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm border border-slate-200/50 dark:border-white/5 max-w-[85%] md:max-w-[70%] text-sm leading-relaxed">
                {message.content}
            </div>
        </div>
    )
}