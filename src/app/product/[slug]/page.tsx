"use client";

import { useEffect, useState, use } from "react";
import { Box, Heading, Text, VStack, HStack, Button, Image } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { userService } from "@/services/userService";
import { productService } from "@/services/productService";
import { useCartStore } from "@/store/cartStore";
import { Product, Artesao } from "@/types";
import { HeaderCarrinho } from "@/app/components/HeaderCarrinho";



type ProductWithImages = Product & {
    linkImagens?: string[] | string;
};

type PageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export default function DetalheProdutoPage({ params }: PageProps) {
    const resolvedParams = use(params);

    const rawUrlParam = decodeURIComponent(resolvedParams.slug);
    const urlParts = rawUrlParam.split("-");
    const productId = urlParts[urlParts.length - 1];

    const [produto, setProduto] = useState<ProductWithImages | null>(null);

    const [artesao, setArtesao] = useState<Artesao | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantidade, setQuantidade] = useState(1);
    const [erroEstoque, setErroEstoque] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);

    const router = useRouter();

    const addItem = useCartStore((state) => state.addItem);
    const cartItems = useCartStore((state: any) => state.items || []);

    useEffect(() => {
        async function fetchDados() {
            setLoading(true);

            try {
                const produtoRes = await productService.getById(productId);
                setProduto(produtoRes);

                // DEBUG: Verifique exatamente o que está vindo no produto
                console.log("Dados do Produto:", produtoRes);

                if (produtoRes && produtoRes.idArtesao) {
                    try {
                        const artesaoRes = await userService.getArtesaoById(produtoRes.idArtesao);

                        // DEBUG: Verifique se o artesão foi encontrado
                        console.log("Dados do Artesão:", artesaoRes);

                        setArtesao(artesaoRes);
                    } catch (artesaoError) {
                        // AGORA VOCÊ VERÁ O ERRO NO CONSOLE
                        console.error("Erro ao buscar o artesão:", artesaoError);
                    }
                } else {
                    console.warn("O produto não possui um campo 'idArtesao'.");
                }
            } catch (error) {
                console.error("Erro ao carregar os dados do produto:", error);
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

    const primeiraImagem = produto.linkImagens[0];

    const estoqueDisponivel = produto.quantidadeEstoque ?? 0;

    const quantidadeNoCarrinho = cartItems.reduce((total: number, item: any) => {
        if (String(item.id) === String(produto.id)) {
            return total + (item.quantity || 1);
        }
        return total;
    }, 0);

    const estoqueRestante = estoqueDisponivel - quantidadeNoCarrinho;
    const esgotado = estoqueDisponivel < 1 || estoqueRestante < 1;
    const limiteAtingido = quantidade > estoqueRestante || estoqueRestante < 1;

    if (quantidade > estoqueRestante && estoqueRestante > 0) {
        setQuantidade(estoqueRestante);
    }

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
        if (esgotado || limiteAtingido || quantidade > estoqueRestante || isNavigating) {
            return;
        }

        setIsNavigating(true);

        for (let i = 0; i < quantidade; i++) {
            addItem({
                id: String(produto.id),
                name: produto.titulo,
                price: produto.preco,
            });
        }

        router.push("/customer/checkout");
    };

    const botaoDesabilitado = Boolean(esgotado || limiteAtingido || isNavigating || quantidade > estoqueRestante);

    return (
        <Box minH="100vh">
            <HeaderCarrinho />
            <Box maxW="7xl" mx="auto" py={8} px={4}>
                <VStack gap={6} align="start" w="full">
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

                        <Text fontSize="sm" color={esgotado ? "red.500" : "gray.600"} mb={1}>
                            {esgotado ? "Produto Esgotado" : `Estoque total: ${estoqueDisponivel}`}
                        </Text>

                        <Text color="gray.700" mb={6} mt={3}>
                            {produto.descricao}
                        </Text>

                        {!esgotado && quantidadeNoCarrinho > 0 && !isNavigating && (
                            <Text fontSize="sm" color="orange.500" mb={4} fontWeight="medium">
                                Você já tem esse item no seu carrinho. (Total {quantidadeNoCarrinho})
                            </Text>
                        )}

                        {!esgotado && estoqueRestante > 0 && (
                            <HStack gap={4} mb={6} align="center">
                                <Text fontWeight="medium">Quantidade:</Text>
                                <HStack>
                                    <Button
                                        size="sm"
                                        onClick={handleDecrement}
                                        disabled={quantidade <= 1 || isNavigating}
                                    >
                                        -
                                    </Button>
                                    <Text px={2} fontWeight="bold">{quantidade}</Text>
                                    <Button
                                        size="sm"
                                        onClick={handleIncrement}
                                        disabled={quantidade >= estoqueRestante || isNavigating}
                                    >
                                        +
                                    </Button>
                                </HStack>
                            </HStack>
                        )}

                        {erroEstoque && !isNavigating && (
                            <Text color="red.500" fontSize="sm" mb={4}>
                                A quantidade selecionada excede o estoque disponível.
                            </Text>
                        )}

                        <Button
                            size="lg"
                            bg="blue.500"
                            color="white"
                            _hover={{ bg: "blue.600" }}
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
        </Box>
    );
}
