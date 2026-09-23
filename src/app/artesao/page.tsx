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

interface Review {
    id: string;
    idArtesao: string;
    nomeComprador: string;
    nota: number;
    comentario: string;
}

const emptySubscribe = () => () => { };

export default function Artesao() {
    const router = useRouter();
    const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

    const logoutArtesao = sessionStore((state) => state.logoutArtesao);
    const isArtesaoLogged = sessionStore((state) => state.isArtesaoLogged);
    const artesao = sessionStore((state) => state.artesao);

    // Estados da Tabela e Compras
    const [compras, setCompras] = useState<Order[]>([]);
    const [minhasAvaliacoes, setMinhasAvaliacoes] = useState<Review[]>([]);
    const [isLoadingCompras, setIsLoadingCompras] = useState(true);

    // Estados de Avaliações (Dinâmicas)
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

        setIsLoadingCompras(true);
        setIsLoadingAvaliacoes(true);

        // Busca simultânea de compras e avaliações do artesão
        Promise.all([
            orderService.getComprasPorArtesao(artesao.id),
            apiService.get<Avaliacao[]>('/avaliacoes', { params: { idArtesao: artesao.id } })
        ]).then(([comprasData, avaliacoesRes]) => {
            setCompras(comprasData);

            const avaliacoesData = avaliacoesRes.data;
            setAvaliacoes(avaliacoesData);
            if (avaliacoesData.length > 0) {
                const calcMedia = avaliacoesData.reduce((t, a) => t + a.nota, 0) / avaliacoesData.length;
                setMedia(calcMedia.toFixed(1));
            }
        }).catch(console.error)
          .finally(() => {
              setIsLoadingCompras(false);
              setIsLoadingAvaliacoes(false);
          });

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

    return (
        <Box minH="100vh" bg="gray.50" pb={12}>
            {/* Header de Navegação */}
            <Box bg="white" shadow="sm" py={4} px={8} mb={8}>
                <Container maxW="1200px">
                    <Flex justify="space-between" align="center">
                        <HStack gap={4}>
                            <NextLink href="/">
                                <Button variant="ghost" size="sm">
                                    <HStack gap={2}>
                                        <FiHome />
                                        <Text>Home</Text>
                                    </HStack>
                                </Button>
                            </NextLink>
                            <Heading size="md" color="brand.500">
                                Painel do Artesão
                            </Heading>
                        </HStack>

                        <HStack gap={3}>
                            <NextLink href="/artesao/produtos">
                                <Button variant="outline" size="sm" colorPalette="brand">
                                    <HStack gap={2}>
                                        <FiPackage />
                                        <Text>Meu Catálogo</Text>
                                    </HStack>
                                </Button>
                            </NextLink>
                            <Button
                                colorPalette="red"
                                variant="outline"
                                size="sm"
                                onClick={handleLogout}
                            >
                                <HStack gap={2}>
                                    <FiLogOut />
                                    <Text>Sair</Text>
                                </HStack>
                            </Button>
                        </HStack>
                    </Flex>
                </Container>
            </Box>

            <Container maxW="1000px">
                {/* Perfil */}
                <Box bg="white" p={6} borderRadius="xl" shadow="sm" borderWidth="1px" borderColor="gray.200" mb={8}>
                    <VStack align="start" gap={1}>
                        <Heading size="lg" color="gray.800">
                            Olá, {artesao?.nome || 'Mestre Artesão'}!
                        </Heading>
                        <Text color="gray.600" fontSize="sm">
                            Polo Regional: <b>{artesao?.regiaoProducao || 'Pernambuco'}</b>
                        </Text>
                    </VStack>
                </Box>

                <VStack align="stretch" gap={8}>
                    {/* Listagem de Compras Integrada */}
                    <Box bg="white" p={6} borderRadius="xl" shadow="sm" borderWidth="1px" borderColor="gray.200">
                        <Heading size="md" mb={4}>Vendas Realizadas</Heading>

                        {isLoadingCompras ? (
                            <Flex justify="center" py={6}>
                                <Spinner size="lg" color="brand.500" />
                            </Flex>
                        ) : compras.length === 0 ? (
                            <Text color="gray.500">Nenhum produto seu foi comprado ainda.</Text>
                        ) : (
                            <Box overflowX="auto">
                                <Table.Root size="sm" variant="line">
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.ColumnHeader>Produto</Table.ColumnHeader>
                                            <Table.ColumnHeader>Comprador</Table.ColumnHeader>
                                            <Table.ColumnHeader>Endereço de Entrega</Table.ColumnHeader>
                                            <Table.ColumnHeader textAlign="end">Qtd.</Table.ColumnHeader>
                                            <Table.ColumnHeader textAlign="center">Ação</Table.ColumnHeader>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {compras.map((compra) => (
                                            <Table.Row key={compra.id}>
                                                <Table.Cell>
                                                    <Text fontWeight="bold">{compra.tituloProduto || compra.idProduto}</Text>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Text color="gray.800">{compra.nomeComprador || compra.idComprador}</Text>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {compra.enderecoEntrega ? (
                                                        <Text fontSize="xs">
                                                            {compra.enderecoEntrega.rua}, {compra.enderecoEntrega.numero} <br />
                                                            {compra.enderecoEntrega.bairro} - {compra.enderecoEntrega.cidade}/{compra.enderecoEntrega.estado} <br />
                                                            CEP: {compra.enderecoEntrega.cep}
                                                        </Text>
                                                    ) : (
                                                        <Text color="gray.400" fontSize="xs">Endereço não registrado</Text>
                                                    )}
                                                </Table.Cell>
                                                <Table.Cell textAlign="end" fontWeight="bold" color="brand.600">
                                                    {compra.quantidade}
                                                </Table.Cell>
                                                <Table.Cell textAlign="center">
                                                    {compra.situacaoEntrega === "Enviado" ? (
                                                        <VStack gap={1} align="center">
                                                            <Badge colorPalette="green">Enviado</Badge>
                                                            <Text fontSize="2xs" color="gray.600">
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

                    {/* Avaliações Dinâmicas */}
                    <Box bg="white" p={6} borderRadius="xl" shadow="sm" borderWidth="1px" borderColor="gray.200">
                        <Heading size="md" mb={2}>Avaliações do Vendedor</Heading>
                        {isLoadingAvaliacoes ? (
                            <Flex justify="center" py={6}>
                                <Spinner size="lg" color="brand.500" />
                            </Flex>
                        ) : avaliacoes.length === 0 ? (
                            <Text color="gray.500" mt={2}>Você ainda não possui avaliações.</Text>
                        ) : (
                            <>
                                <Text fontSize="sm" color="gray.600" mb={6}>Nota média: <b>{media} / 5</b></Text>
                                <VStack align="stretch" gap={4}>
                                    {avaliacoes.map((item, idx) => (
                                        <AvaliacaoCard 
                                            key={item.id || idx} 
                                            avaliacao={{
                                                nota: item.nota,
                                                comentario: item.comentario,
                                                data: new Date(item.data).toLocaleDateString('pt-BR')
                                            }} 
                                        />
                                    ))}
                                </VStack>
                            </>
                        )}
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