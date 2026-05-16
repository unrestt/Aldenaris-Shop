import { useState, useEffect } from 'react';
import logoWhite from '../../../assets/aldenaris_logo_white.png';
import { useRegister } from '../hooks/useRegister';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToLogin: () => void;
};

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }: Props) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [validationError, setValidationError] = useState('');

    const { mutate: register, isPending } = useRegister(onClose);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setTimeout(() => setIsVisible(true), 10);
        } else {
            setIsVisible(false);
            setValidationError('');
            setUsername('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setValidationError('Hasła nie są identyczne.');
            return;
        }
        setValidationError('');
        register({ username, email, password });
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
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-3">
                            <img src={logoWhite} alt="Aldenaris" className="h-6 w-auto object-contain opacity-60" />
                            <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">Account</span>
                        </div>
                        <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors text-lg leading-none">
                            ✕
                        </button>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-white font-black text-3xl uppercase tracking-wide leading-tight">Rejestracja</h2>
                        <p className="text-neutral-500 text-xs uppercase tracking-[0.2em] mt-2">Dołącz do Aldenaris</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-neutral-400 text-[10px] font-bold uppercase tracking-widest">Nazwa użytkownika</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="twoja_nazwa"
                                required
                                disabled={isPending}
                                className="w-full bg-neutral-900 border border-neutral-800 text-white text-sm px-4 py-3.5 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors disabled:opacity-50"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-neutral-400 text-[10px] font-bold uppercase tracking-widest">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="twoj@email.pl"
                                required
                                disabled={isPending}
                                className="w-full bg-neutral-900 border border-neutral-800 text-white text-sm px-4 py-3.5 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors disabled:opacity-50"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-neutral-400 text-[10px] font-bold uppercase tracking-widest">Hasło</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                disabled={isPending}
                                className="w-full bg-neutral-900 border border-neutral-800 text-white text-sm px-4 py-3.5 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors disabled:opacity-50"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-neutral-400 text-[10px] font-bold uppercase tracking-widest">Potwierdź hasło</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                disabled={isPending}
                                className={`w-full bg-neutral-900 border text-white text-sm px-4 py-3.5 placeholder:text-neutral-600 focus:outline-none transition-colors disabled:opacity-50 ${validationError ? 'border-red-500/60' : 'border-neutral-800 focus:border-neutral-600'}`}
                            />
                        </div>

                        {validationError && (
                            <p className="text-red-400 text-[10px] uppercase tracking-widest font-bold">⚠ {validationError}</p>
                        )}

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full py-4 bg-white text-black text-xs font-black uppercase tracking-[0.2em] hover:bg-neutral-200 transition-colors mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isPending ? 'Tworzenie konta...' : 'Utwórz konto'}
                        </button>
                    </form>

                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-neutral-800" />
                        <span className="text-neutral-600 text-[10px] uppercase tracking-widest">lub</span>
                        <div className="flex-1 h-px bg-neutral-800" />
                    </div>

                    <p className="text-center text-neutral-500 text-xs tracking-widest">
                        Masz już konto?{' '}
                        <button
                            onClick={onSwitchToLogin}
                            className="text-white font-bold hover:text-neutral-300 transition-colors underline underline-offset-4 uppercase"
                        >
                            Zaloguj się
                        </button>
                    </p>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>
        </div>
    );
};

export default RegisterModal;
