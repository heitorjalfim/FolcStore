export type TipoProduto = 'unico' | 'lote';

export interface Product {
    id: number;
    idArtesao: string;
    titulo: string;
    descricao: string;
    materiaPrima: string;
    tecnica: string;
    regiaoProducao: string;
    categoria: string;
    preco: number;
    quantidadeEstoque: number;
    dimensoes: string;
    linkImagens: string[];
    imagem?: string;
    tipo?: TipoProduto;
    sku?: string;
    prazoProducao?: number;
    ativo?: boolean;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export type CriarProductDTO = Omit<Product, 'id'> & {
    id?: number;
};

export type AtualizarProductDTO = Partial<Omit<Product, 'id' | 'idArtesao'>>;