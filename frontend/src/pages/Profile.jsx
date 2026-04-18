import React, { useState, useRef } from 'react'
import { useAuthStore } from '../stores/auth.store';
import Cropper from '../components/Cropper';
import api from '../lib/axios';
import { toast } from 'react-toastify';
import { useChatStore } from '../stores/chat.store';
import { CameraAlt, Logout, DarkMode, LightMode } from '@mui/icons-material';

export default function Profile({ toggleDark, dark }) {
    const { authUser, check, logout } = useAuthStore();
    const [name, setName] = useState(authUser.name);
    const [image, setImage] = useState(null);
    const [modal, setModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const inputRef = useRef();
    const { friends } = useChatStore();

    function handleImageUpload(e) {
        if (!e.target.files[0].type.startsWith('image')) {
            toast.error("Please upload an image file");
            return;
        }
        let fileReader = new FileReader()
        fileReader.onload = (ev) => {
            setImage(ev.target.result);
            setModal(true);
        }
        fileReader.readAsDataURL(e.target.files[0]);
    }

    async function handleSave() {
        if (!name.trim()) return toast.error("Name cannot be empty");
        setIsSaving(true);
        const toastId = toast.loading('Syncing changes...');
        try {
            let form = new FormData()
            if (image && image.startsWith('data:')) {
                let response = await fetch(image);
                let imageBlob = await response.blob();
                form.append('avatar', imageBlob, 'avatar.jpg');
            }
            form.append('name', name);
            const result = await api.putForm('/user', form);
            toast.update(toastId, { render: result.data?.message, type: "success", isLoading: false, autoClose: 2000 });
            check();
        } catch (error) {
            toast.update(toastId, { render: "Upload failed", type: "error", isLoading: false, autoClose: 2000 });
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className='h-full overflow-y-auto bg-white/40 dark:bg-slate-900/20 p-6 no-scrollbar'>
            {modal && (
                <div className='fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4'>
                    <div className="w-full max-w-lg bg-slate-900 rounded-3xl p-6 shadow-2xl">
                        <Cropper image={image} closeModal={(cropped) => { setModal(false); setImage(cropped); }} />
                    </div>
                </div>
            )}

            <div className='max-w-xl mx-auto space-y-8'>
                <div className="flex justify-between items-end">
                    <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter">Profile.</h1>
                    <button onClick={toggleDark} className="p-3 bg-white/50 dark:bg-slate-800 rounded-2xl shadow-sm">
                        {dark ? <LightMode className="text-yellow-500" /> : <DarkMode className="text-slate-700" />}
                    </button>
                </div>

                <div className="flex flex-col items-center space-y-4">
                    <div className='relative group'>
                        <div className='w-40 h-40 rounded-full ring-4 ring-blue ring-offset-4 ring-offset-transparent overflow-hidden shadow-2xl transition-transform group-hover:scale-105'>
                            <img className='w-full h-full object-cover' src={image || authUser.avatar} alt="profile" />
                        </div>
                        <button
                            onClick={() => inputRef.current.click()}
                            className="absolute bottom-1 right-1 p-3 bg-blue text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                        >
                            <CameraAlt fontSize="small" />
                        </button>
                        <input hidden ref={inputRef} accept='image/*' onInput={handleImageUpload} type="file" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-xl font-bold">{authUser.name}</h3>
                        <p className="text-sm text-slate-500 font-medium">@{authUser.email.split('@')[0]}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="glass-card p-4 rounded-2xl text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Connections</p>
                        <p className="text-3xl font-black text-blue">{friends?.length || 0}</p>
                    </div>
                    <div className="glass-card p-4 rounded-2xl text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</p>
                        <p className="text-lg font-black text-green-500 mt-1 uppercase">Active</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Display Name</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input w-full rounded-2xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-blue shadow-sm"
                        />
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="btn bg-blue hover:bg-blue-600 border-0 text-white w-full rounded-2xl h-14 btn-glow font-bold"
                    >
                        Update Profile
                    </button>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
                    <button onClick={logout} className="text-red-400 hover:text-red-500 font-bold flex items-center gap-2 mx-auto transition-colors">
                        <Logout fontSize="small" /> Sign Out
                    </button>
                </div>
            </div>
        </div>
    )
}