'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Container, Heading, Text, VStack, Spinner, Flex } from '@chakra-ui/react';
import { useCartStore } from '@/store/cartStore';
import { sessionStore } from '@/store/sessionStore';
import { orderService } from '@/services/orderService';
import { CompraProduto } from '@/types/order';

export default function PagamentoPlaceholderPage() {
    const [mounted, setMounted] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const router = useRouter();
    const customer = sessionStore((state) => state.customer);
    const { items, clearCart } = useCartStore();

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    if (!customer) {
        router.push('/customer/login');
        return null;
    }

    const handleFinalizarCompra = async () => {
        setIsProcessing(true);
        try {
            // Mapeia o carrinho para o formato individual solicitado
            const compras: CompraProduto[] = items.map(item => ({
                idArtesao: item.product.idArtesao,
                idComprador: customer.id,
                idProduto: item.product.id,
                quantidade: item.quantity,
                status: "Pago",
                dataCompra: new Date().toISOString()
            }));

            // Submete os dados para /orders
            await orderService.registrarCompras(compras);

            clearCart();
            alert("Pagamento aprovado e compras registradas!");
            router.push('/customer/minha-conta');
        } catch (error) {
            alert("Erro ao processar o pagamento.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Box minH="100vh" bg="gray.50" py={12}>
            <Container maxW="md">
                <Box bg="white" p={8} borderRadius="lg" shadow="sm" borderWidth="1px">
                    <VStack gap={6} align="stretch" textAlign="center">
                        <Heading size="md" color="brand.500">Simulação de Pagamento</Heading>
                        <Text color="gray.600">
                            Você possui <b>{items.length}</b> tipo(s) de produto(s) no carrinho.
                        </Text>

                        <Button
                            colorPalette="green"
                            size="lg"
                            onClick={handleFinalizarCompra}
                            loading={isProcessing}
                            loadingText="Processando..."
                        >
                            Confirmar e Pagar
                        </Button>
                    </VStack>
                </Box>
            </Container>
        </Box>
    );
}
