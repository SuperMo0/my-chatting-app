import React from 'react'
import { useAuthStore } from '../stores/auth.store.js';
import { fixDate } from '../utils/utils.js';
import { cn } from '../utils/utils.js';

export default function MeBubble({ message }) {
    const { authUser } = useAuthStore();
    const isGlobal = message.chatId === "1";

    return (
        <div className="chat chat-end animate-in fade-in slide-in-from-right-3 duration-300">
            <div className="chat-image avatar">
                <div className="w-10 rounded-full ring-2 ring-blue/20">
                    <img
                        alt="Your avatar"
                        src={authUser.avatar}
                        draggable={false}
                    />
                </div>
            </div>

            <div className="chat-header mb-1 flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">You</span>
                <time className="text-[10px] opacity-40">{fixDate(message.timestamp)}</time>
            </div>

            <div className={cn(
                "chat-bubble shadow-md text-white max-w-[85%] md:max-w-[70%] text-sm leading-relaxed",
                message.isOptimistic ? "bg-blue/60" : "bg-blue"
            )}>
                {message.content}
            </div>

            {!isGlobal && (
                <div className="chat-footer py-1 text-[10px] font-bold opacity-50 uppercase tracking-tighter">
                    {message.isOptimistic ? (
                        <span className="animate-pulse">Sending...</span>
                    ) : (
                        message.isRead ? `✓ Seen ${fixDate(message.readAt)}` : '✓ Delivered'
                    )}
                </div>
            )}
        </div>
    )
}