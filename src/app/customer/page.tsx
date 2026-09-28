'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { sessionStore } from '@/store/sessionStore';
import { productService } from '@/services/productService';
import { orderService } from '@/services/orderService';
import { recommendationService } from '@/services/recommendationService';
import { Product } from '@/types/product';
import { useCartStore } from '@/store/cartStore';
import {
    Box,
    Button,
    Container,
    Flex,
    Heading,
    Text,
    VStack,
    SimpleGrid,
    Card,
    Image,
    Spinner
} from '@chakra-ui/react';

export default function CustomerDashboard() {
    const [mounted, setMounted] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const [recomendados, setRecomendados] = useState<Product[]>([]);

    const router = useRouter();

    const isCustomerLogged = sessionStore((state) => state.isCustomerLogged);
    const customer = sessionStore((state) => state.customer);
    const addItem = useCartStore((state) => state.addItem);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (mounted && !isCustomerLogged()) {
            router.push('/customer/login');
        }
    }, [mounted, isCustomerLogged, router]);

    useEffect(() => {
        async function loadProducts() {
            try {
                setIsLoadingProducts(true);
                const data = await productService.getAll();
                setProducts(data);
            } catch (err) {
                console.error("Erro ao carregar produtos da API:", err);
            } finally {
                setIsLoadingProducts(false);
            }
        }

        if (isCustomerLogged()) {
            loadProducts();
        }
    }, [isCustomerLogged]);

    useEffect(() => {
        async function loadRecomendados() {
            if (!customer || products.length === 0) return;
            try {
                const [historico, todasCompras] = await Promise.all([
                    orderService.getComprasPorComprador(customer.id),
                    orderService.getTodasCompras(),
                ]);
                const ids = recommendationService.getRecommendedIds(products, historico, todasCompras);
                setRecomendados(products.filter((p) => ids.includes(String(p.id))));
            } catch (err) {
                console.error("Erro ao carregar recomendações:", err);
            }
        }
        loadRecomendados();
    }, [customer, products]);

    if (!mounted || !isCustomerLogged()) {
        return (
            <Flex minH="80vh" align="center" justify="center">
                <Spinner size="xl" color="brand.500" />
            </Flex>
        );
    }

    const handleCardClick = (productId: string | number) => {
        router.push(`/product/${productId}`);
    };

    return (
        <Box minH="100vh" bg="gray.50" pb={12} pt={6}>
            <Container maxW="1200px">
                {/* Perfil do Cliente */}
                <Box
                    bg="white"
                    p={6}
                    rounded="lg"
                    shadow="sm"
                    mb={8}
                    border="1px solid"
                    borderColor="gray.200"
                >
                    <VStack align="start" gap={2}>
                        <Heading size="lg">Olá, {customer?.nome || 'Comprador(a)'}!</Heading>
                        <Text color="gray.600">E-mail: <b>{customer?.email}</b></Text>
                        <Text color="gray.500" fontSize="sm">
                            Explore e adicione as melhores peças do artesanato pernambucano ao seu carrinho.
                        </Text>
                    </VStack>
                </Box>

                {/* Recomendados para Você */}
                {recomendados.length > 0 && (
                    <Box mb={8}>
                        <Heading size="md" mb={4}>Recomendados para Você</Heading>
                        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gap={4}>
                            {recomendados.map((product) => (
                                <Card.Root
                                    key={product.id}
                                    p={4}
                                    borderWidth="1px"
                                    borderRadius="lg"
                                    bg="white"
                                    cursor="pointer"
                                    _hover={{ shadow: "md", borderColor: "brand.500", transform: "translateY(-2px)" }}
                                    transition="all 0.2s"
                                    onClick={() => handleCardClick(product.id)}
                                >
                                    <Image
                                        src={product.imagem || "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400"}
                                        alt={product.titulo}
                                        borderRadius="md"
                                        h="140px"
                                        objectFit="cover"
                                        mb={2}
                                    />
                                    <Text fontWeight="bold" fontSize="sm" lineClamp={1}>
                                        {product.titulo}
                                    </Text>
                                    <Text color="brand.600" fontWeight="semibold" fontSize="sm">
                                        R$ {Number(product.preco || 0).toFixed(2)}
                                    </Text>
                                </Card.Root>
                            ))}
                        </SimpleGrid>
                    </Box>
                )}

                {/* Listagem de Produtos */}
                {isLoadingProducts ? (
                    <Flex justify="center" py={10}>
                        <Spinner size="lg" color="brand.500" />
                    </Flex>
                ) : (
                    <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={6}>
                        {products.map((product) => (
                            <Card.Root
                                key={product.id || product.titulo}
                                p={4}
                                borderWidth="1px"
                                borderRadius="lg"
                                bg="white"
                                _hover={{ shadow: "md", borderColor: "brand.500", transform: "translateY(-2px)" }}
                                transition="all 0.2s"
                            >
                                <Box cursor="pointer" onClick={() => handleCardClick(product.id)}>
                                    <Image
                                        src={
                                            product.imagem ||
                                            "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400"
                                        }
                                        alt={product.titulo}
                                        borderRadius="md"
                                        h="180px"
                                        objectFit="cover"
                                        mb={3}
                                    />
                                    <Text fontWeight="bold" fontSize="md">
                                        {product.titulo}
                                    </Text>
                                    <Text color="brand.600" fontWeight="semibold" mt={1} mb={4}>
                                        R$ {Number(product.preco || 0).toFixed(2)}
                                    </Text>
                                </Box>

                                <Button
                                    size="sm"
                                    colorPalette="brand"
                                    w="full"
                                    onClick={() => addItem(product)}
                                >
                                    Adicionar ao Carrinho
                                </Button>
                            </Card.Root>
                        ))}
                    </SimpleGrid>
                )}
            </Container>
        </Box>
    );
}