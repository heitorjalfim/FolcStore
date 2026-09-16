"use client";

import { useEffect, useState } from "react";
import { Box, Heading, Text, HStack, VStack, Image } from "@chakra-ui/react";
import Link from "next/link";
import { userService } from "@/services/userService";
import { Product } from "@/types";

type SecaoProdutosProps = {
    titulo: string;
    tipo: "destaque" | "recomendado";
};

export default function SecaoProdutos({ titulo, tipo }: SecaoProdutosProps) {
    const [produtos, setProdutos] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const resultado = tipo === "destaque"
                    ? await userService.getDestaques()
                    : await userService.getRecomendados();

                setProdutos(resultado);
            } catch (error) {
                console.error(`Erro ao carregar ${titulo}:`, error);
            } finally {
                setLoading(false); // Garante que o estado de loading desliga por último
            }
        }

        fetchData();
    }, [tipo, titulo]);

    if (loading) {
        return (
            <Box py={4}>
                <Heading as="h2" size="lg" mb={4}>{titulo}</Heading>
                <Text color="gray.500">Carregando...</Text>
            </Box>
        );
    }

    if (produtos.length === 0) {
        return null;
    }

    return (
        <Box py={6}>
            <Heading as="h2" size="lg" mb={4} color="gray.800">
                {titulo}
            </Heading>

            <HStack spacing={4} overflowX="auto" pb={4} css={{ '&::-webkit-scrollbar': { display: 'none' } }}>
                {produtos.map((produto) => {
                    const id = produto.id
                    const imagem = Array.isArray(produto.linkImagens) ? produto.linkImagens[0] : produto.linkImagens;

                    return (
                        <Box
                            key={produto.id}
                            as={Link}
                            href={`/product/${id}`}
                            minW="220px"
                            maxW="220px"
                            bg="white"
                            borderWidth="1px"
                            borderRadius="lg"
                            overflow="hidden"
                            boxShadow="sm"
                            _hover={{ transform: "translateY(-4px)", transition: "transform 0.2s" }}
                        >
                            {imagem && (
                                <Image src={imagem} alt={produto.titulo} h="140px" w="full" objectFit="cover" />
                            )}
                            <VStack p={4} align="start" spacing={1}>
                                <Text fontWeight="bold" fontSize="md" noOfLines={1} color="gray.800">
                                    {produto.titulo}
                                </Text>
                                <Text color="green.600" fontWeight="semibold" fontSize="sm">
                                    R$ {produto.preco.toFixed(2)}
                                </Text>
                            </VStack>
                        </Box>
                    );
                })}
            </HStack>
        </Box>
    );
}
