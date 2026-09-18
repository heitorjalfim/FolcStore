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
}

export interface CartItem {
    product: Product;
    quantity: number;
}
