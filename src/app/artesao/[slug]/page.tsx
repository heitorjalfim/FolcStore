"use client";

import { useEffect, useState, use } from "react";
import { Box, Heading, Text, VStack, HStack, Flex, Container } from "@chakra-ui/react";
import { userService } from "@/services/userService";
import { productService } from "@/services/productService";
import { useCartStore } from "@/store/cartStore";
import { Artesao, Product } from "@/types";
import { HeaderCarrinho } from "@/app/components/HeaderCarrinho";
import { ProductList } from "@/app/components/ProductList";
import { CategoryFilter } from "@/app/components/CategoryFilter";
import { FiStar } from "react-icons/fi";

type PageProps = { params: Promise<{ slug: string }> };

// Mesma transformação usada ao gerar o link "Ver Perfil do Artesão"
// na página de produto: nome em minúsculas com espaços trocados por hífen.
function slugFromNome(nome: string) {
    return nome.toLowerCase().replace(/\s+/g, "-");
}

export default function PerfilArtesaoPage({ params }: PageProps) {
    const resolvedParams = use(params);
    const slug = decodeURIComponent(resolvedParams.slug);

    const [artesao, setArtesao] = useState<Artesao | null>(null);
    const [produtos, setProdutos] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const addItem = useCartStore((state) => state.addItem);

    useEffect(() => {
        async function fetchDados() {
            setLoading(true);
            setError(null);
            try {
                const todosArtesaos = await userService.getAllArtesaos();
                const artesaoEncontrado = todosArtesaos.find(
                    (a) => slugFromNome(a.nome) === slug
                );

                if (!artesaoEncontrado) {
                    throw new Error(`Artesão não encontrado para o slug: ${slug}`);
                }

                setArtesao(artesaoEncontrado);

                const produtosDoArtesao = await productService.getByArtesao(artesaoEncontrado.id);
                setProdutos(produtosDoArtesao);
            } catch (err) {
                console.error("Erro ao carregar perfil do artesão:", err);
                const mensagem = err instanceof Error ? err.message : "Erro desconhecido";
                setError(mensagem);
            } finally {
                setLoading(false);
            }
        }

        fetchDados();
    }, [slug]);

    function handleAddToCart(product: Product) {
        addItem(product);
    }

    const categories = Array.from(new Set(produtos.map((p) => p.categoria))).sort();

    const produtosFiltrados = selectedCategory
        ? produtos.filter((p) => p.categoria === selectedCategory)
        : produtos;

    if (loading) {
        return (
            <Box minH="100vh" bg="bg.subtle">
                <HeaderCarrinho />
                <Container maxW="1200px" py={8}>
                    <Text color="fg.muted">Carregando perfil do artesão...</Text>
                </Container>
            </Box>
        );
    }

    if (error || !artesao) {
        return (
            <Box minH="100vh" bg="bg.subtle">
                <HeaderCarrinho />
                <Container maxW="1200px" py={8}>
                    <VStack gap={4} align="start">
                        <Heading as="h1" size="lg" color="red.500">
                            Artesão não encontrado
                        </Heading>
                        <Text color="fg.muted">
                            {error || "Não foi possível localizar este artesão."}
                        </Text>
                    </VStack>
                </Container>
            </Box>
        );
    }

    return (
        <Box minH="100vh" bg="bg.subtle" pb={12}>
            <HeaderCarrinho />

            {/* Banner com dados do artesão */}
            <Box bg="brand.700" color="white" py={10} px={4}>
                <Container maxW="1200px">
                    <Flex justify="space-between" align={{ base: "start", md: "center" }} wrap="wrap" gap={4}>
                        <Box>
                            <Text fontSize="sm" textTransform="uppercase" opacity={0.85} mb={1}>
                                Perfil do Artesão
                            </Text>
                            <Heading as="h1" size="xl">
                                {artesao.nome}
                            </Heading>
                            <Text mt={2} opacity={0.9}>
                                Região de Produção: {artesao.regiaoProducao}
                            </Text>
                            {artesao.biografia && (
                                <Text mt={4} maxW="640px" opacity={0.95} lineClamp={3}>
                                    {artesao.biografia}
                                </Text>
                            )}
                        </Box>

                        <HStack bg="white" color="fg" p={3} borderRadius="md" boxShadow="sm">
                            <FiStar fill="var(--chakra-colors-brand-500)" color="var(--chakra-colors-brand-500)" />
                            <Text fontWeight="bold">
                                {artesao.notaMedia ? artesao.notaMedia.toFixed(1) : "N/A"}
                            </Text>
                            <Text fontSize="sm" color="fg.muted">
                                ({artesao.totalAvaliacoes || 0} reviews)
                            </Text>
                        </HStack>
                    </Flex>
                </Container>
            </Box>

            {/* Vitrine de produtos do artesão */}
            <Container maxW="1200px" py={8}>
                <VStack align="stretch" gap={6}>
                    <Heading size="lg" color="fg">
                        Produtos de {artesao.nome}
                    </Heading>

                    <CategoryFilter
                        categories={categories}
                        selected={selectedCategory}
                        onSelect={setSelectedCategory}
                    />

                    <ProductList
                        products={produtosFiltrados}
                        isLoading={false}
                        error={null}
                        onAddToCart={handleAddToCart}
                    />
                </VStack>
            </Container>
        </Box>
    );
}