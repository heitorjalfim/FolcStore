// src/app/product/[slug]/page.tsx
"use client";

import { useEffect, useState, use } from "react";
import { Box, Heading, Text, VStack, HStack, Button, Image } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { userService } from "@/services/userService";
import { productService, extractProductId } from "@/services/productService";
import { useCartStore } from "@/store/cartStore";
import { Product, Artesao, CartItem } from "@/types";

type PageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export default function DetalheProdutoPage({ params }: PageProps) {
    const resolvedParams = use(params);
    const rawUrlParam = decodeURIComponent(resolvedParams.slug);
    const productId = extractProductId(rawUrlParam);

    const [produto, setProduto] = useState<Product | null>(null);
    const [artesao, setArtesao] = useState<Artesao | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantidade, setQuantidade] = useState(1);
    const [isNavigating, setIsNavigating] = useState(false);

    const router = useRouter();
    const addItem = useCartStore((state) => state.addItem);
    const cartItems = useCartStore((state) => state.items);

    useEffect(() => {
        async function fetchDados() {
            setLoading(true);
            try {
                const produtoRes = await productService.getById(productId);
                setProduto(produtoRes);

                if (produtoRes?.idArtesao) {
                    try {
                        const artesaoRes = await userService.getArtesaoById(produtoRes.idArtesao);
                        setArtesao(artesaoRes);
                    } catch (artesaoError) {
                        console.error("Erro ao buscar o artesão:", artesaoError);
                    }
                }
            } catch (error) {
                console.error("Erro ao carregar dados do produto:", error);
                setProduto(null);
            } finally {
                setLoading(false);
            }
        }

        fetchDados();
    }, [productId]);

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
                <VStack gap={4} align="start">
                    <Heading as="h1" size="lg" color="red.500">
                        Produto não encontrado
                    </Heading>
                    <Text color="gray.600">Não foi possível localizar este produto pelo ID fornecido.</Text>
                </VStack>
            </Box>
        );
    }

    const primeiraImagem = produto.linkImagens?.[0] || produto.imagem;
    const estoqueDisponivel = produto.quantidadeEstoque ?? 0;

    const quantidadeNoCarrinho = cartItems.reduce((total: number, item: CartItem) => {
        if (String(item?.product?.id) === String(produto.id)) {
            return total + (item.quantity || 1);
        }
        return total;
    }, 0);

    const estoqueRestante = estoqueDisponivel - quantidadeNoCarrinho;
    const esgotado = estoqueDisponivel < 1 || estoqueRestante < 1;
    const limiteAtingido = quantidade > estoqueRestante || estoqueRestante < 1;

    const handleIncrement = () => {
        if (quantidade < estoqueRestante) {
            setQuantidade((prev) => prev + 1);
        }
    };

    const handleDecrement = () => {
        if (quantidade > 1) {
            setQuantidade((prev) => prev - 1);
        }
    };

    const handleAddToCart = () => {
        if (esgotado || limiteAtingido || isNavigating) return;

        setIsNavigating(true);
        for (let i = 0; i < quantidade; i++) {
            addItem(produto);
        }
        router.push("/customer/checkout");
    };

    const botaoDesabilitado = Boolean(esgotado || limiteAtingido || isNavigating);

    return (
        <Box minH="100vh" bg="gray.50">
            <Box maxW="7xl" mx="auto" py={8} px={4}>
                <VStack gap={6} align="start" w="full">
                    <Heading as="h1" size="xl" color="gray.900">
                        {produto.titulo}
                    </Heading>

                    <Box mt={4} p={6} borderWidth="1px" borderRadius="lg" bg="white" w="full" boxShadow="sm" borderColor="gray.200">
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

                        {/* Preço utilizando o tom forte da marca (brand.700 ou brand.800) */}
                        <Text fontSize="2xl" fontWeight="bold" color="brand.700" mb={2}>
                            R$ {Number(produto.preco).toFixed(2)}
                        </Text>

                        <Text fontSize="sm" color={esgotado ? "red.500" : "gray.600"} mb={1}>
                            {esgotado ? "Produto Esgotado" : `Estoque total: ${estoqueDisponivel}`}
                        </Text>

                        <Text color="gray.700" mb={6} mt={3}>
                            {produto.descricao}
                        </Text>

                        {!esgotado && quantidadeNoCarrinho > 0 && !isNavigating && (
                            <Text fontSize="sm" color="brand.600" mb={4} fontWeight="medium">
                                Você já tem esse item no seu carrinho. (Total {quantidadeNoCarrinho})
                            </Text>
                        )}

                        {!esgotado && estoqueRestante > 0 && (
                            <HStack gap={4} mb={6} align="center">
                                <Text fontWeight="medium" color="gray.700">Quantidade:</Text>
                                <HStack>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={handleDecrement}
                                        disabled={quantidade <= 1 || isNavigating}
                                    >
                                        -
                                    </Button>
                                    <Text px={2} fontWeight="bold" color="gray.800">{quantidade}</Text>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={handleIncrement}
                                        disabled={quantidade >= estoqueRestante || isNavigating}
                                    >
                                        +
                                    </Button>
                                </HStack>
                            </HStack>
                        )}

                        {/* Botão principal com a cor de destaque da marca definida no tema (brand.500 / brand.600) */}
                        <Button
                            size="lg"
                            bg="brand.500"
                            color="gray.900"
                            fontWeight="bold"
                            _hover={{ bg: "brand.600" }}
                            onClick={handleAddToCart}
                            disabled={botaoDesabilitado}
                            loading={isNavigating}
                            mb={6}
                        >
                            {esgotado || estoqueRestante < 1
                                ? "Indisponível"
                                : limiteAtingido
                                    ? "Limite do estoque no carrinho"
                                    : "Adicionar ao Carrinho"}
                        </Button>

                        <Box pt={6} borderTop="1px solid" borderColor="gray.200" w="full">
                            {artesao ? (
                                <Box bg="brand.50" p={4} borderRadius="md" borderWidth="1px" borderColor="brand.200" w="full">
                                    <Text fontSize="sm" fontWeight="bold" color="brand.700" textTransform="uppercase" mb={1}>
                                        Criado por
                                    </Text>
                                    <Heading as="h3" size="md" color="gray.900" mb={2}>
                                        {artesao.nome}
                                    </Heading>
                                    <Text fontSize="sm" color="gray.600" mb={4}>
                                        Região de Produção: {artesao.regiaoProducao}
                                    </Text>
                                    <NextLink href={`/artesao/${encodeURIComponent(artesao.nome.toLowerCase().replace(/\s+/g, '-'))}`}>
                                        <Button size="sm" variant="outline" colorPalette="brand" borderColor="brand.500" color="brand.800" _hover={{ bg: "brand.100" }}>
                                            Ver Perfil do Artesão
                                        </Button>
                                    </NextLink>
                                </Box>
                            ) : (
                                <Text fontSize="sm" color="gray.500">Informações do artesão não disponíveis.</Text>
                            )}
                        </Box>
                    </Box>
                </VStack>
            </Box>
        </Box>
    );
}