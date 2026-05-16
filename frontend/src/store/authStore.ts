import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type User = {
    id: string;
    username: string;
    email: string;
};


type AuthStore = {
    user: User | null;
    setUser: (user: User) => void;
    logout: () => void;
};

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),
            logout: () => set({ user: null }),
        }),
        { name: 'aldenaris-auth' }
    )
);
