import { apiService } from './apiService';
import { Produto, CriarProdutoDTO, AtualizarProdutoDTO } from '@/types/product';

export function extractProductId(slugOrId: string | number): string {
    const str = String(slugOrId);
    
    // Se o slug vier no formato "titulo--id", separa e pega a última parte (ex: "posseee")
    if (str.includes('--')) {
        const parts = str.split('--');
        return parts[parts.length - 1];
    }

    const match = str.match(/(?:--|-)?(prod-[a-zA-Z0-9]+|[a-f0-9-]{36}|\d+|posseee)$/i);
    return match ? match[1] : str;
}

export const productService = {
    async getAll(): Promise<Produto[]> {
        try {
            const response = await apiService.get<Produto[]>('/products');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            throw error;
        }
    },

    async getById(idOrSlug: string | number): Promise<Produto> {
        try {
            const cleanId = extractProductId(idOrSlug);
            const response = await apiService.get<Produto>(`/products/${cleanId}`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar produto ${idOrSlug}:`, error);
            throw error;
        }
    },

    async getByArtesao(idArtesao: string): Promise<Produto[]> {
        try {
            const response = await apiService.get<Produto[]>('/products', {
                params: { idArtesao },
            });
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar produtos do artesão ${idArtesao}:`, error);
            throw error;
        }
    },

    async create(payload: CriarProdutoDTO): Promise<Produto> {
        try {
            const idGerado = payload.id || `prod-${Date.now().toString().slice(-4)}`;
            const skuGerado =
                payload.sku ||
                (payload.tipo === 'unico'
                    ? `UNI-${Date.now().toString().slice(-4)}`
                    : `LOT-${Date.now().toString().slice(-4)}`);

            const dadosCompletos: Produto = {
                ...payload,
                id: idGerado,
                sku: skuGerado,
                linkImagens: payload.galeriaImagens?.length
                    ? payload.galeriaImagens
                    : ['https://picsum.photos/400/400'],
                imagem: payload.galeriaImagens?.[0] || 'https://picsum.photos/400/400',
                dataCriacao: new Date().toISOString(),
            };

            const response = await apiService.post<Produto>('/products', dadosCompletos);
            return response.data;
        } catch (error) {
            console.error('Erro ao cadastrar produto:', error);
            throw error;
        }
    },

    async update(id: string | number, payload: AtualizarProdutoDTO): Promise<Produto> {
        try {
            const cleanId = extractProductId(id);
            const response = await apiService.patch<Produto>(`/products/${cleanId}`, payload);
            return response.data;
        } catch (error) {
            console.error(`Erro ao atualizar produto ${id}:`, error);
            throw error;
        }
    },

    async delete(id: string | number): Promise<void> {
        try {
            const cleanId = extractProductId(id);
            await apiService.delete(`/products/${cleanId}`);
        } catch (error) {
            console.error(`Erro ao deletar produto ${id}:`, error);
            throw error;
        }
    },

    async searchByText(query: string): Promise<Produto[]> {
        try {
            const response = await apiService.get<Produto[]>('/products', {
                params: { q: query },
            });
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar produtos com o termo "${query}":`, error);
            throw error;
        }
    },
};