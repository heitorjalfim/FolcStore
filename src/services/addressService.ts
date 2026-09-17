import { apiService } from './apiService';
import { Customer, Endereco } from '@/types';

export const addressService = {
    async addEndereco(customer: Customer, endereco: Omit<Endereco, 'id'>): Promise<Customer> {
        try {
            const novoEndereco: Endereco = { ...endereco, id: crypto.randomUUID() };
            const enderecos = [...customer.enderecos, novoEndereco];
            const response = await apiService.patch<Customer>(`/customers/${customer.id}`, { enderecos });
            return response.data;
        } catch (error) {
            console.error("Erro ao adicionar endereço:", error);
            throw error;
        }
    },
};
