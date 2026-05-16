import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../api/login';
import { useAuthStore } from '../../../store/authStore';
import toast from 'react-hot-toast';

export const useLogin = (onSuccess?: () => void) => {
    const setUser = useAuthStore((s) => s.setUser);

    return useMutation({
        mutationFn: loginUser,
        onSuccess: (user) => {
            setUser(user);
            toast.success(`Witaj z powrotem, ${user.username}!`);
            onSuccess?.();
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Błąd logowania.');
        },
    });
};
