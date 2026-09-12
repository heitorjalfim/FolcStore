import { api } from './api';
import { Customer, Artesao } from '@/types'; // Adjust path if your types are elsewhere

export const userService = {
    async loginCustomer(email: string, senha: string): Promise<Customer | null> {
        const response = await api.get<Customer[]>('/customers', {
            params: { email, senha },
        });
        return response.data.length > 0 ? response.data[0] : null;
    },

    async loginArtesao(email: string, senha: string): Promise<Artesao | null> {
        const response = await api.get<Artesao[]>('/artesaos', {
            params: { email, senha },
        });
        return response.data.length > 0 ? response.data[0] : null;
    }
};
