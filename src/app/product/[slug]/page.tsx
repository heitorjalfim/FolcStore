"use client";

import { useEffect, useState, use } from "react";
import { Box, Heading, Text, VStack, HStack, Button, Image, Separator, Flex } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { userService } from "@/services/userService";
import { productService } from "@/services/productService";
import { avaliacaoService } from "@/services/avaliacaoService";
import { useCartStore } from "@/store/cartStore";
import { Product, Artesao, CartItem, Avaliacao } from "@/types";
import { HeaderCarrinho } from "@/app/components/HeaderCarrinho";
import { FiStar } from "react-icons/fi";

type PageProps = { params: Promise<{ slug: string; }>; };

export default function DetalheProdutoPage({ params }: PageProps) {
    const resolvedParams = use(params);
    const rawUrlParam = decodeURIComponent(resolvedParams.slug);
    const urlParts = rawUrlParam.split("--");
    const productId = urlParts[urlParts.length - 1];

    const [produto, setProduto] = useState<Product | null>(null);
    const [artesao, setArtesao] = useState<Artesao | null>(null);
    const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
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
                // O ID do produto pode conter hífens (ex: "prod-02"), então não dá
                // para confiar em pegar só o último pedaço depois do último "-" na URL.
                // Em vez disso, buscamos todos os produtos e comparamos o slug inteiro
                // com o ID real de cada um (como sufixo ou como valor exato).
                const todosProdutos = await productService.getAll();
                const produtoEncontrado = todosProdutos.find(
                    (p: Product) =>
                        String(p.id) === rawUrlParam || rawUrlParam.endsWith(`-${p.id}`)
                );

                if (!produtoEncontrado) {
                    throw new Error(`Produto não encontrado para o slug: ${rawUrlParam}`);
                }

                setProduto(produtoEncontrado);

                if (produtoRes && produtoRes.idArtesao) {
                    const artesaoRes = await userService.getArtesaoById(produtoRes.idArtesao);
                    setArtesao(artesaoRes);
                if (produtoEncontrado.idArtesao) {
                    try {
                        const artesaoRes = await userService.getArtesaoById(produtoEncontrado.idArtesao);
                        setArtesao(artesaoRes);
                    } catch (artesaoError) {
                        console.error("Erro ao buscar o artesão:", artesaoError);
                    }
                }

                // Busca avaliações do produto e recorta as últimas 5
                const avaliacoesRes = await avaliacaoService.getPorProduto(produtoRes.id);
                setAvaliacoes(avaliacoesRes.slice(0, 5));

            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchDados();
    }, [rawUrlParam]);

    // ... (Blocos if(loading) e if(!produto) se mantêm exatamente como no arquivo original) ...
    if (loading) return <Box maxW="7xl" mx="auto" py={8} px={4}><Text>Carregando...</Text></Box>;
    if (!produto) return <Box maxW="7xl" mx="auto" py={8} px={4}><Text>Produto não encontrado.</Text></Box>;
    if (loading) {
        return (
            <Box maxW="7xl" mx="auto" py={8} px={4}>
                <Text color="fg.muted">Carregando produto...</Text>
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
                    <Text color="fg.muted">Não foi possível localizar este produto pelo ID fornecido.</Text>
                </VStack>
            </Box>
        );
    }

    const primeiraImagem = produto.linkImagens?.[0] || produto.imagem;
    const estoqueDisponivel = produto.quantidadeEstoque ?? 0;

    const quantidadeNoCarrinho = cartItems.reduce((total: number, item: CartItem) => {
        if (Number(item?.product?.id) === Number(produto.id)) return total + (item.quantity || 1);
        return total;
    }, 0);

    const estoqueRestante = estoqueDisponivel - quantidadeNoCarrinho;
    const esgotado = estoqueDisponivel < 1 || estoqueRestante < 1;
    const limiteAtingido = quantidade > estoqueRestante || estoqueRestante < 1;

    const handleIncrement = () => { if (quantidade < estoqueRestante) setQuantidade(q => q + 1); };
    const handleDecrement = () => { if (quantidade > 1) setQuantidade(q => q - 1); };

    const handleAddToCart = () => {
        if (esgotado || limiteAtingido || isNavigating) return;
        setIsNavigating(true);
        for (let i = 0; i < quantidade; i++) addItem(produto);
        router.push("/customer/checkout");
    };

    return (
        <Box minH="100vh" bg="gray.50">
            <HeaderCarrinho />
            <Box maxW="7xl" mx="auto" py={8} px={4}>
                <VStack gap={6} align="start" w="full">
                    <Heading as="h1" size="xl" color="gray.800">{produto.titulo}</Heading>
                    <Heading as="h1" size="xl" color="fg">
                        {produto.titulo}
                    </Heading>

                    <Box mt={4} p={6} borderWidth="1px" borderColor="border" borderRadius="lg" bg="bg" w="full" boxShadow="sm">
                        {primeiraImagem && (
                            <Box mb={6} borderRadius="md" overflow="hidden" maxW="md" bg="gray.100">
                                <Image src={primeiraImagem} alt={produto.titulo} objectFit="cover" w="full" h="300px" />
                            </Box>
                        )}
                        <Text fontSize="2xl" fontWeight="bold" color="green.600" mb={2}>
                            R$ {Number(produto.preco).toFixed(2)}
                        </Text>
                        <Text fontSize="sm" color={esgotado ? "red.500" : "gray.600"} mb={1}>
                            {esgotado ? "Esgotado" : `Estoque: ${estoqueDisponivel}`}
                        </Text>
                        <Text color="gray.700" mb={6} mt={3}>{produto.descricao}</Text>

                        {/* Botões do Carrinho aqui (ocultados para concisão, idênticos ao código anterior) */}
                        <HStack gap={4} mb={6} align="center">
                            <Button size="sm" onClick={handleDecrement} disabled={quantidade <= 1}>-</Button>
                            <Text px={2} fontWeight="bold">{quantidade}</Text>
                            <Button size="sm" onClick={handleIncrement} disabled={limiteAtingido}>+</Button>
                        </HStack>
                        <Button size="lg" colorPalette="blue" onClick={handleAddToCart} disabled={esgotado || limiteAtingido}>
                            Adicionar ao Carrinho
                        </Button>

                        <Box pt={6} mt={8} borderTop="1px solid" borderColor="gray.200" w="full">
                            {artesao && (
                                <Box bg="gray.50" p={4} borderRadius="md" borderWidth="1px" borderColor="gray.200" w="full">
                                    <Flex justify="space-between" align="start" wrap="wrap">
                                        <Box>
                                            <Text fontSize="sm" fontWeight="bold" color="gray.500" textTransform="uppercase">Criado por</Text>
                                            <Heading as="h3" size="md" color="gray.800" mb={1}>{artesao.nome}</Heading>
                                            <Text fontSize="sm" color="gray.600" mb={2}>Região: {artesao.regiaoProducao}</Text>
                                        </Box>
                                        <HStack bg="white" p={2} borderRadius="md" borderWidth="1px">
                                            <FiStar fill="#b8ad2a" color="#b8ad2a" />
                                            <Text fontWeight="bold">
                                                {artesao.notaMedia ? artesao.notaMedia.toFixed(1) : "N/A"}
                                            </Text>
                                            <Text fontSize="xs" color="gray.500">
                                                ({artesao.totalAvaliacoes || 0} reviews)
                                            </Text>
                                        </HStack>
                                    </Flex>
                            <Box mb={6} borderRadius="md" overflow="hidden" maxW="md" bg="bg.subtle">
                                <Image
                                    src={primeiraImagem}
                                    alt={produto.titulo}
                                    objectFit="cover"
                                    w="full"
                                    h="300px"
                                />
                            </Box>
                        )}

                        <Text fontSize="2xl" fontWeight="bold" color="brand.700" mb={2}>
                            R$ {Number(produto.preco).toFixed(2)}
                        </Text>

                        <Text fontSize="sm" color={esgotado ? "red.500" : "fg.muted"} mb={1}>
                            {esgotado ? "Produto Esgotado" : `Estoque total: ${estoqueDisponivel}`}
                        </Text>

                        <Text color="fg.muted" mb={6} mt={3}>
                            {produto.descricao}
                        </Text>

                        {!esgotado && quantidadeNoCarrinho > 0 && !isNavigating && (
                            <Text fontSize="sm" color="orange.500" mb={4} fontWeight="medium">
                                Você já tem esse item no seu carrinho. (Total {quantidadeNoCarrinho})
                            </Text>
                        )}

                        {!esgotado && estoqueRestante > 0 && (
                            <HStack gap={4} mb={6} align="center">
                                <Text fontWeight="medium" color="fg">Quantidade:</Text>
                                <HStack>
                                    <Button
                                        size="sm"
                                        colorPalette="brand"
                                        variant="outline"
                                        onClick={handleDecrement}
                                        disabled={quantidade <= 1 || isNavigating}
                                    >
                                        -
                                    </Button>
                                    <Text px={2} fontWeight="bold" color="fg">{quantidade}</Text>
                                    <Button
                                        size="sm"
                                        colorPalette="brand"
                                        variant="outline"
                                        onClick={handleIncrement}
                                        disabled={quantidade >= estoqueRestante || isNavigating}
                                    >
                                        +
                                    </Button>
                                </HStack>
                            </HStack>
                        )}

                        <Button
                            size="lg"
                            colorPalette="brand"
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

                        <Box pt={6} borderTop="1px solid" borderColor="border" w="full">
                            {artesao ? (
                                <Box bg="bg.subtle" p={4} borderRadius="md" borderWidth="1px" borderColor="border" w="full">
                                    <Text fontSize="sm" fontWeight="bold" color="fg.muted" textTransform="uppercase" mb={1}>
                                        Criado por
                                    </Text>
                                    <Heading as="h3" size="md" color="fg" mb={2}>
                                        {artesao.nome}
                                    </Heading>
                                    <Text fontSize="sm" color="fg.muted" mb={4}>
                                        Região de Produção: {artesao.regiaoProducao}
                                    </Text>
                                    <NextLink href={`/artesao/${encodeURIComponent(artesao.nome.toLowerCase().replace(/\s+/g, '-'))}`}>
                                        <Button size="sm" variant="outline" colorPalette="brand">
                                            Ver Perfil do Artesão
                                        </Button>
                                    </NextLink>
                                </Box>
                            )}
                        </Box>

                        {/* Bloco de Avaliações */}
                        <Box pt={8} mt={4} w="full">
                            <Heading size="md" mb={4}>Últimas Avaliações da Peça</Heading>
                            {avaliacoes.length === 0 ? (
                                <Text color="gray.500" fontSize="sm">Ainda não há avaliações para este produto.</Text>
                            ) : (
                                <VStack align="stretch" gap={4}>
                                    {avaliacoes.map((av) => (
                                        <Box key={av.id} p={4} bg="gray.50" borderRadius="md" borderWidth="1px">
                                            <Flex justify="space-between" mb={2}>
                                                <Text fontWeight="bold" fontSize="sm" color="gray.800">{av.nomeComprador}</Text>
                                                <HStack gap={1}>
                                                    <Text fontWeight="bold" color="brand.600">{av.nota}</Text>
                                                    <FiStar fill="#b8ad2a" color="#b8ad2a" size={14} />
                                                </HStack>
                                            </Flex>
                                            <Text color="gray.700" fontSize="sm">{av.comentario}</Text>
                                            <Text mt={2} fontSize="xs" color="gray.400">
                                                Publicado em: {new Date(av.data).toLocaleDateString('pt-BR')}
                                            </Text>
                                        </Box>
                                    ))}
                                </VStack>
                                <Text fontSize="sm" color="fg.muted">Informações do artesão não disponíveis.</Text>
                            )}
                        </Box>

                    </Box>
                </VStack>
            </Box>
        </Box>
    );
}
