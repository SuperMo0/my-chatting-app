import React, { useEffect, useMemo } from 'react'
import UsersList from './UsersList'
import { useChatStore } from '../stores/chat.store';
import { ClipLoader } from "react-spinners";
import { useAuthStore } from '../stores/auth.store';
import { toast } from 'react-toastify';

export default function AllPeople() {
    const { users, getUsers, friends, requestsToUser, requestsByUser, sendNewRequest, acceptRequest } = useChatStore();
    const { authUser } = useAuthStore();

    useEffect(() => {
        if (!users) {
            getUsers().catch(() => toast.error("Failed to discover new people"));
        }
    }, [users, getUsers]);

    const usersDataCards = useMemo(() => {
        if (!users || !friends) return [];

        const friendIds = new Set(friends.map(f => f.id));
        const pendingAcceptMap = new Map(requestsToUser.map(r => [r.senderId, r]));
        const pendingSentIds = new Set(requestsByUser.map(r => r.receiverId));

        return users
            .filter((u) => !friendIds.has(u.id) && authUser.id !== u.id)
            .map((u) => {
                if (pendingAcceptMap.has(u.id)) {
                    return {
                        ...u,
                        onAction: () => acceptRequest(pendingAcceptMap.get(u.id)),
                        actionTitle: "Accept",
                        variant: 'success'
                    };
                }
                if (pendingSentIds.has(u.id)) {
                    return {
                        ...u,
                        onAction: () => { },
                        actionTitle: "Sent",
                        variant: 'ghost',
                        isActionDisabled: true
                    };
                }
                return {
                    ...u,
                    onAction: () => sendNewRequest(u),
                    actionTitle: "Add",
                    variant: 'blue'
                };
            });
    }, [users, requestsByUser, requestsToUser, friends, authUser.id, acceptRequest, sendNewRequest]);

    if (!users) return (
        <div className='flex flex-col items-center justify-center h-full gap-4 opacity-60'>
            <ClipLoader color='#3b82f6' size={40} />
            <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Finding people...</p>
        </div>
    );

    if (usersDataCards.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center p-8">
                <p className="text-slate-500 font-medium">You've seen everyone! Check back later for new people.</p>
            </div>
        );
    }

    return (
        <div className="h-full overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
            <UsersList users={usersDataCards} />
        </div>
    );
}