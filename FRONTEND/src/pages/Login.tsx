import { useState } from "react";
import { useAuthStore } from "../stores/auth.store";
import { NavLink } from "react-router";
import { ClipLoader } from "react-spinners";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { UserLogin } from 'shared/auth';
import { UserLoginSchema } from "shared/auth";
export default function Login() {

    const { login, isSigningIn } = useAuthStore();

    const { register, handleSubmit, formState } = useForm({
        resolver: zodResolver(UserLoginSchema)
    });

    function handleFormSubmit(data: UserLogin) {
        login(data);
    }

    return (
        <div className="min-h-dvh flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
            <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
                <div className='text-center'>
                    <h1 className='text-6xl font-black text-blue tracking-tighter'>Chat.</h1>
                    <p className='text-slate-500 font-medium'>Welcome back! Please enter your details.</p>
                </div>

                <div className="glass-card p-8 rounded-4xl">
                    <form noValidate onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                            <input
                                required
                                {...register("email")}
                                type="email"
                                className="input input-bordered w-full rounded-xl bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-blue"
                                placeholder="name@company.com"
                            />
                            <p className="text-red-500 text-xs">{formState.errors.email?.message}</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Password</label>
                            <input
                                required
                                {...register("password")}
                                type="password"
                                className="input input-bordered w-full rounded-xl bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-blue"
                                placeholder="••••••••"
                            />
                            <p className="text-red-500 text-xs">{formState.errors.password?.message}</p>
                        </div>

                        <button disabled={isSigningIn} className="btn bg-blue hover:bg-blue-600 border-0 text-white w-full rounded-xl h-12 btn-glow">
                            {isSigningIn ? <ClipLoader size={20} color="white" /> : "Sign In"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className='text-sm text-slate-500'>
                            Don't have an account?
                            <NavLink className="text-blue font-bold ml-1 hover:underline" to='/signup'>Create one</NavLink>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}