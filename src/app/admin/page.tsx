'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { sessionStore } from '@/store/sessionStore';
import { apiService } from '@/services/apiService';
import { Order } from '@/types/order';
import { Artesao } from '@/types';
import {
    Box, Button, Container, Flex, Heading, HStack, Text, VStack,
    SimpleGrid, Card, Spinner, Icon, Table, Badge, Input, Field
} from '@chakra-ui/react';
import { FiLogOut, FiDollarSign, FiShoppingBag, FiTruck, FiPackage } from 'react-icons/fi';

export default function AdminPage() {
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    const logoutAdmin = sessionStore((state) => state.logoutAdmin);
    const isAdminLogged = sessionStore((state) => state.isAdminLogged);
    const admin = sessionStore((state) => state.admin);

    const [orders, setOrders] = useState<Order[]>([]);
    const [artesaosMap, setArtesaosMap] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);

    // Estados para os filtros
    const [filterComprador, setFilterComprador] = useState('');
    const [filterVendedor, setFilterVendedor] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (mounted && !isAdminLogged()) {
            router.push('/admin/login');
            return;
        }

        if (mounted && isAdminLogged()) {
            // Busca pedidos e artesãos simultaneamente para mapear os nomes
            Promise.all([
                apiService.get<Order[]>('/orders'),
                apiService.get<Artesao[]>('/artesaos')
            ])
                .then(([resOrders, resArtesaos]) => {
                    // Ordena por data decrescente (mais recentes primeiro)
                    const sortedOrders = resOrders.data.sort((a, b) => 
                        new Date(b.dataCompra).getTime() - new Date(a.dataCompra).getTime()
                    );
                    setOrders(sortedOrders);

                    // Cria um dicionário (map) de ID -> Nome do Artesão
                    const map: Record<string, string> = {};
                    resArtesaos.data.forEach(artesao => {
                        map[artesao.id] = artesao.nome;
                    });
                    setArtesaosMap(map);
                })
                .catch((err) => {
                    console.error("Erro ao buscar dados do dashboard", err);
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

    // Cálculos das estatísticas globais (independentes dos filtros)
    const totalArrecadado = orders.reduce((acc, order) => acc + (order.precoUnitario * order.quantidade), 0);
    const itensVendidos = orders.reduce((acc, order) => acc + order.quantidade, 0);
    const totalPedidos = orders.length;
    const aguardandoEnvio = orders.filter(o => o.situacaoEntrega === 'aguardadoEnvio').length;

    // Aplicação dos filtros na listagem
    const filteredOrders = orders.filter(order => {
        const nomeVendedor = artesaosMap[order.idArtesao] || order.idArtesao;
        
        const matchComprador = (order.nomeComprador || order.idComprador).toLowerCase().includes(filterComprador.toLowerCase());
        const matchVendedor = nomeVendedor.toLowerCase().includes(filterVendedor.toLowerCase());
        const matchStatus = filterStatus ? order.situacaoEntrega === filterStatus : true;
        
        return matchComprador && matchVendedor && matchStatus;
    });

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

                <VStack align="stretch" gap={8}>
                    {/* Área de Estatísticas */}
                    <Box>
                        <Heading size="md" color="gray.800" mb={6}>Visão Geral da Plataforma</Heading>

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
                    </Box>

                    {/* Área de Listagem e Filtros */}
                    {!isLoading && (
                        <Box bg="white" p={6} borderRadius="xl" shadow="sm" borderWidth="1px" borderColor="gray.200">
                            <Heading size="md" color="gray.800" mb={6}>Histórico Completo de Vendas</Heading>

                            <Flex gap={4} mb={6} flexWrap="wrap" align="flex-end">
                                <Field.Root maxW="250px">
                                    <Field.Label>Comprador</Field.Label>
                                    <Input 
                                        placeholder="Nome do cliente..." 
                                        value={filterComprador} 
                                        onChange={(e) => setFilterComprador(e.target.value)} 
                                        bg="white"
                                    />
                                </Field.Root>

                                <Field.Root maxW="250px">
                                    <Field.Label>Vendedor</Field.Label>
                                    <Input 
                                        placeholder="Ex: Maria da Silva" 
                                        value={filterVendedor} 
                                        onChange={(e) => setFilterVendedor(e.target.value)} 
                                        bg="white"
                                    />
                                </Field.Root>

                                <Field.Root maxW="200px">
                                    <Field.Label>Situação do Envio</Field.Label>
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            borderRadius: '6px',
                                            border: '1px solid #E2E8F0',
                                            backgroundColor: 'white',
                                            fontSize: '14px',
                                        }}
                                    >
                                        <option value="">Todos</option>
                                        <option value="aguardadoEnvio">Aguardando Envio</option>
                                        <option value="Enviado">Enviado</option>
                                        <option value="Entregue">Entregue</option>
                                    </select>
                                </Field.Root>
                            </Flex>

                            <Box overflowX="auto">
                                <Table.Root size="sm" variant="line">
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.ColumnHeader>ID do Pedido</Table.ColumnHeader>
                                            <Table.ColumnHeader>Data</Table.ColumnHeader>
                                            <Table.ColumnHeader>Comprador</Table.ColumnHeader>
                                            <Table.ColumnHeader>Vendedor</Table.ColumnHeader>
                                            <Table.ColumnHeader>Produto</Table.ColumnHeader>
                                            <Table.ColumnHeader textAlign="end">Total (R$)</Table.ColumnHeader>
                                            <Table.ColumnHeader textAlign="center">Status</Table.ColumnHeader>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {filteredOrders.length > 0 ? (
                                            filteredOrders.map((order) => (
                                                <Table.Row key={order.id}>
                                                    <Table.Cell>
                                                        <Text fontSize="xs" color="gray.500" maxW="100px" truncate>{order.id}</Text>
                                                    </Table.Cell>
                                                    <Table.Cell>{new Date(order.dataCompra).toLocaleDateString('pt-BR')}</Table.Cell>
                                                    <Table.Cell fontWeight="medium">{order.nomeComprador}</Table.Cell>
                                                    <Table.Cell>
                                                        {artesaosMap[order.idArtesao] || order.idArtesao}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {order.tituloProduto} <Text as="span" color="gray.500">(x{order.quantidade})</Text>
                                                    </Table.Cell>
                                                    <Table.Cell textAlign="end" fontWeight="bold" color="gray.800">
                                                        {(order.precoUnitario * order.quantidade).toFixed(2)}
                                                    </Table.Cell>
                                                    <Table.Cell textAlign="center">
                                                        <Badge 
                                                            colorPalette={
                                                                order.situacaoEntrega === 'Entregue' ? 'green' : 
                                                                order.situacaoEntrega === 'Enviado' ? 'blue' : 
                                                                'orange'
                                                            }
                                                        >
                                                            {order.situacaoEntrega === 'aguardadoEnvio' ? 'Aguardando' : order.situacaoEntrega}
                                                        </Badge>
                                                    </Table.Cell>
                                                </Table.Row>
                                            ))
                                        ) : (
                                            <Table.Row>
                                                <Table.Cell colSpan={7} textAlign="center" py={8}>
                                                    <Text color="gray.500">Nenhum pedido atende aos filtros atuais.</Text>
                                                </Table.Cell>
                                            </Table.Row>
                                        )}
                                    </Table.Body>
                                </Table.Root>
                            </Box>
                        </Box>
                    )}
                </VStack>
            </Container>
        </Box>
    );
}