export const ChatSkeleton = () => (
    <div className="flex gap-3 p-3 animate-pulse">
        <div className="w-14 h-14 bg-slate-200 dark:bg-slate-800 rounded-full" />
        <div className="flex-1 space-y-2 py-2">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full" />
        </div>
    </div>
);