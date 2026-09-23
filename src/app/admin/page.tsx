'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { sessionStore } from '@/store/sessionStore';
import { apiService } from '@/services/apiService';
import { Order } from '@/types/order';
import {
    Box, Button, Container, Flex, Heading, HStack, Text, VStack,
    SimpleGrid, Card, Spinner, Icon, Badge, Progress, Table
} from '@chakra-ui/react';
import { FiLogOut, FiDollarSign, FiShoppingBag, FiTruck, FiPackage } from 'react-icons/fi';

interface Product {
    id: string;
    regiaoProducao: string;
}

export default function AdminPage() {
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    const logoutAdmin = sessionStore((state) => state.logoutAdmin);
    const isAdminLogged = sessionStore((state) => state.isAdminLogged);
    const admin = sessionStore((state) => state.admin);

    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (mounted && !isAdminLogged()) {
            router.push('/admin/login');
            return;
        }

        if (mounted && isAdminLogged()) {
            Promise.all([
                apiService.get<Order[]>('/orders'),
                apiService.get<Product[]>('/products')
            ])
                .then(([ordersRes, productsRes]) => {
                    setOrders(ordersRes.data);
                    setProducts(productsRes.data);
                })
                .catch((err) => {
                    console.error("Erro ao buscar dados do painel", err);
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
    const totalArrecadado = orders.reduce((acc, order) => acc + (order.precoUnitario * (order.quantidade || 1)), 0);
    const itensVendidos = orders.reduce((acc, order) => acc + (order.quantidade || 1), 0);
    const totalPedidos = orders.length;
    const aguardandoEnvio = orders.filter(o => o.situacaoEntrega === 'aguardadoEnvio').length;
    const ticketMedio = totalPedidos > 0 ? totalArrecadado / totalPedidos : 0;

    // Agrupamento Dinâmico de Faturamento por Polo de Produção com base nos Pedidos e Produtos
    const poloMap: { [key: string]: number } = {};

    orders.forEach((order) => {
        // Encontra o produto correspondente ao pedido para descobrir a região de produção
        const produto = products.find(p => p.id === order.idProduto);
        const regiao = produto?.regiaoProducao || "Outras Regiões";
        const valorTotalItem = order.precoUnitario * (order.quantidade || 1);

        if (poloMap[regiao]) {
            poloMap[regiao] += valorTotalItem;
        } else {
            poloMap[regiao] = valorTotalItem;
        }
    });

    // Transforma o objeto em array ordenado e calcula o percentual relativo ao maior polo
    const maxPoloValor = Math.max(...Object.values(poloMap), 1);
    const polosDinamicos = Object.keys(poloMap).map((nomePolo) => {
        const valorTotal = poloMap[nomePolo];
        const percentual = Math.round((valorTotal / maxPoloValor) * 100);
        return {
            nome: nomePolo,
            percentual: percentual > 0 ? percentual : 10,
            valor: `R$ ${valorTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
        };
    }).sort((a, b) => b.percentual - a.percentual);

    return (
        <Box bg="#FAF8F5" minH="100vh" py={8} px={{ base: 4, md: 8 }}>
            <Container maxW="1200px">
                {/* Header do Admin */}
                <Box bg="white" p={6} borderRadius="xl" shadow="sm" borderWidth="1px" borderColor="gray.200" mb={8}>
                    <Flex
                        direction={{ base: "column", md: "row" }}
                        justify="space-between"
                        align={{ base: "flex-start", md: "center" }}
                        gap={4}
                    >
                        <VStack align="start" gap={1}>
                            <HStack gap={3}>
                                <Heading size="lg" color="#2D2424">
                                    Painel Geral da Plataforma
                                </Heading>
                                <Badge colorPalette="orange" variant="subtle" px={2} py={1} borderRadius="md">
                                    Administrador
                                </Badge>
                            </HStack>
                            <Text color="gray.600" fontSize="sm">
                                Bem-vindo, <b>{admin?.nome}</b>. Monitoramento de indicadores culturais, faturamento e logística do ecossistema de Pernambuco.
                            </Text>
                        </VStack>

                        <HStack gap={4}>
                            <Badge bg="#E2DCD5" color="#4A3E3D" px={4} py={2} borderRadius="full" fontSize="xs">
                                Período Consolidado
                            </Badge>
                            <Button variant="outline" colorPalette="red" size="sm" onClick={handleLogout}>
                                <HStack gap={2}>
                                    <FiLogOut />
                                    <Text>Sair</Text>
                                </HStack>
                            </Button>
                        </HStack>
                    </Flex>
                </Box>

                {/* Área de Estatísticas / KPIs */}
                <VStack align="stretch" gap={6}>
                    <Heading size="md" color="#2D2424">Visão Geral da Plataforma</Heading>

                    {isLoading ? (
                        <Flex justify="center" py={10}>
                            <Spinner size="xl" color="#C85A32" />
                        </Flex>
                    ) : (
                        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={6}>
                            {/* Card de Faturamento */}
                            <Card.Root p={5} borderWidth="1px" borderColor="gray.200" borderRadius="lg" bg="white" shadow="sm" borderLeft="4px solid #C85A32">
                                <HStack gap={4}>
                                    <Box p={3} bg="green.50" color="green.600" borderRadius="md">
                                        <Icon as={FiDollarSign} boxSize={6} />
                                    </Box>
                                    <VStack align="start" gap={0}>
                                        <Text color="gray.500" fontSize="sm" fontWeight="medium">Faturamento Bruto (GMV)</Text>
                                        <Text fontWeight="bold" fontSize="xl" color="#C85A32">
                                            R$ {totalArrecadado.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                        </Text>
                                    </VStack>
                                </HStack>
                            </Card.Root>

                            {/* Card de Pedidos */}
                            <Card.Root p={5} borderWidth="1px" borderColor="gray.200" borderRadius="lg" bg="white" shadow="sm" borderLeft="4px solid #4A5568">
                                <HStack gap={4}>
                                    <Box p={3} bg="brand.50" color="#C85A32" borderRadius="md">
                                        <Icon as={FiShoppingBag} boxSize={6} />
                                    </Box>
                                    <VStack align="start" gap={0}>
                                        <Text color="gray.500" fontSize="sm" fontWeight="medium">Volume de Pedidos</Text>
                                        <Text fontWeight="bold" fontSize="xl" color="#2D2424">
                                            {totalPedidos} pedidos
                                        </Text>
                                        <Text fontSize="2xs" color="gray.500">Ticket Médio: R$ {ticketMedio.toFixed(2)}</Text>
                                    </VStack>
                                </HStack>
                            </Card.Root>

                            {/* Card de Peças Vendidas */}
                            <Card.Root p={5} borderWidth="1px" borderColor="gray.200" borderRadius="lg" bg="white" shadow="sm" borderLeft="4px solid #319795">
                                <HStack gap={4}>
                                    <Box p={3} bg="blue.50" color="blue.600" borderRadius="md">
                                        <Icon as={FiPackage} boxSize={6} />
                                    </Box>
                                    <VStack align="start" gap={0}>
                                        <Text color="gray.500" fontSize="sm" fontWeight="medium">Peças Vendidas</Text>
                                        <Text fontWeight="bold" fontSize="xl" color="#319795">
                                            {itensVendidos} un.
                                        </Text>
                                    </VStack>
                                </HStack>
                            </Card.Root>

                            {/* Card de Entregas Pendentes */}
                            <Card.Root p={5} borderWidth="1px" borderColor="gray.200" borderRadius="lg" bg="white" shadow="sm" borderLeft="4px solid #D69E2E">
                                <HStack gap={4}>
                                    <Box p={3} bg="orange.50" color="orange.600" borderRadius="md">
                                        <Icon as={FiTruck} boxSize={6} />
                                    </Box>
                                    <VStack align="start" gap={0}>
                                        <Text color="gray.500" fontSize="sm" fontWeight="medium">Aguardando Envio</Text>
                                        <Text fontWeight="bold" fontSize="xl" color="#B7791F">
                                            {aguardandoEnvio}
                                        </Text>
                                    </VStack>
                                </HStack>
                            </Card.Root>
                        </SimpleGrid>
                    )}
                </VStack>

                {/* Faturamento por Polo Regional (Dinâmico via Região de Produção) */}
                <Box my={8}>
                    <Card.Root bg="white" boxShadow="sm" borderRadius="lg" borderWidth="1px" borderColor="gray.200" p={5}>
                        <Card.Header px={0} pt={0} pb={3}>
                            <Heading size="md" color="#2D2424">
                                Faturamento por Polo de Produção (Dinâmico)
                            </Heading>
                            <Text fontSize="sm" color="gray.500">
                                Distribuição da receita gerada baseada na região de produção dos produtos comercializados.
                            </Text>
                        </Card.Header>
                        <Card.Body px={0} py={0}>
                            {polosDinamicos.length === 0 ? (
                                <Text color="gray.500" textAlign="center" py={4}>Nenhum dado de polo disponível no momento.</Text>
                            ) : (
                                <VStack gap={4} align="stretch" mt={2}>
                                    {polosDinamicos.map((polo) => (
                                        <Box key={polo.nome}>
                                            <Flex justify="space-between" mb={1} fontSize="sm">
                                                <Text color="gray.700" fontWeight="medium">{polo.nome}</Text>
                                                <Text fontWeight="semibold" color="#C85A32">{polo.valor}</Text>
                                            </Flex>
                                            <Progress.Root value={polo.percentual} size="sm" borderRadius="full">
                                                <Progress.Track bg="gray.100">
                                                    <Progress.Range bg="#C85A32" />
                                                </Progress.Track>
                                            </Progress.Root>
                                        </Box>
                                    ))}
                                </VStack>
                            )}
                        </Card.Body>
                    </Card.Root>
                </Box>

                {/* Tabela de Monitoramento Logístico */}
                <Card.Root bg="white" boxShadow="sm" borderRadius="lg" borderWidth="1px" borderColor="gray.200">
                    <Card.Header pb={2}>
                        <Heading size="md" color="#2D2424">
                            Acompanhamento Logístico de Pedidos Recentes
                        </Heading>
                        <Text fontSize="sm" color="gray.500">
                            Últimas transações com verificação de emissão de código de rastreamento.
                        </Text>
                    </Card.Header>
                    <Card.Body pt={4} overflowX="auto">
                        {orders.length === 0 ? (
                            <Text color="gray.500" textAlign="center" py={6}>Nenhum pedido registrado no sistema ainda.</Text>
                        ) : (
                            <Table.Root size="sm" variant="line">
                                <Table.Header bg="gray.50">
                                    <Table.Row>
                                        <Table.ColumnHeader>ID Pedido</Table.ColumnHeader>
                                        <Table.ColumnHeader>Comprador</Table.ColumnHeader>
                                        <Table.ColumnHeader>Obra / Peça</Table.ColumnHeader>
                                        <Table.ColumnHeader textAlign="right">Valor</Table.ColumnHeader>
                                        <Table.ColumnHeader textAlign="center">Situação</Table.ColumnHeader>
                                        <Table.ColumnHeader>Código de Postagem</Table.ColumnHeader>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {orders.slice(0, 6).map((pedido) => (
                                        <Table.Row key={pedido.id}>
                                            <Table.Cell fontWeight="medium" color="gray.600">{pedido.id}</Table.Cell>
                                            <Table.Cell>{pedido.nomeComprador || 'Comprador'}</Table.Cell>
                                            <Table.Cell maxW="280px" truncate>{pedido.tituloProduto}</Table.Cell>
                                            <Table.Cell textAlign="right" fontWeight="bold" color="#C85A32">
                                                R$ {(pedido.precoUnitario * (pedido.quantidade || 1)).toFixed(2)}
                                            </Table.Cell>
                                            <Table.Cell textAlign="center">
                                                <Badge
                                                    colorPalette={
                                                        pedido.situacaoEntrega === "Entregue"
                                                            ? "green"
                                                            : pedido.situacaoEntrega === "Enviado"
                                                            ? "blue"
                                                            : "orange"
                                                    }
                                                    borderRadius="md"
                                                    px={2}
                                                >
                                                    {pedido.situacaoEntrega || 'Aguardando'}
                                                </Badge>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {pedido.codigoPostagem ? (
                                                    <Text fontFamily="mono" fontSize="xs">{pedido.codigoPostagem}</Text>
                                                ) : (
                                                    <Badge colorPalette="red" variant="subtle">Pendente</Badge>
                                                )}
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Root>
                        )}
                    </Card.Body>
                </Card.Root>
            </Container>
        </Box>
    );
}