export type TipoProduto = 'unico' | 'lote';

export interface DimensoesProduto {
  altura: number; // em cm
  largura: number; // em cm
  profundidade: number; // em cm
  peso: number; // em kg
}

export interface Produto {
  id: string;
  sku: string;
  titulo: string;
  descricao: string;
  materiaPrima: string;
  tecnica: string;
  regiaoProducao: string;
  categoria: string;
  preco: number;
  tipo: TipoProduto;
  quantidadeEstoque: number;
  idArtesao: string;
  nomeArtesao: string;
  dimensoes: DimensoesProduto;
  guiaCuidados: string;
  galeriaImagens: string[];
  prazoProducao: number; // em dias úteis
  ativo: boolean;
  dataCriacao?: string;

  // Propriedades opcionais de retrocompatibilidade para componentes legados da vitrine
  linkImagens?: string[];
  imagem?: string;
}

export type CriarProdutoDTO = Omit<Produto, 'id'> & {
  id?: string;
};

export type AtualizarProdutoDTO = Partial<Omit<Produto, 'id' | 'idArtesao'>>;

// --- ALIASES DE RETROCOMPATIBILIDADE COM A EQUIPE ---
export type Product = Produto;
export type CriarProductDTO = CriarProdutoDTO;
export type AtualizarProductDTO = AtualizarProdutoDTO;

export interface CartItem {
  product: Produto;
  quantity: number;
}