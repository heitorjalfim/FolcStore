import { apiService } from './apiService';
import { Customer, Artesao, Admin, Product } from '@/types';

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

    async loginAdmin(email: string, senha: string): Promise<Admin | null> {
        const response = await apiService.get<Admin[]>('/admins', {
            params: { email, senha },
        });
        return response.data.length > 0 ? response.data[0] : null;
    },

    async registerCustomer(customerData: Omit<Customer, 'id'>): Promise<Customer> {
        const existingEmail = await apiService.get<Customer[]>('/customers', {
            params: { email: customerData.email },
        });
        if (existingEmail.data.length > 0) {
            throw new Error('EMAIL_EXISTS');
        }

        const existingCpf = await apiService.get<Customer[]>('/customers', {
            params: { cpf: customerData.cpf },
        });
        if (existingCpf.data.length > 0) {
            throw new Error('CPF_EXISTS');
        }

        const response = await apiService.post<Customer>('/customers', customerData);
        return response.data;
    },

    async registerArtesao(artesaoData: Omit<Artesao, 'id'>): Promise<Artesao> {
        const existingEmail = await apiService.get<Artesao[]>('/artesaos', {
            params: { email: artesaoData.email },
        });
        if (existingEmail.data.length > 0) {
            throw new Error('EMAIL_EXISTS');
        }

        const existingCpf = await apiService.get<Artesao[]>('/artesaos', {
            params: { cpf: artesaoData.cpf },
        });
        if (existingCpf.data.length > 0) {
            throw new Error('CPF_EXISTS');
        }

        const response = await apiService.post<Artesao>('/artesaos', artesaoData);
        return response.data;
    },

    async getProduct(tituloOrId: string | number): Promise<Product | null> {
        try {
            // Tenta buscar diretamente pela rota padrão de ID/slug se o backend suportar
            const response = await apiService.get<Product>(`/products/${tituloOrId}`);
            return response.data;
        } catch {
            // Fallback: se a API espera busca por parâmetro ou se falhar, buscamos todos e filtramos
            const response = await apiService.get<Product[]>('/products');
            const produtoEncontrado = response.data.find(
                (p) => String(p.id) === String(tituloOrId) || p.titulo.toLowerCase() === String(tituloOrId).toLowerCase()
            );
            return produtoEncontrado || null;
        }
    },

    async getProducts(titulo?: string): Promise<Product[]> {
        const response = await apiService.get<Product[]>('/products', {
            params: titulo ? { titulo } : undefined,
        });
        return response.data;
    }
};
