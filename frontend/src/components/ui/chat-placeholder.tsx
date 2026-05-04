import { RiChatSmile3Line } from "react-icons/ri";

export default function ChatPlaceholder() {
    return (
        <div className='flex-1 flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in duration-700'>
            <div className='relative mb-8'>
                <div className='relative w-32 h-32 bg-white dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center rotate-12 hover:rotate-0 transition-transform duration-500'>
                    <RiChatSmile3Line className='text-7xl text-blue' />
                </div>
            </div>

            <div className='text-center max-w-sm space-y-4'>
                <h1 className='text-5xl font-black text-slate-800 dark:text-white tracking-tighter'>
                    Hello.
                </h1>
                <p className='text-lg font-medium text-slate-500 leading-relaxed'>
                    Select a conversation from the sidebar to start connecting freely with your friends.
                </p>

                <div className='pt-4 flex gap-2 justify-center'>
                    <div className='px-4 py-1.5 bg-blue/10 text-blue rounded-full text-xs font-bold uppercase tracking-widest'>
                        Real-time
                    </div>
                    <div className='px-4 py-1.5 bg-green-500/10 text-green-500 rounded-full text-xs font-bold uppercase tracking-widest'>
                        Secure
                    </div>
                </div>
            </div>
        </div>
    );
}