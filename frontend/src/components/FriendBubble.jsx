import React from 'react'
import { fixDate } from '../utils/utils.js';

export default function FriendBubble({ message }) {
    const friend = message.sender || { name: "User", avatar: "" };

    return (
        <div className="chat chat-start animate-in fade-in slide-in-from-left-3 duration-300">
            <div className="chat-image avatar">
                <div className="w-10 rounded-full ring-2 ring-slate-200 dark:ring-slate-800">
                    <img
                        alt="Friend avatar"
                        src={friend.avatar}
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