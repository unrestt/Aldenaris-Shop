import { api } from '../../../api/axiosInstance';
import type { User } from '../../../store/authStore';

type RegisterPayload = {
    username: string;
    email: string;
    password: string;
};

export const registerUser = async ({ username, email, password }: RegisterPayload): Promise<User> => {
    const { data: existing } = await api.get<User[]>('/users', {
        params: { email },
    });

    if (existing && existing.length > 0) {
        throw new Error('Konto z tym adresem email już istnieje.');
    }

    const newUser = {
        username,
        email,
        password,
    };

    const { data } = await api.post<User>('/users', newUser);
    return data;
};
