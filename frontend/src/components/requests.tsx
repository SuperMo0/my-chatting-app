import UsersList from './users-list';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useUserFriendsRequestsTo } from '../hooks/use-chat-queries';

export default function Requests() {
    const { data: requestsToUser } = useUserFriendsRequestsTo();

    const requestsSenders = (requestsToUser || []).map(r => r.sender!);

    if (!requestsToUser || requestsToUser.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 p-8 text-center animate-in fade-in duration-500">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <PersonAddIcon className="text-slate-400" fontSize="large" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">No pending requests</h3>
                <p className="text-sm text-slate-500 max-w-50 mt-1">
                    When people try to connect with you, their requests will appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="h-full overflow-hidden animate-in slide-in-from-bottom-2 duration-300">
            <div className="px-4 py-2">
                <p className="text-xs font-bold uppercase tracking-widest text-blue mb-2 ml-1">
                    Incoming Requests ({requestsToUser.length})
                </p>
            </div>
            <UsersList users={requestsSenders} />
        </div>
    );
}