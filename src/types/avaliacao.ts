export interface Avaliacao {
    id?: string;
    idComprador: string;
    nomeComprador: string;
    idArtesao: string;
    idProduto: string | number;
    nota: number;
    comentario: string;
    data: string;
}