'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { sessionStore } from '@/store/sessionStore';
import { apiService } from '@/services/apiService';
import { Order } from '@/types/order';
import {
    Box, Button, Container, Flex, Heading, HStack, Text, VStack,
    SimpleGrid, Card, Spinner, Icon
} from '@chakra-ui/react';
import { FiLogOut, FiDollarSign, FiShoppingBag, FiTruck, FiPackage } from 'react-icons/fi';

export default function AdminPage() {
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    const logoutAdmin = sessionStore((state) => state.logoutAdmin);
    const isAdminLogged = sessionStore((state) => state.isAdminLogged);
    const admin = sessionStore((state) => state.admin);

    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (mounted && !isAdminLogged()) {
            router.push('/admin/login');
            return;
        }

        if (mounted && isAdminLogged()) {
            // Busca todas as compras registradas na plataforma
            apiService.get<Order[]>('/orders')
                .then((res) => {
                    setOrders(res.data);
                })
                .catch((err) => {
                    console.error("Erro ao buscar estatísticas", err);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [mounted, isAdminLogged, router]);

    if (!mounted || !isAdminLogged()) return null;

    const handleLogout = () => {
        logoutAdmin();
        router.push('/');
    };

    // Cálculos das estatísticas globais
    const totalArrecadado = orders.reduce((acc, order) => acc + (order.precoUnitario * order.quantidade), 0);
    const itensVendidos = orders.reduce((acc, order) => acc + order.quantidade, 0);
    const totalPedidos = orders.length;
    const aguardandoEnvio = orders.filter(o => o.situacaoEntrega === 'aguardadoEnvio').length;

    return (
        <Box minH="100vh" bg="gray.50" py={8}>
            <Container maxW="1200px">
                {/* Header do Admin */}
                <Box bg="white" p={6} borderRadius="xl" shadow="sm" borderWidth="1px" borderColor="gray.200" mb={8}>
                    <Flex justify="space-between" align="center">
                        <VStack align="start" gap={1}>
                            <Heading size="lg" color="brand.500">
                                Dashboard Administrativo
                            </Heading>
                            <Text color="gray.600" fontSize="sm">
                                Bem-vindo, <b>{admin?.nome}</b>
                            </Text>
                        </VStack>

                        <Button variant="outline" colorPalette="red" size="md" onClick={handleLogout}>
                            <HStack gap={2}>
                                <FiLogOut />
                                <Text>Sair (Logout)</Text>
                            </HStack>
                        </Button>
                    </Flex>
                </Box>

                {/* Área de Estatísticas */}
                <VStack align="stretch" gap={6}>
                    <Heading size="md" color="gray.800">Visão Geral da Plataforma</Heading>

                    {isLoading ? (
                        <Flex justify="center" py={10}>
                            <Spinner size="xl" color="brand.500" />
                        </Flex>
                    ) : (
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
                            {/* Card de Faturamento */}
                            <Card.Root p={5} borderWidth="1px" borderRadius="lg" bg="white" shadow="sm">
                                <HStack gap={4}>
                                    <Box p={3} bg="green.50" color="green.600" borderRadius="md">
                                        <Icon as={FiDollarSign} boxSize={6} />
                                    </Box>
                                    <VStack align="start" gap={0}>
                                        <Text color="gray.500" fontSize="sm" fontWeight="medium">Volume Financeiro</Text>
                                        <Text fontWeight="bold" fontSize="xl" color="gray.800">
                                            R$ {totalArrecadado.toFixed(2)}
                                        </Text>
                                    </VStack>
                                </HStack>
                            </Card.Root>

                            {/* Card de Pedidos */}
                            <Card.Root p={5} borderWidth="1px" borderRadius="lg" bg="white" shadow="sm">
                                <HStack gap={4}>
                                    <Box p={3} bg="brand.50" color="brand.600" borderRadius="md">
                                        <Icon as={FiShoppingBag} boxSize={6} />
                                    </Box>
                                    <VStack align="start" gap={0}>
                                        <Text color="gray.500" fontSize="sm" fontWeight="medium">Total de Pedidos</Text>
                                        <Text fontWeight="bold" fontSize="xl" color="gray.800">
                                            {totalPedidos}
                                        </Text>
                                    </VStack>
                                </HStack>
                            </Card.Root>

                            {/* Card de Itens Vendidos */}
                            <Card.Root p={5} borderWidth="1px" borderRadius="lg" bg="white" shadow="sm">
                                <HStack gap={4}>
                                    <Box p={3} bg="blue.50" color="blue.600" borderRadius="md">
                                        <Icon as={FiPackage} boxSize={6} />
                                    </Box>
                                    <VStack align="start" gap={0}>
                                        <Text color="gray.500" fontSize="sm" fontWeight="medium">Peças Vendidas</Text>
                                        <Text fontWeight="bold" fontSize="xl" color="gray.800">
                                            {itensVendidos} un.
                                        </Text>
                                    </VStack>
                                </HStack>
                            </Card.Root>

                            {/* Card de Entregas Pendentes */}
                            <Card.Root p={5} borderWidth="1px" borderRadius="lg" bg="white" shadow="sm">
                                <HStack gap={4}>
                                    <Box p={3} bg="orange.50" color="orange.600" borderRadius="md">
                                        <Icon as={FiTruck} boxSize={6} />
                                    </Box>
                                    <VStack align="start" gap={0}>
                                        <Text color="gray.500" fontSize="sm" fontWeight="medium">Aguardando Envio</Text>
                                        <Text fontWeight="bold" fontSize="xl" color="gray.800">
                                            {aguardandoEnvio}
                                        </Text>
                                    </VStack>
                                </HStack>
                            </Card.Root>
                        </SimpleGrid>
                    )}
                </VStack>
            </Container>
        </Box>
    );
}
