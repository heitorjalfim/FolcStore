export interface Product {
    id: string;
    idArtesao: string;
    titulo: string;
    descricao: string;
    materiaPrima: string;
    tecnica: string;
    regiaoProducao: string;
    categoria: string;
    preco: number;
    quantidadeEstoque: number;
    imagem: string;
    dimensoes: string;
    linkImagens: string[];
}
