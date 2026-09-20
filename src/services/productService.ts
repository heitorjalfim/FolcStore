import { apiService } from './apiService';
import { Produto, CriarProdutoDTO, AtualizarProdutoDTO } from '@/types/product';

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

  async getById(id: string | number): Promise<Produto> {
    try {
      const response = await apiService.get<Produto>(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar produto ${id}:`, error);
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
      const skuGerado = payload.sku || (payload.tipo === 'unico' ? `UNI-${Date.now().toString().slice(-4)}` : `LOT-${Date.now().toString().slice(-4)}`);
      
      const dadosCompletos: Produto = {
        ...payload,
        id: idGerado,
        sku: skuGerado,
        linkImagens: payload.galeriaImagens?.length ? payload.galeriaImagens : ['https://picsum.photos/400/400'],
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
      const response = await apiService.patch<Produto>(`/products/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar produto ${id}:`, error);
      throw error;
    }
  },

  async delete(id: string | number): Promise<void> {
    try {
      await apiService.delete(`/products/${id}`);
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