import UsersList from './users-list'
import PeopleIcon from '@mui/icons-material/People';
import { useUserFriends } from '../hooks/use-chat-queries';

export default function Friends() {
    const { data: friends } = useUserFriends();

    if (!friends || friends.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 p-8 text-center animate-in fade-in duration-500">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <PeopleIcon className="text-slate-400" fontSize="large" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">No friends yet</h3>
                <p className="text-sm text-slate-500 max-w-50 mt-1">
                    Head over to the "Discover" tab to find people and start connecting!
                </p>
            </div>
        );
    }

    return (
        <div className="h-full overflow-hidden animate-in slide-in-from-bottom-2 duration-300">
            <UsersList users={friends || []} />
        </div>
    );
}