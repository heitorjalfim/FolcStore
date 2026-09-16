"use client";

import { Box, Heading, Text, VStack, Button, Input } from "@chakra-ui/react";
import Link from "next/link";

export default function CheckoutSubmitPage() {
    return (
        <Box maxW="2xl" mx="auto" py={12} px={4}>
            <VStack spacing={6} align="stretch" bg="white" p={8} borderWidth="1px" borderRadius="lg" boxShadow="sm">
                <Heading as="h1" size="xl" color="gray.800" textAlign="center">
                    Finalizar Pedido
                </Heading>

                <Text color="gray.600" textAlign="center">
                    Preencha os dados abaixo para concluir sua compra (Placeholder).
                </Text>

                <Box>
                    <Text mb={2} fontSize="sm" fontWeight="semibold" color="gray.700">
                        Endereço de Entrega
                    </Text>
                    <Input placeholder="Digite seu endereço completo..." />
                </Box>

                <Box>
                    <Text mb={2} fontSize="sm" fontWeight="semibold" color="gray.700">
                        Forma de Pagamento
                    </Text>
                    <Input placeholder="Ex: Cartão de Crédito, Pix..." />
                </Box>

                <Button bg="blue" size="lg" w="full" mt={4}>
                    Confirmar Pedido
                </Button>

                <Button as={Link} href="/cart" variant="ghost" size="sm" mt={2}>
                    Voltar para o Carrinho
                </Button>
            </VStack>
        </Box>
    );
}
