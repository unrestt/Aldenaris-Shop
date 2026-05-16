import { api } from '../../../api/axiosInstance';
import type { User } from '../../../store/authStore';

type LoginPayload = {
    email: string;
    password: string;
};

export const loginUser = async ({ email, password }: LoginPayload): Promise<User> => {
    // json-server: filtrujemy po email i password
    const { data } = await api.get<User[]>('/users', {
        params: { email, password },
    });

    if (!data || data.length === 0) {
        throw new Error('Nieprawidłowy email lub hasło.');
    }

    return data[0];
};
