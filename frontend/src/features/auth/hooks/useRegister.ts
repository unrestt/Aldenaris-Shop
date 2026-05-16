import { useMutation } from '@tanstack/react-query';
import { registerUser } from '../api/register';
import { useAuthStore } from '../../../store/authStore';
import toast from 'react-hot-toast';

export const useRegister = (onSuccess?: () => void) => {
    const setUser = useAuthStore((s) => s.setUser);

    return useMutation({
        mutationFn: registerUser,
        onSuccess: (user) => {
            setUser(user);
            toast.success(`Konto założone! Witaj, ${user.username}!`);
            onSuccess?.();
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Błąd rejestracji.');
        },
    });
};
