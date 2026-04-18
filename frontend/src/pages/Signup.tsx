import { useAuthStore } from '../stores/auth.store.js';
import { ClipLoader } from 'react-spinners';
import { NavLink } from 'react-router';
import { UserSignupSchema, type UserSignup } from 'super-chat-shared/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export default function Signup() {
    const { signup, isSigningUp } = useAuthStore();

    const { register, handleSubmit, formState } = useForm({
        resolver: zodResolver(UserSignupSchema)
    });

    function handleFormSubmit(data: UserSignup) {
        signup(data);
    }

    return (
        <div className="min-h-dvh flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
            <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
                <div className='text-center'>
                    <h1 className='text-6xl font-black text-blue tracking-tighter'>Chat.</h1>
                    <p className='text-slate-500 font-medium'>Create an account to start connecting.</p>
                </div>

                <div className="glass-card p-8 rounded-4xl">
                    <form noValidate onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                        <div className="space-y-1">
                            <label htmlFor='name' className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                            <input
                                {...register("name")}
                                type="text"
                                className="input input-bordered w-full rounded-xl bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-blue"
                                placeholder="John Doe"
                                id='name'
                            />
                            <p className="text-red-500 text-xs">{formState.errors.name?.message}</p>

                        </div>
                        <div className="space-y-1">
                            <label htmlFor='email' className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                            <input
                                {...register("email")}
                                type="email"
                                className="input input-bordered w-full rounded-xl bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-blue"
                                placeholder="name@email.com"
                                id='email'
                            />
                            <p className="text-red-500 text-xs">{formState.errors.email?.message}</p>
                        </div>
                        <div className="space-y-1">
                            <label htmlFor='password' className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Password</label>
                            <input
                                {...register("password")}
                                type="password"
                                className="input input-bordered w-full rounded-xl bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-blue"
                                placeholder="••••••••"
                                id='password'
                            />
                            <p className="text-red-500 text-xs">{formState.errors.password?.message}</p>
                        </div>

                        <button disabled={isSigningUp} className="btn bg-blue hover:bg-blue-600 border-0 text-white w-full rounded-xl h-12 btn-glow mt-4">
                            {isSigningUp ? <ClipLoader size={20} color="white" /> : "Create Account"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className='text-sm text-slate-500'>
                            Already have an account?
                            <NavLink className="text-blue font-bold ml-1 hover:underline" to='/login'>Log in</NavLink>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}