"use client";

import { useEffect, useState } from "react";
import { Box, Heading, Text, VStack, Button, Image } from "@chakra-ui/react";
import { userService } from "@/services/userService";
import { cartStore } from "@/store/cartStore";
import { Product } from "@/types";

type PageProps = {
    params: Promise<{
        titulo: string;
    }>;
};

// Extensão opcional caso o tipo Product ainda não inclua linkImagens
type ProductWithImages = Product & {
    linkImagens?: string[] | string;
};

export default function DetalhePorTituloPage({ params }: PageProps) {
    const [produto, setProduto] = useState<ProductWithImages | null>(null);
    const [loading, setLoading] = useState(true);
    const [mensagemSucesso, setMensagemSucesso] = useState(false);

    const addItem = cartStore((state) => state.addItem);

    useEffect(() => {
        async function fetchProduto() {
            const resolvedParams = await params;
            const tituloFormatado = decodeURIComponent(resolvedParams.titulo).replace(/-/g, " ");

            const resultado = await userService.getProduct(tituloFormatado);
            setProduto(resultado);
            setLoading(false);
        }

        fetchProduto();
    }, [params]);

    if (loading) {
        return (
            <Box maxW="7xl" mx="auto" py={8} px={4}>
                <Text color="gray.500">Carregando produto...</Text>
            </Box>
        );
    }

    if (!produto) {
        return (
            <Box maxW="7xl" mx="auto" py={8} px={4}>
                <VStack spacing={4} align="start">
                    <Heading as="h1" size="lg" color="red.500">
                        Produto não encontrado
                    </Heading>
                    <Text color="gray.600">Não foi possível localizar este produto.</Text>
                </VStack>
            </Box>
        );
    }

    // Mostra a primeira imagem mas linkImagens é um array que pode ter mais
    let primeiraImagem = "";
    if (produto.linkImagens) {
        if (Array.isArray(produto.linkImagens) && produto.linkImagens.length > 0) {
            primeiraImagem = produto.linkImagens[0];
        } else if (typeof produto.linkImagens === "string") {
            primeiraImagem = produto.linkImagens.split(",")[0].trim();
        }
    }

    const handleAddToCart = () => {
        addItem({
            id: String(produto.id),
            name: produto.titulo,
            price: produto.preco,
        });

        setMensagemSucesso(true);
        setTimeout(() => setMensagemSucesso(false), 3000);
    };

    return (
        <Box maxW="7xl" mx="auto" py={8} px={4}>
            <VStack spacing={6} align="start" w="full">
                <Heading as="h1" size="xl" color="gray.800" textTransform="capitalize">
                    {produto.titulo}
                </Heading>

                <Box mt={4} p={6} borderWidth="1px" borderRadius="lg" bg="white" w="full" boxShadow="sm">
                    {primeiraImagem && (
                        <Box mb={6} borderRadius="md" overflow="hidden" maxW="md" bg="gray.100">
                            <Image
                                src={primeiraImagem}
                                alt={produto.titulo}
                                objectFit="cover"
                                w="full"
                                h="300px"
                            />
                        </Box>
                    )}

                    <Text fontSize="2xl" fontWeight="bold" color="green.600" mb={4}>
                        R$ {produto.preco.toFixed(2)}
                    </Text>

                    <Text color="gray.700" mb={6}>
                        {produto.descricao}
                    </Text>

                    {mensagemSucesso && (
                        <Text color="green.600" fontSize="sm" fontWeight="medium" mb={4}>
                            ✓ Produto adicionado ao carrinho com sucesso!
                        </Text>
                    )}

                    <Button
                        colorScheme="blue"
                        size="lg"
                        onClick={handleAddToCart}
                    >
                        Adicionar ao Carrinho
                    </Button>
                </Box>
            </VStack>
        </Box>
    );
}
