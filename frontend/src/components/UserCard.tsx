import { useCheckSession } from '../hooks/use-auth-queries';
import { useUserFriends, useUserFriendsRequestsTo, useUserFriendsRequestsBy, useUserChats } from '../hooks/use-chat-queries';
import { useCreateFriendRequest, useAcceptFriendRequest } from '../hooks/use-chat-mutations';
import { useChatStore } from '../stores/chat.store';
import { useNavigate } from 'react-router';
import { cn } from '../utils/utils';
import type { SafeUser } from 'super-chat-shared/auth';

interface UserCardProps {
    user: SafeUser;
}

export default function UserCard({ user }: UserCardProps) {
    const { data: authUser } = useCheckSession();
    const { data: friends } = useUserFriends();
    const { data: requestsToUser } = useUserFriendsRequestsTo();
    const { data: requestsByUser } = useUserFriendsRequestsBy();
    const { data: chats } = useUserChats();

    const { mutate: sendNewRequest } = useCreateFriendRequest();
    const { mutate: acceptRequest } = useAcceptFriendRequest();

    const { setSelectedChat } = useChatStore();
    const navigate = useNavigate();

    const isFriend = friends?.some(f => f.id === user.id);
    const incomingRequest = requestsToUser?.find(r => r.senderId === user.id);
    const hasSentRequest = requestsByUser?.some(r => r.receiverId === user.id);

    let actionTitle = "Add";
    let variant = "blue";
    let isActionDisabled = false;
    let onAction = () => sendNewRequest(user.id);

    if (isFriend) {
        actionTitle = "Message";
        variant = "blue";
        onAction = () => {
            const targetChat = chats?.find(c => c.id !== "1" && c.users.some(u => u.id === user.id));
            if (targetChat) {
                setSelectedChat(targetChat);
                navigate('/');
            }
        };
    } else if (incomingRequest) {
        actionTitle = "Accept";
        variant = "success";
        onAction = () => acceptRequest(incomingRequest.id);
    } else if (hasSentRequest) {
        actionTitle = "Sent";
        variant = "ghost";
        isActionDisabled = true;
        onAction = () => { };
    }

    return (
        <div
            className="group card bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-sm rounded-3xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
            <figure className="px-4 pt-6">
                <div className="relative">
                    <img
                        draggable={false}
                        src={user.avatar || 'https://via.placeholder.com/150'} // Fallback for missing avatars
                        alt={`${user.name}'s profile`}
                        className="w-24 h-24 rounded-full object-cover shadow-inner ring-4 ring-transparent group-hover:ring-blue/30 transition-all duration-300"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=" + user.name + "&background=random";
                        }}
                    />
                </div>
            </figure>

            <div className="card-body items-center text-center p-4 gap-3">
                <h2 className="card-title text-sm font-black truncate w-full justify-center text-slate-800 dark:text-slate-100">
                    {user.name}
                </h2>

                <div className="card-actions w-full">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onAction();
                        }}
                        disabled={isActionDisabled}
                        className={cn(
                            "btn btn-sm w-full rounded-xl border-0 text-white font-bold transition-all active:scale-95",
                            variant === 'blue' ? "bg-blue hover:bg-blue-600 shadow-lg shadow-blue/20" :
                                variant === 'success' ? "bg-green-500 hover:bg-green-600" :
                                    variant === 'ghost' ? "btn-ghost text-slate-400 bg-slate-100 dark:bg-slate-800" : "bg-blue",
                            isActionDisabled ? "opacity-50 grayscale cursor-not-allowed" : ""
                        )}
                    >
                        {actionTitle}
                    </button>
                </div>
            </div>
        </div>
    );
}