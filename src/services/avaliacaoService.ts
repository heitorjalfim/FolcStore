import { apiService } from './apiService';
import { Avaliacao } from '@/types/avaliacao';
import { Artesao } from '@/types/artesao';

export const avaliacaoService = {
    async criar(avaliacao: Omit<Avaliacao, 'id'>): Promise<Avaliacao> {
        try {
            const response = await apiService.post<Avaliacao>('/avaliacoes', { 
                ...avaliacao, 
                id: crypto.randomUUID() 
            });
            
            const artRes = await apiService.get<Artesao>(`/artesaos/${avaliacao.idArtesao}`);
            const artesao = artRes.data;
            const totalAtual = artesao.totalAvaliacoes || 0;
            const notaAtual = artesao.notaMedia || 0;
            
            const novoTotal = totalAtual + 1;
            const novaMedia = ((notaAtual * totalAtual) + avaliacao.nota) / novoTotal;

            await apiService.patch(`/artesaos/${avaliacao.idArtesao}`, { 
                notaMedia: novaMedia, 
                totalAvaliacoes: novoTotal 
            });

            return response.data;
        } catch (error) {
            console.error("Erro ao registrar avaliação:", error);
            throw error;
        }
    },

    async getPorProduto(idProduto: string | number): Promise<Avaliacao[]> {
        try {
            const response = await apiService.get<Avaliacao[]>('/avaliacoes', {
                params: { 
                    idProduto, 
                    _sort: 'data', 
                    _order: 'desc' 
                }
            });
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar avaliações do produto:", error);
            return [];
        }
    }
};