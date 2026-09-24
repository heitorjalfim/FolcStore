"use client";

import { useEffect, useState, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';
import { sessionStore } from '@/store/sessionStore';
import {
    Box, Button, Container, Flex, Heading, HStack, Text, VStack, Spinner,
    Table, Badge, Dialog, Portal, Input, Field, SimpleGrid, Card, Stat, Avatar
} from '@chakra-ui/react';
import { FiPackage, FiLogOut, FiHome } from 'react-icons/fi';
import { orderService } from '@/services/orderService';
import { apiService } from '@/services/apiService';
import { Order } from '@/types/order';
import { Avaliacao } from '@/types/avaliacao';

const emptySubscribe = () => () => { };

export default function Artesao() {
    const router = useRouter();
    const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

    const logoutArtesao = sessionStore((state) => state.logoutArtesao);
    const isArtesaoLogged = sessionStore((state) => state.isArtesaoLogged);
    const artesao = sessionStore((state) => state.artesao);

    // Estados da Tabela e Compras
    const [compras, setCompras] = useState<Order[]>([]);
    const [isLoadingCompras, setIsLoadingCompras] = useState(true);

    // Estados de Avaliações
    const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
    const [media, setMedia] = useState<string>("0.0");
    const [isLoadingAvaliacoes, setIsLoadingAvaliacoes] = useState(true);

    // Estados do Modal de Envio
    const [modalAberto, setModalAberto] = useState(false);
    const [compraEditando, setCompraEditando] = useState<Order | null>(null);
    const [codigoPostagem, setCodigoPostagem] = useState('');
    const [salvandoEnvio, setSalvandoEnvio] = useState(false);

    useEffect(() => {
        if (!mounted) return;
        if (!artesao) {
            router.push('/artesao/login');
            return;
        }

        async function carregarDadosDoArtesao() {
            if (!artesao) return;

            setIsLoadingCompras(true);
            setIsLoadingAvaliacoes(true);

            try {
                const [pedidos, avaliacoesRes] = await Promise.all([
                    orderService.getComprasPorArtesao(artesao.id),
                    apiService.get<Avaliacao[]>('/avaliacoes', { params: { idArtesao: artesao.id } })
                        .then(res => res.data)
                        .catch(() => [])
                ]);

                setCompras(pedidos || []);
                
                const avaliacoesData = avaliacoesRes || [];
                setAvaliacoes(avaliacoesData);
                if (avaliacoesData.length > 0) {
                    const calcMedia = avaliacoesData.reduce((t: number, a: Avaliacao) => t + a.nota, 0) / avaliacoesData.length;
                    setMedia(calcMedia.toFixed(1));
                }
            } catch (error) {
                console.error("Erro ao carregar dados do artesão:", error);
            } finally {
                setIsLoadingCompras(false);
                setIsLoadingAvaliacoes(false);
            }
        }

        carregarDadosDoArtesao();
    }, [mounted, artesao, router]);

    if (!mounted || !isArtesaoLogged()) return null;

    const handleLogout = () => {
        logoutArtesao();
        router.push('/');
    };

    const handleAbrirModal = (compra: Order) => {
        setCompraEditando(compra);
        setCodigoPostagem(compra.codigoPostagem || '');
        setModalAberto(true);
    };

    const handleSalvarEnvio = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!compraEditando || !compraEditando.id) return;

        setSalvandoEnvio(true);
        try {
            const atualizada = await orderService.declararPostagem(compraEditando.id, codigoPostagem);

            setCompras((lista) => lista.map(c =>
                String(c.id) === String(atualizada.id) ? { ...c, ...atualizada } : c
            ));

            setModalAberto(false);
            setCompraEditando(null);
        } catch (error) {
            console.error("Erro ao declarar postagem", error);
        } finally {
            setSalvandoEnvio(false);
        }
    };

    // Cálculos para os indicadores
    const faturamentoAtelie = compras.reduce((acc, curr) => acc + (curr.precoUnitario || 0), 0);
    const pedidosParaPostar = compras.filter((o) => o.situacaoEntrega === "aguardadoEnvio" || !o.situacaoEntrega || o.situacaoEntrega !== "Enviado");

    return (
        <Box bg="#FAF8F5" minH="100vh" py={8} px={{ base: 4, md: 8 }}>
            <Container maxW="1200px">
                {/* Perfil do Ateliê */}
                <Card.Root bg="white" boxShadow="sm" borderRadius="xl" mb={8} p={6} borderWidth="1px" borderColor="gray.200">
                    <Flex
                        direction={{ base: "column", md: "row" }}
                        justify="space-between"
                        align={{ base: "flex-start", md: "center" }}
                        gap={4}
                    >
                        <HStack spacing={4}>
                            <Avatar.Root size="lg" bg="#C85A32" color="white">
                                <Avatar.Fallback name={artesao?.nome || 'Mestre Artesão'} />
                            </Avatar.Root>
                            <Box>
                                <Heading size="md" color="#2D2424">
                                    Ateliê {artesao?.nome || 'Mestre Artesão'}
                                </Heading>
                                <Text fontSize="sm" color="gray.600">
                                    Polo Regional: <b>{artesao?.regiaoProducao || 'Pernambuco'}</b>
                                </Text>
                            </Box>
                        </HStack>
                        <HStack gap={3} wrap="wrap">
                            <Badge colorPalette="green" variant="subtle" px={3} py={1} borderRadius="full">
                                Oficina Aberta & Recebendo Pedidos
                            </Badge>
                            
                            <NextLink href="/">
                                <Button variant="outline" size="sm">
                                    <HStack gap={2}><FiHome /><Text>Início</Text></HStack>
                                </Button>
                            </NextLink>

                            <NextLink href="/artesao/produtos">
                                <Button colorPalette="brand" size="sm">
                                    <HStack gap={2}><FiPackage /><Text>Gerenciar Catálogo</Text></HStack>
                                </Button>
                            </NextLink>
                            
                            <Button variant="outline" colorPalette="red" size="sm" onClick={handleLogout}>
                                <HStack gap={2}><FiLogOut /><Text>Sair</Text></HStack>
                            </Button>
                        </HStack>
                    </Flex>
                </Card.Root>

                {/* Indicadores do Ateliê */}
                <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={6} mb={8}>
                    <Card.Root bg="white" boxShadow="sm" borderRadius="xl" borderLeft="4px solid #C85A32" borderWidth="1px" borderColor="gray.200">
                        <Card.Body>
                            <Stat.Root>
                                <Stat.Label color="gray.500" fontSize="sm">Faturamento das Minhas Obras</Stat.Label>
                                <Stat.ValueText color="#C85A32" fontSize="2xl" fontWeight="bold">
                                    {isLoadingCompras ? "..." : `R$ ${faturamentoAtelie.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                                </Stat.ValueText>
                                <Stat.HelpText color="green.600">Disponível para repasse</Stat.HelpText>
                            </Stat.Root>
                        </Card.Body>
                    </Card.Root>

                    <Card.Root bg="white" boxShadow="sm" borderRadius="xl" borderLeft="4px solid #4A5568" borderWidth="1px" borderColor="gray.200">
                        <Card.Body>
                            <Stat.Root>
                                <Stat.Label color="gray.500" fontSize="sm">Total de Peças Vendidas</Stat.Label>
                                <Stat.ValueText color="#2D2424" fontSize="2xl" fontWeight="bold">
                                    {isLoadingCompras ? "..." : `${compras.length} itens`}
                                </Stat.ValueText>
                                <Stat.HelpText color="gray.500">Obras enviadas e ativas</Stat.HelpText>
                            </Stat.Root>
                        </Card.Body>
                    </Card.Root>

                    <Card.Root bg="white" boxShadow="sm" borderRadius="xl" borderLeft="4px solid #D69E2E" borderWidth="1px" borderColor="gray.200">
                        <Card.Body>
                            <Stat.Root>
                                <Stat.Label color="gray.500" fontSize="sm">Aguardando Postagem</Stat.Label>
                                <Stat.ValueText color="#B7791F" fontSize="2xl" fontWeight="bold">
                                    {isLoadingCompras ? "..." : `${pedidosParaPostar.length} encomendas`}
                                </Stat.ValueText>
                                <Stat.HelpText color="orange.600">
                                    Levar à agência dos Correios
                                </Stat.HelpText>
                            </Stat.Root>
                        </Card.Body>
                    </Card.Root>

                    <Card.Root bg="white" boxShadow="sm" borderRadius="xl" borderLeft="4px solid #319795" borderWidth="1px" borderColor="gray.200">
                        <Card.Body>
                            <Stat.Root>
                                <Stat.Label color="gray.500" fontSize="sm">Avaliação dos Colecionadores</Stat.Label>
                                <Stat.ValueText color="#319795" fontSize="2xl" fontWeight="bold">
                                    ★ {media} / 5.0
                                </Stat.ValueText>
                                <Stat.HelpText color="gray.500">Baseado em avaliações reais</Stat.HelpText>
                            </Stat.Root>
                        </Card.Body>
                    </Card.Root>
                </SimpleGrid>

                {/* Listagem e Avaliações */}
                <SimpleGrid columns={{ base: 1, lg: 3 }} gap={8}>
                    {/* Tabela de Compras Integrada */}
                    <Box gridColumn={{ lg: "span 2" }}>
                        <Card.Root bg="white" boxShadow="sm" borderRadius="xl" borderWidth="1px" borderColor="gray.200">
                            <Card.Header pb={2}>
                                <Heading size="md" color="#2D2424">
                                    Envios e Vendas da Minha Oficina
                                </Heading>
                                <Text fontSize="sm" color="gray.500">
                                    Gerencie os endereços de entrega e insira o código de rastreamento.
                                </Text>
                            </Card.Header>
                            <Card.Body pt={4} overflowX="auto">
                                {isLoadingCompras ? (
                                    <Flex justify="center" py={6}>
                                        <Spinner size="lg" color="brand.500" />
                                    </Flex>
                                ) : compras.length === 0 ? (
                                    <Text color="gray.500" textAlign="center" py={6}>Nenhum produto seu foi comprado ainda.</Text>
                                ) : (
                                    <Table.Root size="sm" variant="line">
                                        <Table.Header bg="gray.50">
                                            <Table.Row>
                                                <Table.ColumnHeader>Produto</Table.ColumnHeader>
                                                <Table.ColumnHeader>Comprador</Table.ColumnHeader>
                                                <Table.ColumnHeader>Endereço</Table.ColumnHeader>
                                                <Table.ColumnHeader textAlign="center">Ação / Status</Table.ColumnHeader>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {compras.map((compra) => (
                                                <Table.Row key={compra.id}>
                                                    <Table.Cell>
                                                        <Text fontWeight="bold">{compra.tituloProduto || compra.idProduto}</Text>
                                                        <Text fontSize="xs" color="gray.500">Qtd: {compra.quantidade || 1}</Text>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <Text color="gray.800">{compra.nomeComprador || compra.idComprador}</Text>
                                                    </Table.Cell>
                                                    <Table.Cell maxW="220px">
                                                        {compra.enderecoEntrega ? (
                                                            <Text fontSize="xs" color="gray.600">
                                                                {compra.enderecoEntrega.rua}, {compra.enderecoEntrega.numero} <br />
                                                                {compra.enderecoEntrega.bairro} - {compra.enderecoEntrega.cidade}/{compra.enderecoEntrega.estado}
                                                            </Text>
                                                        ) : (
                                                            <Text color="gray.400" fontSize="xs">Endereço não registrado</Text>
                                                        )}
                                                    </Table.Cell>
                                                    <Table.Cell textAlign="center">
                                                        {compra.situacaoEntrega === "Enviado" ? (
                                                            <VStack gap={1} align="center">
                                                                <Badge colorPalette="green">Enviado</Badge>
                                                                <Text fontSize="2xs" color="gray.600">
                                                                    Rast.: {compra.codigoPostagem}
                                                                </Text>
                                                            </VStack>
                                                        ) : (
                                                            <Button size="xs" colorPalette="orange" bg="#C85A32" color="white" _hover={{ bg: "#A64724" }} onClick={() => handleAbrirModal(compra)}>
                                                                Declarar Postagem
                                                            </Button>
                                                        )}
                                                    </Table.Cell>
                                                </Table.Row>
                                            ))}
                                        </Table.Body>
                                    </Table.Root>
                                )}
                            </Card.Body>
                        </Card.Root>
                    </Box>

                    {/* Recados / Avaliações Recentes */}
                    <Box>
                        <Card.Root bg="white" boxShadow="sm" borderRadius="xl" borderWidth="1px" borderColor="gray.200">
                            <Card.Header pb={2}>
                                <Heading size="md" color="#2D2424">
                                    Recados dos Clientes
                                </Heading>
                                <Text fontSize="sm" color="gray.500">
                                    Depoimentos sobre acabamento e obras.
                                </Text>
                            </Card.Header>
                            <Card.Body pt={4}>
                                <VStack align="stretch" gap={3}>
                                    {isLoadingAvaliacoes ? (
                                        <Flex justify="center" py={4}>
                                            <Spinner size="sm" color="brand.500" />
                                        </Flex>
                                    ) : avaliacoes.length > 0 ? (
                                        avaliacoes.slice(0, 4).map((aval, idx) => (
                                            <Box key={aval.id || idx} p={3} bg="#FAF8F5" borderRadius="md" borderWidth="1px" borderColor="gray.100">
                                                <Flex justify="space-between" align="center" mb={1}>
                                                    <Text fontWeight="bold" fontSize="xs" color="#2D2424">
                                                        {aval.nomeComprador || 'Cliente'}
                                                    </Text>
                                                    <Badge colorPalette="orange">★ {aval.nota}</Badge>
                                                </Flex>
                                                <Text fontSize="xs" color="gray.600" fontStyle="italic">
                                                    &quot;{aval.comentario}&quot;
                                                </Text>
                                            </Box>
                                        ))
                                    ) : (
                                        <Text fontSize="xs" color="gray.500" textAlign="center" py={4}>
                                            Nenhuma avaliação recebida ainda.
                                        </Text>
                                    )}
                                </VStack>
                            </Card.Body>
                        </Card.Root>
                    </Box>
                </SimpleGrid>

                {/* Modal para Adicionar Código de Postagem */}
                <Dialog.Root open={modalAberto} onOpenChange={(e) => !e.open && setModalAberto(false)}>
                    <Portal>
                        <Dialog.Backdrop />
                        <Dialog.Positioner>
                            <Dialog.Content as="form" onSubmit={handleSalvarEnvio} bg="white" p={2} borderRadius="xl">
                                <Dialog.Header>
                                    <Dialog.Title>Declarar Envio</Dialog.Title>
                                </Dialog.Header>
                                <Dialog.Body>
                                    <VStack gap={4} align="stretch">
                                        <Text fontSize="sm" color="gray.600">
                                            Produto: <b>{compraEditando?.tituloProduto}</b>
                                        </Text>
                                        <Field.Root required>
                                            <Field.Label>Código de Postagem (Rastreio)</Field.Label>
                                            <Input
                                                value={codigoPostagem}
                                                onChange={(e) => setCodigoPostagem(e.target.value)}
                                                placeholder="Ex: BR123456789BR"
                                                bg="white"
                                            />
                                        </Field.Root>
                                    </VStack>
                                </Dialog.Body>
                                <Dialog.Footer mt={4}>
                                    <HStack gap={3}>
                                        <Button variant="ghost" size="sm" onClick={() => setModalAberto(false)} disabled={salvandoEnvio}>
                                            Cancelar
                                        </Button>
                                        <Button type="submit" colorPalette="orange" bg="#C85A32" color="white" size="sm" loading={salvandoEnvio} disabled={!codigoPostagem}>
                                            Salvar Envio
                                        </Button>
                                    </HStack>
                                </Dialog.Footer>
                            </Dialog.Content>
                        </Dialog.Positioner>
                    </Portal>
                </Dialog.Root>

            </Container>
        </Box>
    );
}