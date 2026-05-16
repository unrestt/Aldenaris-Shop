import { create } from 'zustand';

type User = { id: number; email: string; name: string; }

type AuthStore = {
    user: User | null;
    token: string | null;
    setUser: (user: User, token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    token: null,
    setUser: (user, token) => set({ user, token }),
    logout: () => set({ user: null, token: null }),
}));
