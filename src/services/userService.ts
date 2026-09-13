import { apiService } from './apiService';
import { Customer, Artesao } from '@/types';

export const userService = {
    async loginCustomer(email: string, senha: string): Promise<Customer | null> {
        const response = await apiService.get<Customer[]>('/customers', {
            params: { email, senha },
        });
        return response.data.length > 0 ? response.data[0] : null;
    },

    async loginArtesao(email: string, senha: string): Promise<Artesao | null> {
        const response = await apiService.get<Artesao[]>('/artesaos', {
            params: { email, senha },
        });
        return response.data.length > 0 ? response.data[0] : null;
    },

    async registerCustomer(customerData: Omit<Customer, 'id'>): Promise<Customer> {
        const response = await apiService.post<Customer>('/customers', customerData);
        return response.data;
    },

    async registerArtesao(artesaoData: Omit<Artesao, 'id'>): Promise<Artesao> {
        const response = await apiService.post<Artesao>('/artesaos', artesaoData);
        return response.data;
    }
};
