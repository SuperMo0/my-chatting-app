import React from 'react';
import { cn } from '../../utils/utils.ts';
import Badge from '@mui/material/Badge';

export interface TabBtnProps {
    icon: React.ElementType;
    label: string;
    badgeCount?: number;
    isActive: boolean;
    onClick: () => void;
}

export default function TabBtn({ icon: Icon, label, badgeCount, isActive, onClick }: TabBtnProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-bold transition-all border-b-2 -mb-px outline-none",
                isActive
                    ? "text-blue border-blue bg-blue/5"
                    : "text-slate-400 border-transparent hover:text-slate-600 dark:hover:text-slate-200"
            )}
        >
            <Badge badgeContent={badgeCount} color="primary" sx={{ "& .MuiBadge-badge": { fontSize: 10, height: 16, minWidth: 16 } }}>
                <Icon className="text-lg" />
            </Badge>
            <span className="hidden sm:inline">{label}</span>
        </button>
    );
}