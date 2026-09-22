'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';
import { sessionStore } from '@/store/sessionStore';
import { orderService } from '@/services/orderService';
import { avaliacaoService } from '@/services/avaliacaoService';
import { Order } from '@/types/order';
import { 
    Box, Button, Container, Flex, Heading, HStack, Text, VStack, 
    Spinner, Table, Badge, Dialog, Portal, Input, Field, Textarea 
} from '@chakra-ui/react';
import { FiArrowLeft } from 'react-icons/fi';

const emptySubscribe = () => () => {};

export default function MeusPedidosPage() {
    const router = useRouter();
    const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
    const isCustomerLogged = sessionStore((state) => state.isCustomerLogged);
    const customer = sessionStore((state) => state.customer);

    const [pedidos, setPedidos] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Estados de Avaliação
    const [modalAberto, setModalAberto] = useState(false);
    const [pedidoEditando, setPedidoEditando] = useState<Order | null>(null);
    const [nota, setNota] = useState<string>('10');
    const [comentario, setComentario] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!mounted) return;
        if (!customer) {
            router.push('/customer/login');
            return;
        }

        setIsLoading(true);
        orderService.getComprasPorComprador(customer.id)
            .then(setPedidos)
            .finally(() => setIsLoading(false));
    }, [mounted, customer, router]);

    if (!mounted || !isCustomerLogged()) return null;

    const handleDeclararRecebido = async (idPedido: string) => {
        if (!idPedido) return;
        try {
            const atualizado = await orderService.declararRecebimento(idPedido);
            setPedidos((lista) => lista.map(p => String(p.id) === String(atualizado.id) ? { ...p, ...atualizado } : p));
        } catch (error) {
            console.error("Erro ao atualizar para recebido");
        }
    };

    const handleAbrirAvaliacao = (pedido: Order) => {
        setPedidoEditando(pedido);
        setNota('10');
        setComentario('');
        setModalAberto(true);
    };

    const handleEnviarAvaliacao = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!pedidoEditando || !pedidoEditando.id || !customer) return;

        setIsSubmitting(true);
        try {
            await avaliacaoService.criar({
                idComprador: customer.id,
                nomeComprador: customer.nome,
                idArtesao: pedidoEditando.idArtesao,
                idProduto: pedidoEditando.idProduto,
                nota: Number(nota),
                comentario: comentario.trim(),
                data: new Date().toISOString()
            });

            const pedidoAtualizado = await orderService.marcarComoAvaliado(pedidoEditando.id);
            setPedidos((lista) => lista.map(p => String(p.id) === String(pedidoAtualizado.id) ? { ...p, ...pedidoAtualizado } : p));

            setModalAberto(false);
            setPedidoEditando(null);
        } catch (error) {
            console.error("Erro ao enviar avaliação:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box minH="100vh" bg="gray.50" py={8}>
            <Container maxW="1000px">
                <NextLink href="/customer/minha-conta">
                    <Button variant="ghost" size="sm" mb={6}>
                        <HStack gap={2}><FiArrowLeft /><Text>Sua Conta</Text></HStack>
                    </Button>
                </NextLink>

                <Box bg="white" p={6} borderRadius="xl" shadow="sm" borderWidth="1px" borderColor="gray.200">
                    <Heading size="md" mb={6}>Meus Pedidos</Heading>

                    {isLoading ? (
                        <Flex justify="center" py={10}><Spinner size="lg" color="brand.500" /></Flex>
                    ) : pedidos.length === 0 ? (
                        <Text color="gray.500">Você ainda não possui pedidos registrados.</Text>
                    ) : (
                        <VStack align="stretch" gap={4}>
                            {pedidos.map((pedido) => (
                                <Box key={pedido.id} p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
                                    <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
                                        <VStack align="start" gap={1}>
                                            <Text fontWeight="bold" color="gray.800">{pedido.tituloProduto}</Text>
                                            <Text fontSize="sm">Quantidade: {pedido.quantidade} | R$ {pedido.precoUnitario.toFixed(2)} un.</Text>
                                            <Text fontSize="xs" color="gray.500">Data: {new Date(pedido.dataCompra).toLocaleDateString('pt-BR')}</Text>
                                        </VStack>
                                        
                                        <VStack align="end" gap={2}>
                                            {pedido.situacaoEntrega === 'aguardadoEnvio' && (
                                                <Badge colorPalette="orange">Aguardando Envio</Badge>
                                            )}
                                            {pedido.situacaoEntrega === 'Enviado' && (
                                                <>
                                                    <Badge colorPalette="blue">Enviado (Cód: {pedido.codigoPostagem})</Badge>
                                                    <Button size="sm" colorPalette="brand" onClick={() => handleDeclararRecebido(pedido.id!)}>
                                                        Recebi o Produto
                                                    </Button>
                                                </>
                                            )}
                                            {pedido.situacaoEntrega === 'Entregue' && (
                                                <>
                                                    <Badge colorPalette="green">Entregue</Badge>
                                                    {!pedido.avaliado ? (
                                                        <Button size="sm" colorPalette="blue" onClick={() => handleAbrirAvaliacao(pedido)}>
                                                            Avaliar Produto
                                                        </Button>
                                                    ) : (
                                                        <Text fontSize="xs" color="gray.500" fontWeight="bold">Avaliação Enviada</Text>
                                                    )}
                                                </>
                                            )}
                                        </VStack>
                                    </Flex>
                                </Box>
                            ))}
                        </VStack>
                    )}
                </Box>

                {/* Modal de Avaliação */}
                <Dialog.Root open={modalAberto} onOpenChange={(e) => !e.open && setModalAberto(false)}>
                    <Portal>
                        <Dialog.Backdrop />
                        <Dialog.Positioner>
                            <Dialog.Content as="form" onSubmit={handleEnviarAvaliacao}>
                                <Dialog.Header>
                                    <Dialog.Title>Avaliar Produto</Dialog.Title>
                                </Dialog.Header>
                                <Dialog.Body>
                                    <VStack gap={4} align="stretch">
                                        <Text fontSize="sm" color="gray.600">
                                            Produto: <b>{pedidoEditando?.tituloProduto}</b>
                                        </Text>
                                        <Field.Root required>
                                            <Field.Label>Nota (0 a 10)</Field.Label>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="10"
                                                value={nota}
                                                onChange={(e) => setNota(e.target.value)}
                                                bg="white"
                                            />
                                        </Field.Root>
                                        <Field.Root required>
                                            <Field.Label>Comentário ({comentario.length}/2000)</Field.Label>
                                            <Textarea
                                                maxLength={2000}
                                                rows={4}
                                                value={comentario}
                                                onChange={(e) => setComentario(e.target.value)}
                                                placeholder="Descreva o que achou da peça, qualidade, entrega..."
                                                bg="white"
                                            />
                                        </Field.Root>
                                    </VStack>
                                </Dialog.Body>
                                <Dialog.Footer>
                                    <Button variant="ghost" size="sm" onClick={() => setModalAberto(false)} disabled={isSubmitting}>
                                        Cancelar
                                    </Button>
                                    <Button type="submit" colorPalette="brand" size="sm" loading={isSubmitting}>
                                        Enviar Avaliação
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