import React from 'react'
import SearchIcon from '@mui/icons-material/Search';

export default function SearchInput() {
    return (
        <div className="relative group w-full">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <SearchIcon className="text-slate-400 group-focus-within:text-blue transition-colors" />
            </div>
            <input
                type="text"
                placeholder="Search for friends or movies..."
                className="w-full pl-12 pr-4 py-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue/50 focus:border-blue transition-all"
            />
        </div>
    )
}