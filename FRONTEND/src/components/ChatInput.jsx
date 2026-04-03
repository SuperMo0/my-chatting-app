import React, { useState, useRef, useEffect } from 'react';
import { IoMdImage } from "react-icons/io";
import { MdEmojiEmotions } from "react-icons/md";
import { useChatStore } from '../stores/chat.store';
import EmojiPicker from 'emoji-picker-react';
import { toast } from 'react-toastify';
import { cn } from '../utils/utils';

export default function ChatInput({ onSend }) {
    const [text, setText] = useState("");
    const [showEmoji, setShowEmoji] = useState(false);
    const { sendMessage } = useChatStore();
    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
        }
    }, [text]);

    async function handleSendMessage(e) {
        if (e) e.preventDefault();
        const trimmedText = text.trim();

        if (!trimmedText) return;

        try {
            setText("");
            setShowEmoji(false);
            if (onSend) onSend();
            await sendMessage(trimmedText);
        } catch (error) {

            toast.error("Failed to send message");
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="relative p-2 md:p-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border-t border-slate-200 dark:border-slate-800">
            {showEmoji && (
                <div className='absolute bottom-full mb-4 z-50 animate-in fade-in slide-in-from-bottom-2 duration-300'>
                    <div className="fixed inset-0" onClick={() => setShowEmoji(false)} />
                    <div className="relative shadow-2xl rounded-2xl overflow-hidden">
                        <EmojiPicker
                            theme="auto"
                            onEmojiClick={(e) => setText(prev => prev + e.emoji)}
                        />
                    </div>
                </div>
            )}

            <form onSubmit={handleSendMessage} className="flex flex-col gap-2">
                <div className='group bg-slate-100 dark:bg-slate-800 rounded-2xl border-2 border-transparent focus-within:border-blue/30 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all duration-300 shadow-inner'>
                    <textarea
                        ref={textareaRef}
                        rows="1"
                        value={text}
                        onKeyDown={handleKeyDown}
                        onChange={(e) => setText(e.target.value)}
                        className="textarea textarea-ghost w-full resize-none focus:outline-0 bg-transparent py-3 px-4 text-sm leading-relaxed"
                        placeholder="Type a message..."
                    />

                    <div className='flex items-center gap-3 px-3 pb-2'>
                        <button
                            type="button"
                            onClick={() => toast.info('Image sharing is coming soon!')}
                            className="p-1.5 rounded-lg hover:bg-blue/10 text-slate-400 hover:text-blue transition-colors"
                        >
                            <IoMdImage className='text-2xl' />
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowEmoji(!showEmoji)}
                            className={cn(
                                "p-1.5 rounded-lg transition-all",
                                showEmoji ? "bg-blue/10 text-blue" : "hover:bg-blue/10 text-slate-400 hover:text-blue"
                            )}
                        >
                            <MdEmojiEmotions className='text-2xl' />
                        </button>

                        <button
                            disabled={!text.trim()}
                            className={cn(
                                "btn btn-sm h-10 px-6 ml-auto rounded-xl border-0 text-white font-bold transition-all active:scale-95 btn-glow",
                                text.trim() ? "bg-blue hover:bg-blue-600" : "bg-slate-300 dark:bg-slate-700 opacity-50"
                            )}
                        >
                            Send
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}