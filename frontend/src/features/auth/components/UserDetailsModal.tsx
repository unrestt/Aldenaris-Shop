import { useState, useEffect } from 'react';
import { useAuthStore } from '../../../store/authStore';

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

const UserDetailsModal = ({ isOpen, onClose }: Props) => {
    const { user, logout } = useAuthStore();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setTimeout(() => setIsVisible(true), 10);
        } else {
            setIsVisible(false);
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!isOpen || !user) return null;

    const handleLogout = () => {
        logout();
        onClose();
    };

    return (
        <div
            className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            <div
                className={`relative z-10 w-full max-w-md mx-4 bg-neutral-950 border border-neutral-800 transition-all duration-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />

                <div className="p-8 sm:p-10">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-10">
                        <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">Moje konto</span>
                        <button
                            onClick={onClose}
                            className="text-neutral-500 hover:text-white transition-colors text-lg leading-none"
                        >
                            ✕
                        </button>
                    </div>

                    {/* User info */}
                    <div className="mb-10">
                        <h2 className="text-white font-black text-3xl uppercase tracking-wide leading-tight">
                            {user.username}
                        </h2>
                        <p className="text-neutral-500 text-xs uppercase tracking-[0.2em] mt-2">
                            {user.email}
                        </p>
                    </div>

                    <div className="h-px w-full bg-neutral-800 mb-8" />

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-neutral-900 border border-neutral-800 p-4 text-center">
                            <span className="text-white font-black text-xl block">0</span>
                            <span className="text-neutral-500 text-[10px] uppercase tracking-widest mt-1 block">Zamówienia</span>
                        </div>
                        <div className="bg-neutral-900 border border-neutral-800 p-4 text-center">
                            <span className="text-white font-black text-xl block">0</span>
                            <span className="text-neutral-500 text-[10px] uppercase tracking-widest mt-1 block">W koszyku</span>
                        </div>
                    </div>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="w-full py-4 bg-transparent text-white text-xs font-black uppercase tracking-[0.2em] border border-neutral-700 hover:border-white hover:bg-white hover:text-black transition-all"
                    >
                        Wyloguj się
                    </button>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>
        </div>
    );
};

export default UserDetailsModal;
