import React from 'react'
import { ClipLoader } from 'react-spinners';

export default function LoadingScreen() {
    return (
        <div className='flex flex-col items-center justify-center h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500'>
            <ClipLoader color='#3b82f6' size={50} />
            <p className="mt-4 text-sm font-bold uppercase tracking-widest text-blue animate-pulse">
                Securing Connection
            </p>
        </div>
    );
}
