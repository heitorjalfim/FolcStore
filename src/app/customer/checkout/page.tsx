"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { sessionStore } from "@/store/sessionStore";
import { useCartStore } from "@/store/cartStore";
import { orderService } from "@/services/orderService";
import { paymentService } from "@/services/paymentService";
import EnderecoManager from "../../components/EnderecoManager";
import { Endereco, MetodoPagamento, Order } from "@/types";
import {
    Box, Button, Container, Field, Flex, Grid, GridItem,
    HStack, Heading, Input, Separator, Spinner, Text, VStack
} from "@chakra-ui/react";
import { FiHome } from "react-icons/fi";

export default function CheckoutPage() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    const customer = sessionStore((state) => state.customer);
    const isCustomerLogged = sessionStore((state) => state.isCustomerLogged);
    const { items, totalPrice, clearCart } = useCartStore();

    const [step, setStep] = useState<"endereco" | "pagamento">("endereco");
    const [enderecoSelecionadoId, setEnderecoSelecionadoId] = useState<string | null>(null);

    // --- Pagamento ---
    const [metodo, setMetodo] = useState<MetodoPagamento>("cartao");
    const [cartaoData, setCartaoData] = useState({
        numero: "", nomeImpresso: "", validade: "", cvv: "",
    });

    // --- Confirmação ---
    const [isConfirming, setIsConfirming] = useState(false);
    const [confirmError, setConfirmError] = useState("");
    const [pedidoConfirmado, setPedidoConfirmado] = useState(false);
    const [totalConfirmado, setTotalConfirmado] = useState(0);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (!mounted) return;
        if (!isCustomerLogged()) {
            router.push("/customer/login");
            return;
        }
        if (items.length === 0 && !pedidoConfirmado) {
            router.push("/customer");
        }
    }, [mounted, isCustomerLogged, items.length, pedidoConfirmado, router]);

    if (!mounted || !isCustomerLogged() || !customer) {
        return (
            <Flex minH="80vh" align="center" justify="center">
                <Spinner size="xl" color="brand.500" />
            </Flex>
        );
    }

    const handleChangeCartao = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCartaoData((prev) => ({ ...prev, [name]: value }));
    };

    const enderecoSelecionado: Endereco | undefined = customer.enderecos.find(
        (e) => e.id === enderecoSelecionadoId
    );

    const handleConfirmarPedido = async () => {
        if (!enderecoSelecionado) return;
        setConfirmError("");
        setIsConfirming(true);
        try {
            const pagamento = paymentService.processar(
                metodo,
                metodo === "cartao" ? cartaoData.numero : undefined
            );

            const compras: Order[] = items.map((item) => ({
                idArtesao: item.product.idArtesao,
                idComprador: customer.id,
                nomeComprador: customer.nome,
                idProduto: item.product.id,
                tituloProduto: item.product.titulo,
                quantidade: item.quantity,
                precoUnitario: item.product.preco,
                status: "Pago",
                dataCompra: new Date().toISOString(),
                enderecoEntrega: enderecoSelecionado,
                pagamento: pagamento,
                situacaoEntrega: "aguardadoEnvio",
                codigoPostagem: null
            }));

            await orderService.registrarCompras(compras);

            setTotalConfirmado(totalPrice());
            setPedidoConfirmado(true);
            clearCart();
        } catch (err) {
            console.error(err);
            setConfirmError("Não foi possível concluir o pedido. Tente novamente.");
        } finally {
            setIsConfirming(false);
        }
    };

    if (pedidoConfirmado) {
        return (
            <Flex minH="80vh" align="center" justify="center" p={4}>
                <VStack gap={4} bg="white" p={10} rounded="lg" shadow="sm" border="1px solid" borderColor="gray.200" maxW="md" textAlign="center">
                    <Heading size="lg" color="brand.500">Pedido confirmado!</Heading>
                    <Text color="gray.600">
                        Sua compra no valor total de <Text as="span" fontWeight="bold">R$ {totalConfirmado.toFixed(2)}</Text> foi registrada com sucesso.
                    </Text>
                    <Text color="gray.500" fontSize="sm">
                        Entrega em: {enderecoSelecionado?.rua}, {enderecoSelecionado?.numero} — {enderecoSelecionado?.cidade}/{enderecoSelecionado?.estado}
                    </Text>
                    <Button colorPalette="brand" w="full" onClick={() => router.push("/customer/minha-conta")}>
                        Acompanhar Meus Pedidos
                    </Button>
                </VStack>
            </Flex>
        );
    }

    return (
        <Box minH="100vh" bg="gray.50" pb={12}>
            <Box bg="white" shadow="sm" py={4} px={8} mb={8}>
                <Container maxW="1200px">
                    <HStack gap={4}>
                        <NextLink href="/customer">
                            <Button variant="ghost" size="sm">
                                <HStack gap={2}><FiHome /><Text>Painel</Text></HStack>
                            </Button>
                        </NextLink>
                        <Heading size="md" color="brand.500">Finalizar Compra</Heading>
                    </HStack>
                </Container>
            </Box>

            <Container maxW="1200px">
                <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
                    <GridItem>
                        <Box bg="white" p={6} rounded="lg" shadow="sm" border="1px solid" borderColor="gray.200">
                            <Text color="gray.500" fontSize="sm" mb={4}>
                                {step === "endereco" ? "Passo 1 de 2" : "Passo 2 de 2"}
                            </Text>

                            {step === "endereco" && (
                                <VStack align="stretch" gap={5}>
                                    <EnderecoManager
                                        modoSelecao
                                        enderecoSelecionadoId={enderecoSelecionadoId}
                                        onSelectEndereco={setEnderecoSelecionadoId}
                                    />
                                    <Separator />
                                    <Button colorPalette="brand" alignSelf="end" disabled={!enderecoSelecionadoId} onClick={() => setStep("pagamento")}>
                                        Continuar para pagamento
                                    </Button>
                                </VStack>
                            )}

                            {step === "pagamento" && (
                                <VStack align="stretch" gap={5}>
                                    <Heading size="md">Pagamento</Heading>
                                    <HStack gap={3}>
                                        <Button variant={metodo === "cartao" ? "solid" : "outline"} colorPalette="brand" onClick={() => setMetodo("cartao")}>
                                            Cartão de Crédito
                                        </Button>
                                        <Button variant={metodo === "pix" ? "solid" : "outline"} colorPalette="brand" onClick={() => setMetodo("pix")}>
                                            Pix
                                        </Button>
                                    </HStack>

                                    {metodo === "cartao" && (
                                        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
                                            <GridItem colSpan={{ base: 1, md: 2 }}>
                                                <Field.Root required><Field.Label>Número do Cartão</Field.Label><Input name="numero" value={cartaoData.numero} onChange={handleChangeCartao} placeholder="0000 0000 0000 0000" maxLength={19} /></Field.Root>
                                            </GridItem>
                                            <GridItem colSpan={{ base: 1, md: 2 }}>
                                                <Field.Root required><Field.Label>Nome impresso no cartão</Field.Label><Input name="nomeImpresso" value={cartaoData.nomeImpresso} onChange={handleChangeCartao} placeholder="Como está no cartão" /></Field.Root>
                                            </GridItem>
                                            <GridItem colSpan={1}>
                                                <Field.Root required><Field.Label>Validade</Field.Label><Input name="validade" value={cartaoData.validade} onChange={handleChangeCartao} placeholder="MM/AA" maxLength={5} /></Field.Root>
                                            </GridItem>
                                            <GridItem colSpan={1}>
                                                <Field.Root required><Field.Label>CVV</Field.Label><Input name="cvv" value={cartaoData.cvv} onChange={handleChangeCartao} placeholder="123" maxLength={4} /></Field.Root>
                                            </GridItem>
                                        </Grid>
                                    )}

                                    {metodo === "pix" && (
                                        <Box bg="gray.50" p={4} rounded="md" border="1px dashed" borderColor="gray.300">
                                            <Text fontSize="sm" color="gray.600">
                                                Pagamento via Pix simulado — ao confirmar o pedido, o pagamento será considerado aprovado automaticamente.
                                            </Text>
                                        </Box>
                                    )}

                                    {confirmError && <Text color="red.500" fontSize="sm">{confirmError}</Text>}

                                    <HStack justify="space-between">
                                        <Button variant="ghost" onClick={() => setStep("endereco")}>Voltar</Button>
                                        <Button colorPalette="brand" loading={isConfirming} loadingText="Confirmando..." onClick={handleConfirmarPedido}>
                                            Confirmar Pedido
                                        </Button>
                                    </HStack>
                                </VStack>
                            )}
                        </Box>
                    </GridItem>

                    <GridItem>
                        <Box bg="white" p={6} rounded="lg" shadow="sm" border="1px solid" borderColor="gray.200">
                            <Heading size="sm" mb={4}>Resumo do Pedido</Heading>
                            <VStack align="stretch" gap={3}>
                                {items.map((item) => (
                                    <HStack key={item.product.id} justify="space-between">
                                        <Text fontSize="sm" lineClamp={1}>{item.product.titulo} x{item.quantity}</Text>
                                        <Text fontSize="sm" fontWeight="semibold">R$ {(item.product.preco * item.quantity).toFixed(2)}</Text>
                                    </HStack>
                                ))}
                            </VStack>
                            <Separator my={4} />
                            <HStack justify="space-between">
                                <Text fontWeight="bold">Total</Text>
                                <Text fontWeight="bold" color="brand.600">R$ {totalPrice().toFixed(2)}</Text>
                            </HStack>
                        </Box>
                    </GridItem>
                </Grid>
            </Container>
        </Box>
    );
}
