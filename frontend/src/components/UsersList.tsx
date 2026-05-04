import type { SafeUser } from 'super-chat-shared/auth';
import UserCard from './UserCard';

type UserListItem = {
    users: SafeUser[]
}
export default function UsersList({ users }: UserListItem) {
    if (!users || users.length === 0) return null;

    return (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 overflow-y-auto px-4 py-2 items-start max-h-full no-scrollbar animate-in fade-in duration-500'>
            {users.map((user) => (
                <UserCard key={user.id} user={user} />
            ))}
        </div>
    );
}