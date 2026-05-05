import { useMemo } from 'react'
import UsersList from './users-list'
import { ClipLoader } from "react-spinners";
import { useCheckSession } from '../hooks/use-auth-queries';
import { useAllUsers, useUserFriends } from '../hooks/use-chat-queries';

export default function AllPeople() {
    const { data: authUser } = useCheckSession();
    const { data: users, isLoading } = useAllUsers();
    const { data: friends } = useUserFriends();

    const filteredUsers = useMemo(() => {
        if (!users || !friends) return [];
        return users.filter((u) => !friends.some(f => f.id === u.id) && authUser?.id !== u.id);
    }, [users, friends, authUser?.id]);

    if (isLoading) return (
        <div className='flex flex-col items-center justify-center h-full gap-4 opacity-60'>
            <ClipLoader color='#3b82f6' size={40} />
            <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Finding people...</p>
        </div>
    );

    if (filteredUsers.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center p-8">
                <p className="text-slate-500 font-medium">You've seen everyone! Check back later for new people.</p>
            </div>
        );
    }

    return (
        <div className="h-full overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
            <UsersList users={filteredUsers} />
        </div>
    );
}