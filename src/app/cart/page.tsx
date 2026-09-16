"use client";

import { Box, Heading, Text, VStack, HStack, Button, Flex } from "@chakra-ui/react";
import Link from "next/link";
import { cartStore } from "@/store/cartStore";

export default function CartPage() {
    const { items, removeItem, clearCart } = cartStore();

    const valorTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

    if (items.length === 0) {
        return (
            <Box maxW="7xl" mx="auto" py={12} px={4} textAlign="center">
                <VStack spacing={4}>
                    <Heading as="h1" size="lg" color="gray.700">
                        Seu carrinho está vazio
                    </Heading>
                    <Text color="gray.500">Adicione alguns produtos para começar a comprar.</Text>
                    <Button as={Link} href="/" mt={2}>
                        Voltar para a Loja
                    </Button>
                </VStack>
            </Box>
        );
    }

    return (
        <Box maxW="7xl" mx="auto" py={8} px={4}>
            <Heading as="h1" size="xl" color="gray.800" mb={6}>
                Carrinho de Compras
            </Heading>

            <VStack spacing={6} align="stretch">
                <Box bg="white" p={6} borderWidth="1px" borderRadius="lg" boxShadow="sm">
                    <VStack spacing={4} align="stretch">
                        {items.map((item, index) => (
                            <Box
                                key={item.id}
                                pb={index < items.length - 1 ? 4 : 0}
                                borderBottom={index < items.length - 1 ? "1px solid" : "none"}
                                borderColor="gray.100"
                            >
                                <Flex justify="space-between" align="center">
                                    <VStack align="start" spacing={1}>
                                        <Text fontWeight="semibold" fontSize="lg" color="gray.800">
                                            {item.name}
                                        </Text>
                                        <Text fontSize="sm" color="gray.500">
                                            Quantidade: {item.quantity} x R$ {item.price.toFixed(2)}
                                        </Text>
                                    </VStack>
                                    <HStack spacing={4}>
                                        <Text fontWeight="bold" color="green.600">
                                            R$ {(item.price * item.quantity).toFixed(2)}
                                        </Text>
                                        <Button
                                            size="sm"
                                            bg="red"
                                            onClick={() => removeItem(item.id)}
                                        >
                                            Remover
                                        </Button>
                                    </HStack>
                                </Flex>
                            </Box>
                        ))}
                    </VStack>

                    <Flex justify="space-between" align="center" mt={6} pt={4} borderTop="2px solid" borderColor="gray.100">
                        <Button size="sm" variant="ghost" bg="gray" onClick={clearCart}>
                            Esvaziar Carrinho
                        </Button>
                        <Text fontSize="xl" fontWeight="bold" color="gray.800">
                            Total: R$ {valorTotal.toFixed(2)}
                        </Text>
                    </Flex>
                </Box>

                <Flex justify="flex-end" gap={4}>
                    <Button
                        as={Link}
                        href="/cart/checkout"
                        bg="blue"
                        size="lg"
                    >
                        Finalizar Compra
                    </Button>
                </Flex>
            </VStack>
        </Box>
    );
}
