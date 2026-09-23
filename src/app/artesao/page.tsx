"use client";

import { useEffect, useState, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';
import { sessionStore } from '@/store/sessionStore';
import AvaliacaoCard from "../components/AvaliacaoCard";
import {
    Box, Button, Container, Flex, Heading, HStack, Text, VStack, Spinner,
    Table, Badge, Dialog, Portal, Input, Field
} from '@chakra-ui/react';
import { FiPackage, FiLogOut, FiUser } from 'react-icons/fi';
import { orderService } from '@/services/orderService';
import { Order } from '@/types/order';

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
        orderService.getComprasPorArtesao(artesao.id)
            .then(setCompras)
            .catch(console.error)
            .finally(() => setIsLoadingCompras(false));

    }, [mounted, artesao, router]);

    if (!mounted || !isArtesaoLogged()) return null;

    const handleLogout = () => {
        logoutArtesao();
        router.push('/');
    };

    const handleAbrirModal = (compra: Order) => {
        setCompraEditando(compra);
        setCodigoPostagem('');
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

    const avaliacoes = [
        { nota: 5, comentario: "Peça linda, chegou rápido!", data: "10/09/2026" },
        { nota: 4, comentario: "Muito bonita, só demorou um pouco.", data: "05/09/2026" },
    ];
    const media = (avaliacoes.reduce((t, a) => t + a.nota, 0) / avaliacoes.length).toFixed(1);

    return (
        <Box minH="100vh" bg="gray.50" py={8}>
            <Container maxW="1000px">
                <Box bg="white" p={6} borderRadius="xl" shadow="sm" borderWidth="1px" borderColor="gray.200" mb={8}>
                    <Flex justify="space-between" align="center">
                        <VStack align="start" gap={1}>
                            <Heading size="lg" color="brand.500">
                                Olá, {artesao?.nome || 'Mestre Artesão'}!
                            </Heading>
                            <Text color="gray.600" fontSize="sm">
                                Polo Regional: <b>{artesao?.regiaoProducao || 'Pernambuco'}</b>
                            </Text>
                        </VStack>
                        <HStack gap={3}>
                            <NextLink href="/artesao/produtos">
                                <Button colorPalette="brand" size="md">
                                    <HStack gap={2}><FiPackage /><Text>Gerenciar Catálogo</Text></HStack>
                                </Button>
                            </NextLink>
                            <NextLink href="/artesao/perfil">
                                <Button variant="outline" colorPalette="brand" size="md">
                                    <HStack gap={2}><FiUser /><Text>Editar Perfil</Text></HStack>
                                </Button>
                            </NextLink>
                            <Button variant="outline" colorPalette="red" size="md" onClick={handleLogout}>
                                <HStack gap={2}><FiLogOut /><Text>Sair</Text></HStack>
                            </Button>
                        </HStack>
                    </Flex>
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
                                                                Rast.: {compra.codigoPostagem}
                                                            </Text>
                                                        </VStack>
                                                    ) : (
                                                        <Button size="xs" colorPalette="brand" onClick={() => handleAbrirModal(compra)}>
                                                            Declarar Postagem
                                                        </Button>
                                                    )}
                                                </Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table.Root>
                            </Box>
                        )}
                    </Box>

                    {/* Avaliações */}
                    <Box bg="white" p={6} borderRadius="xl" shadow="sm" borderWidth="1px" borderColor="gray.200">
                        <Heading size="md" mb={2}>Avaliações do Vendedor</Heading>
                        <Text fontSize="sm" color="gray.600" mb={6}>Nota média: <b>{media} / 5</b></Text>
                        <VStack align="stretch" gap={4}>
                            {avaliacoes.map((item, idx) => (
                                <AvaliacaoCard key={idx} avaliacao={item} />
                            ))}
                        </VStack>
                    </Box>
                </VStack>

                {/* Modal para Adicionar Código de Postagem */}
                <Dialog.Root open={modalAberto} onOpenChange={(e) => !e.open && setModalAberto(false)}>
                    <Portal>
                        <Dialog.Backdrop />
                        <Dialog.Positioner>
                            <Dialog.Content as="form" onSubmit={handleSalvarEnvio}>
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
                                <Dialog.Footer>
                                    <Button variant="ghost" size="sm" onClick={() => setModalAberto(false)} disabled={salvandoEnvio}>
                                        Cancelar
                                    </Button>
                                    <Button type="submit" colorPalette="brand" size="sm" loading={salvandoEnvio} disabled={!codigoPostagem}>
                                        Salvar Envio
                                    </Button>
                                </Dialog.Footer>
                            </Dialog.Content>
                        </Dialog.Positioner>
                    </Portal>
                </Dialog.Root>

            </Container>
        </Box>
    );
}
