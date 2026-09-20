import { Endereco } from "./customer";

export type MetodoPagamento = "cartao" | "pix";

export interface Pagamento {
    metodo: MetodoPagamento;
    status: "aprovado";
    cartaoMascarado?: string;
}

export interface OrderItem {
    productId: string | number;
    titulo: string;
    precoUnitario: number;
    quantidade: number;
}

export interface Order {
    id: string;
    customerId: string;
    itens: OrderItem[];
    total: number;
    enderecoEntrega: Endereco;
    pagamento: Pagamento;
    status: "Confirmado";
    createdAt: string;
}