import { MetodoPagamento, Pagamento } from '@/types';

export const paymentService = {
    processar(metodo: MetodoPagamento, numeroCartao?: string): Pagamento {
        return {
            metodo,
            status: "aprovado",
            cartaoMascarado: numeroCartao
                ? `**** **** **** ${numeroCartao.slice(-4)}`
                : undefined,
        };
    },
};
