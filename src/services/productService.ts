import { apiService } from './apiService';
import { Product, CriarProductDTO, AtualizarProductDTO } from '@/types/product';

export const productService = {
  async getAll(): Promise<Product[]> {
    try {
      const response = await apiService.get<Product[]>('/products');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
  },

  async getByCategory(categoria: string): Promise<Product[]> {
    try {
      const response = await apiService.get<Product[]>('/products', {
        params: { categoria },
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar produtos da categoria "${categoria}":`, error);
      throw error;
    }
  },

  async getById(id: string | number): Promise<Product> {
    try {
      const response = await apiService.get<Product>(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar produto ${id}:`, error);
      throw error;
    }
  },

  async search(
    filters: Partial<Pick<Product, 'categoria' | 'tecnica' | 'regiaoProducao'>>
  ): Promise<Product[]> {
    try {
      const response = await apiService.get<Product[]>('/products', {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar produtos com filtros:', filters, error);
      throw error;
    }
  },

  async searchByText(query: string): Promise<Product[]> {
    try {
      const response = await apiService.get<Product[]>('/products', {
        params: { q: query },
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar produtos com o termo "${query}":`, error);
      throw error;
    }
  },

  async getByArtesao(idArtesao: string): Promise<Product[]> {
    try {
      const response = await apiService.get<Product[]>('/products', {
        params: { idArtesao },
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar produtos do artesão ${idArtesao}:`, error);
      throw error;
    }
  },

  // --- MÉTODOS CRUD (HU-67 a HU-69) ---

  async create(payload: CriarProductDTO): Promise<Product> {
    try {
      const response = await apiService.post<Product>('/products', payload);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar produto na API:', error);
      throw error;
    }
  },

  async update(id: string | number, payload: AtualizarProductDTO): Promise<Product> {
    try {
      const response = await apiService.patch<Product>(`/products/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar parcialmente o produto ${id}:`, error);
      throw error;
    }
  },

  async delete(id: string | number): Promise<void> {
    try {
      await apiService.delete(`/products/${id}`);
    } catch (error) {
      console.error(`Erro ao remover produto ${id}:`, error);
      throw error;
    }
  },
};