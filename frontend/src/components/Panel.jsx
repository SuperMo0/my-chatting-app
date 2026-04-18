import React from 'react'
import { NavLink } from 'react-router'
import { RiChatSmile3Fill } from "react-icons/ri";
import { MdPeopleAlt } from "react-icons/md";
import { BiSolidUser } from "react-icons/bi";
import { useChatStore } from '../stores/chat.store';
import { useAuthStore } from '../stores/auth.store';
import Badge from '@mui/material/Badge';

export default function Panel() {
    const { chats, requestsToUser } = useChatStore();
    const { authUser } = useAuthStore();

    const unreadChats = chats?.filter(c =>
        c.lastMessage && c.lastMessage.senderId !== authUser?.id && !c.lastMessage.isRead
    ).length || 0;

    const unreadRequests = requestsToUser?.filter(r => !r.isSeen).length || 0;

    const NavItem = ({ to, icon: Icon, label, badge }) => (
        <NavLink to={to} className={({ isActive }) => cn(
            "flex flex-col items-center gap-1 p-3 rounded-2xl transition-all duration-300 group",
            isActive ? "bg-blue/10 text-blue" : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        )}>
            <Badge badgeContent={badge} color="primary" overlap="circular">
                <Icon className="text-3xl transition-transform group-hover:scale-110" />
            </Badge>
            <span className="text-[10px] uppercase tracking-wider font-bold md:hidden lg:block">{label}</span>
        </NavLink>
    );

    return (
        <div className='flex flex-row md:flex-col justify-around md:justify-start gap-4 h-full'>
            <NavItem to="/" icon={RiChatSmile3Fill} label="Chats" badge={unreadChats} />
            <NavItem to="/people" icon={MdPeopleAlt} label="People" badge={unreadRequests} />
            <NavItem to="/profile" icon={BiSolidUser} label="Profile" />
        </div>
    );
}

const cn = (...classes) => classes.filter(Boolean).join(' ');