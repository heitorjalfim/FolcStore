import { apiService } from './apiService';
import { Product } from "@/types/product";

export const productService = {
  async getAll(): Promise<Product[]> {
    try {
      const response = await apiService.get<Product[]>("/products");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      throw error;
    }
  },

  async getByCategory(categoria: string): Promise<Product[]> {
    try {
      const response = await apiService.get<Product[]>("/products", {
        params: { categoria },
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar produtos da categoria "${categoria}":`, error);
      throw error;
    }
  },

  async getById(id: number): Promise<Product> {
    try {
      const response = await apiService.get<Product>(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar produto ${id}:`, error);
      throw error;
    }
  },

  // Busca combinada: aceita qualquer combinação de categoria, técnica e região.
  // Os filtros omitidos (undefined) não são enviados na query.
  async search(
    filters: Partial<Pick<Product, "categoria" | "tecnica" | "regiaoProducao">>
  ): Promise<Product[]> {
    try {
      const response = await apiService.get<Product[]>("/products", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar produtos com filtros:", filters, error);
      throw error;
    }
  },

  // Busca por texto livre: usa o parâmetro "q" do json-server, que procura
  // o termo em TODOS os campos do produto (título, descrição, técnica, etc.)
  async searchByText(query: string): Promise<Product[]> {
    try {
      const response = await apiService.get<Product[]>("/products", {
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
      const response = await apiService.get<Product[]>("/products", {
        params: { idArtesao },
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar produtos do artesão ${idArtesao}:`, error);
      throw error;
    }
  },
};