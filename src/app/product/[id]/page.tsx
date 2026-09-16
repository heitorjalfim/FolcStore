"use client";

import { useEffect, useState } from "react";
import { Box, Heading, Text, VStack, HStack, Button, Image } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { userService } from "@/services/userService";
import { cartStore } from "@/store/cartStore";
import { Product, Artesao } from "@/types";

type PageProps = {
    params: Promise<{
        id: string;
    }>;
};

type ProductWithImages = Product & {
    linkImagens?: string[] | string;
};

export default function DetalheProdutoPage({ params }: PageProps) {
    const [produto, setProduto] = useState<ProductWithImages | null>(null);
    const [artesao, setArtesao] = useState<Artesao | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantidade, setQuantidade] = useState(1);

    const router = useRouter();
    const addItem = cartStore((state) => state.addItem);

    useEffect(() => {
        async function fetchDados() {
            const resolvedParams = await params;
            const productId = resolvedParams.id;

            const produtoRes = await userService.getProduct(productId);
            setProduto(produtoRes);

            if (produtoRes && produtoRes.idArtesao) {
                try {
                    const artesaoRes = await userService.getArtesaoById(produtoRes.idArtesao);
                    setArtesao(artesaoRes);
                } catch {
                    // Tratar caso o artesão não seja encontrado
                }
            }

            setLoading(false);
        }

        fetchDados();
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
                    <Text color="gray.600">Não foi possível localizar este produto pelo ID fornecido.</Text>
                </VStack>
            </Box>
        );
    }

    let primeiraImagem = "";
    if (produto.linkImagens) {
        if (Array.isArray(produto.linkImagens) && produto.linkImagens.length > 0) {
            primeiraImagem = produto.linkImagens[0];
        } else if (typeof produto.linkImagens === "string") {
            primeiraImagem = produto.linkImagens.split(",")[0].trim();
        }
    }

    const estoqueDisponivel = produto.quantidadeEstoque ?? 0;
    const esgotado = estoqueDisponivel < 1;

    const handleIncrement = () => {
        if (quantidade < estoqueDisponivel) {
            setQuantidade((prev) => prev + 1);
        }
    };

    const handleDecrement = () => {
        if (quantidade > 1) {
            setQuantidade((prev) => prev - 1);
        }
    };

    const handleAddToCart = () => {
        if (esgotado || quantidade > estoqueDisponivel) return;

        for (let i = 0; i < quantidade; i++) {
            addItem({
                id: String(produto.id),
                name: produto.titulo,
                price: produto.preco,
            });
        }

        router.push("/cart");
    };

    return (
        <Box maxW="7xl" mx="auto" py={8} px={4}>
            <VStack spacing={6} align="start" w="full">
                <Heading as="h1" size="xl" color="gray.800">
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

                    <Text fontSize="2xl" fontWeight="bold" color="green.600" mb={2}>
                        R$ {produto.preco.toFixed(2)}
                    </Text>

                    <Text fontSize="sm" color={esgotado ? "red.500" : "gray.600"} mb={4}>
                        {esgotado ? "Produto Esgotado" : `Estoque disponível: ${estoqueDisponivel}`}
                    </Text>

                    <Text color="gray.700" mb={6}>
                        {produto.descricao}
                    </Text>

                    {!esgotado && (
                        <HStack spacing={4} mb={6} align="center">
                            <Text fontWeight="medium">Quantidade:</Text>
                            <HStack>
                                <Button
                                    size="sm"
                                    onClick={handleDecrement}
                                    isDisabled={quantidade <= 1}
                                >
                                    -
                                </Button>
                                <Text px={2} fontWeight="bold">{quantidade}</Text>
                                <Button
                                    size="sm"
                                    onClick={handleIncrement}
                                    isDisabled={quantidade >= estoqueDisponivel}
                                >
                                    +
                                </Button>
                            </HStack>
                        </HStack>
                    )}

                    <Button
                        colorScheme="blue"
                        size="lg"
                        onClick={handleAddToCart}
                        isDisabled={esgotado}
                        mb={6}
                    >
                        {esgotado ? "Indisponível" : "Adicionar ao Carrinho"}
                    </Button>

                    {/* Substituído o Divider por uma borda superior via Box */}
                    <Box pt={6} borderTop="1px solid" borderColor="gray.200" w="full">
                        {artesao ? (
                            <Box bg="gray.50" p={4} borderRadius="md" borderWidth="1px" borderColor="gray.200" w="full">
                                <Text fontSize="sm" fontWeight="bold" color="gray.500" textTransform="uppercase" mb={1}>
                                    Criado por
                                </Text>
                                <Heading as="h3" size="md" color="gray.800" mb={2}>
                                    {artesao.nome}
                                </Heading>
                                <Text fontSize="sm" color="gray.600" mb={4}>
                                    Região de Produção: {artesao.regiaoProducao}
                                </Text>
                                <Button
                                    as={Link}
                                    href={`/artesao/${encodeURIComponent(artesao.nome.toLowerCase().replace(/\s+/g, '-'))}`}
                                    size="sm"
                                    colorScheme="teal"
                                    variant="outline"
                                >
                                    Ver Perfil do Artesão
                                </Button>
                            </Box>
                        ) : (
                            <Text fontSize="sm" color="gray.500">Informações do artesão não disponíveis.</Text>
                        )}
                    </Box>
                </Box>
            </VStack>
        </Box>
    );
}
