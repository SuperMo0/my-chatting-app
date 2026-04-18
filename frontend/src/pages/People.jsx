import React, { useEffect, useState } from 'react'
import SearchInput from '../components/SearchInput'
import { cn } from '../utils/utils'
import AllPeople from '../components/AllPeople'
import Friends from '../components/Friends'
import { ClipLoader } from "react-spinners";
import { useChatStore } from '../stores/chat.store'
import Badge from '@mui/material/Badge';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Requests from '../components/Requests'
import PeopleIcon from '@mui/icons-material/People';
import PublicIcon from '@mui/icons-material/Public';
import ShareLocationIcon from '@mui/icons-material/ShareLocation';

export default function People() {
    const [tab, setTab] = useState('friends')
    const { getRequestsByUser, requestsToUser, requestsByUser, getFriends, friends } = useChatStore();

    useEffect(() => {
        if (!requestsByUser) getRequestsByUser();
        if (!friends) getFriends();
    }, [])

    if (!requestsByUser || !friends) return (
        <div className='flex items-center justify-center h-full bg-white/30 dark:bg-slate-900/30'>
            <ClipLoader color='#3b82f6' />
        </div>
    )

    const TabBtn = ({ name, icon: Icon, label, badgeCount }) => (
        <button
            onClick={() => setTab(name)}
            className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-bold transition-all border-b-2",
                tab === name
                    ? "text-blue border-blue bg-blue/5"
                    : "text-slate-400 border-transparent hover:text-slate-600 dark:hover:text-slate-200"
            )}
        >
            <Badge badgeContent={badgeCount} color="primary" sx={{ "& .MuiBadge-badge": { fontSize: 10, height: 16, minWidth: 16 } }}>
                <Icon className="text-lg" />
            </Badge>
            <span className="hidden sm:inline">{label}</span>
        </button>
    )

    return (
        <div className='flex flex-col h-full bg-white/40 dark:bg-slate-900/20 backdrop-blur-sm'>
            <div className='p-4 space-y-4 border-b border-slate-200 dark:border-slate-800'>
                <h1 className="text-2xl font-black text-slate-800 dark:text-white">Community</h1>
                <SearchInput />
                <div className="flex overflow-x-auto no-scrollbar">
                    <TabBtn name="friends" icon={PeopleIcon} label="Friends" />
                    <TabBtn name="all people" icon={PublicIcon} label="Discover" />
                    <TabBtn name="near me" icon={ShareLocationIcon} label="Near Me" />
                    <TabBtn name="requests" icon={PersonAddIcon} label="Requests" badgeCount={requestsToUser.length} />
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