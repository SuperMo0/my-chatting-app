import ChatsList from '../components/ChatsList.js';
import UserChat from '../components/UserChat.js';
import ChatPlaceholder from '../components/ui/chat-placeholder.js';
import { useChatStore } from '../stores/chat.store.js';
import { cn } from '../utils/utils.js';

export default function Chats() {
    const { selectedChat } = useChatStore();

    return (
        <div className='flex flex-col md:grid md:grid-cols-[350px_1fr] lg:grid-cols-[400px_1fr] h-full overflow-hidden bg-white/30 dark:bg-slate-900/10 backdrop-blur-sm'>

            <div className={cn(
                "h-full overflow-hidden border-r border-slate-200 dark:border-slate-800 transition-all duration-300",
                selectedChat ? "hidden md:block" : "block"
            )}>
                <ChatsList />
            </div>

            <div className={cn(
                "h-full overflow-hidden transition-all duration-300",
                !selectedChat ? "hidden md:flex" : "flex flex-col"
            )}>
                {selectedChat ? <UserChat /> : <ChatPlaceholder />}
            </div>

        </div>
    );
}