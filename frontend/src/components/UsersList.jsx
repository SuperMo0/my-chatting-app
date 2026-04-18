import React from 'react';
import { cn } from '../utils/utils';

export default function UsersList({ users }) {
    // Basic Error Handling: Handle the case where the users prop might be undefined
    if (!users || users.length === 0) return null;

    return (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 overflow-y-auto px-4 py-2 items-start max-h-full no-scrollbar animate-in fade-in duration-500'>
            {users.map((user) => (
                <div
                    key={user.id}
                    className="group card bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-sm rounded-3xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                    <figure className="px-4 pt-6">
                        <div className="relative">
                            <img
                                draggable={false}
                                src={user.avatar || 'https://via.placeholder.com/150'} // Fallback for missing avatars
                                alt={`${user.name}'s profile`}
                                className="w-24 h-24 rounded-full object-cover shadow-inner ring-4 ring-transparent group-hover:ring-blue/30 transition-all duration-300"
                                onError={(e) => {
                                    // Error Handling: Replace broken images with a fallback
                                    e.target.src = "https://ui-avatars.com/api/?name=" + user.name + "&background=random";
                                }}
                            />
                        </div>
                    </figure>

                    <div className="card-body items-center text-center p-4 gap-3">
                        <h2 className="card-title text-sm font-black truncate w-full justify-center text-slate-800 dark:text-slate-100">
                            {user.name}
                        </h2>

                        <div className="card-actions w-full">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevents card-level clicks if you add them later
                                    user.onAction(user);
                                }}
                                disabled={user.isActionDisabled}
                                className={cn(
                                    "btn btn-sm w-full rounded-xl border-0 text-white font-bold transition-all active:scale-95",
                                    user.variant === 'blue' ? "bg-blue hover:bg-blue-600 shadow-lg shadow-blue/20" :
                                        user.variant === 'success' ? "bg-green-500 hover:bg-green-600" :
                                            user.variant === 'ghost' ? "btn-ghost text-slate-400" : "bg-blue",
                                    user.isActionDisabled && "opacity-50 grayscale cursor-not-allowed"
                                )}
                            >
                                {user.isActionDisabled ? "Request Sent" : user.actionTitle}
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}