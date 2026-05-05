import { useState } from 'react'
import SearchInput from '../components/search-input.jsx'
import AllPeople from '../components/all-people.jsx'
import Friends from '../components/friends.jsx'
import { ClipLoader } from "react-spinners";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Requests from '../components/requests.jsx'
import PeopleIcon from '@mui/icons-material/People';
import PublicIcon from '@mui/icons-material/Public';
import ShareLocationIcon from '@mui/icons-material/ShareLocation';
import { useUserFriends, useUserFriendsRequestsTo, useUserFriendsRequestsBy } from '../hooks/use-chat-queries.ts';
import TabBtn from '../components/ui/tab-btn.tsx';

export default function People() {
    const [tab, setTab] = useState('friends')

    const { data: friends, isLoading: isLoadingFriends } = useUserFriends();
    const { data: requestsToUser, isLoading: isLoadingReqTo } = useUserFriendsRequestsTo();
    const { data: requestsByUser, isLoading: isLoadingReqBy } = useUserFriendsRequestsBy();

    if (isLoadingFriends || isLoadingReqTo || isLoadingReqBy) return (
        <div className='flex items-center justify-center h-full bg-white/30 dark:bg-slate-900/30'>
            <ClipLoader color='#3b82f6' />
        </div>
    )

    return (
        <div className='flex flex-col h-full bg-white/40 dark:bg-slate-900/20 backdrop-blur-sm'>
            <div className='p-4 space-y-4 border-b border-slate-200 dark:border-slate-800'>
                <h1 className="text-2xl font-black text-slate-800 dark:text-white">Community</h1>
                <SearchInput />
                <div className="flex overflow-x-auto no-scrollbar">
                    <TabBtn isActive={tab === 'friends'} onClick={() => setTab('friends')} icon={PeopleIcon} label="Friends" />
                    <TabBtn isActive={tab === 'all people'} onClick={() => setTab('all people')} icon={PublicIcon} label="Discover" />
                    <TabBtn isActive={tab === 'near me'} onClick={() => setTab('near me')} icon={ShareLocationIcon} label="Near Me" />
                    <TabBtn isActive={tab === 'requests'} onClick={() => setTab('requests')} icon={PersonAddIcon} label="Requests" badgeCount={requestsToUser?.length || 0} />
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                {tab === "friends" && <Friends />}
                {tab === "all people" && <AllPeople />}
                {tab === "requests" && <Requests />}
                {tab === "near me" && (
                    <div className="flex flex-col items-center justify-center h-full opacity-50 grayscale">
                        <ShareLocationIcon sx={{ fontSize: 60 }} />
                        <p className="mt-2 font-bold">Feature coming soon!</p>
                    </div>
                )}
            </div>
        </div>
    )
}