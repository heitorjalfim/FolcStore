"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { sessionStore } from "@/store/sessionStore";
import { useCartStore } from "@/store/cartStore";
import { addressService } from "@/services/addressService";
import { orderService } from "@/services/orderService";
import { paymentService } from "@/services/paymentService";
import { Endereco, MetodoPagamento, Order } from "@/types";
import {
  Box,
  Button,
  Container,
  Field,
  Flex,
  Grid,
  GridItem,
  HStack,
  Heading,
  Input,
  Separator,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FiHome } from "react-icons/fi";

const ENDERECO_VAZIO = {
  cep: "",
  rua: "",
  numero: "",
  bairro: "",
  complemento: "",
  cidade: "",
  estado: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const customer = sessionStore((state) => state.customer);
  const isCustomerLogged = sessionStore((state) => state.isCustomerLogged);
  const salvarCustomer = sessionStore((state) => state.salvarCustomer);

  const { items, totalPrice, clearCart } = useCartStore();

  const [step, setStep] = useState<"endereco" | "pagamento">("endereco");

  // --- Endereço ---
  const [enderecoSelecionadoId, setEnderecoSelecionadoId] = useState<string | null>(null);
  const [mostrarFormNovoEndereco, setMostrarFormNovoEndereco] = useState(false);
  const [novoEndereco, setNovoEndereco] = useState(ENDERECO_VAZIO);
  const [isSavingEndereco, setIsSavingEndereco] = useState(false);
  const [enderecoError, setEnderecoError] = useState("");

  // --- Pagamento ---
  const [metodo, setMetodo] = useState<MetodoPagamento>("cartao");
  const [cartaoData, setCartaoData] = useState({
    numero: "",
    nomeImpresso: "",
    validade: "",
    cvv: "",
  });

  // --- Confirmação ---
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmError, setConfirmError] = useState("");
  const [pedidoConfirmado, setPedidoConfirmado] = useState<Order | null>(null);

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

  const handleChangeNovoEndereco = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNovoEndereco((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeCartao = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCartaoData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSalvarEndereco = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnderecoError("");
    setIsSavingEndereco(true);
    try {
      const customerAtualizado = await addressService.addEndereco(customer, novoEndereco);
      salvarCustomer(customerAtualizado);
      const enderecoCriado = customerAtualizado.enderecos[customerAtualizado.enderecos.length - 1];
      setEnderecoSelecionadoId(enderecoCriado.id);
      setNovoEndereco(ENDERECO_VAZIO);
      setMostrarFormNovoEndereco(false);
    } catch (err) {
      console.error(err);
      setEnderecoError("Não foi possível salvar o endereço. Tente novamente.");
    } finally {
      setIsSavingEndereco(false);
    }
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

      const novoPedido = await orderService.create({
        customerId: customer.id,
        itens: items.map((item) => ({
          productId: item.product.id,
          titulo: item.product.titulo,
          precoUnitario: item.product.preco,
          quantidade: item.quantity,
        })),
        total: totalPrice(),
        enderecoEntrega: enderecoSelecionado,
        pagamento,
        status: "Confirmado",
        createdAt: new Date().toISOString(),
      });

      setPedidoConfirmado(novoPedido);
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
        <VStack
          gap={4}
          bg="white"
          p={10}
          rounded="lg"
          shadow="sm"
          border="1px solid"
          borderColor="gray.200"
          maxW="md"
          textAlign="center"
        >
          <Heading size="lg" color="brand.500">
            Pedido confirmado!
          </Heading>
          <Text color="gray.600">
            Seu pedido no valor de{" "}
            <Text as="span" fontWeight="bold">
              R$ {pedidoConfirmado.total.toFixed(2)}
            </Text>{" "}
            foi registrado com sucesso.
          </Text>
          <Text color="gray.500" fontSize="sm">
            Entrega em: {pedidoConfirmado.enderecoEntrega.rua},{" "}
            {pedidoConfirmado.enderecoEntrega.numero} —{" "}
            {pedidoConfirmado.enderecoEntrega.cidade}/{pedidoConfirmado.enderecoEntrega.estado}
          </Text>
          <Button colorPalette="brand" w="full" onClick={() => router.push("/customer")}>
            Voltar para a loja
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
                <HStack gap={2}>
                  <FiHome />
                  <Text>Painel</Text>
                </HStack>
              </Button>
            </NextLink>
            <Heading size="md" color="brand.500">
              Finalizar Compra
            </Heading>
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
                  <Heading size="md">Endereço de Entrega</Heading>

                  {customer.enderecos.length === 0 && (
                    <Text color="gray.500" fontSize="sm">
                      Você ainda não tem endereços salvos. Cadastre um endereço para continuar.
                    </Text>
                  )}

                  {customer.enderecos.length > 0 && (
                    <VStack align="stretch" gap={3}>
                      {customer.enderecos.map((endereco) => (
                        <Box
                          key={endereco.id}
                          p={4}
                          borderWidth="2px"
                          borderRadius="md"
                          borderColor={enderecoSelecionadoId === endereco.id ? "brand.500" : "gray.200"}
                          bg={enderecoSelecionadoId === endereco.id ? "brand.50" : "white"}
                          cursor="pointer"
                          onClick={() => setEnderecoSelecionadoId(endereco.id)}
                        >
                          <Text fontWeight="semibold">
                            {endereco.rua}, {endereco.numero}
                            {endereco.complemento ? ` - ${endereco.complemento}` : ""}
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            {endereco.bairro} — {endereco.cidade}/{endereco.estado} — CEP {endereco.cep}
                          </Text>
                        </Box>
                      ))}
                    </VStack>
                  )}

                  {!mostrarFormNovoEndereco && (
                    <Button
                      variant="outline"
                      colorPalette="brand"
                      alignSelf="start"
                      onClick={() => setMostrarFormNovoEndereco(true)}
                    >
                      + Adicionar novo endereço
                    </Button>
                  )}

                  {mostrarFormNovoEndereco && (
                    <Box borderTopWidth="1px" borderColor="gray.100" pt={5}>
                      {enderecoError && (
                        <Text color="red.500" fontSize="sm" mb={3}>
                          {enderecoError}
                        </Text>
                      )}
                      <form onSubmit={handleSalvarEndereco}>
                        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
                          <GridItem colSpan={1}>
                            <Field.Root required>
                              <Field.Label>CEP</Field.Label>
                              <Input
                                name="cep"
                                value={novoEndereco.cep}
                                onChange={handleChangeNovoEndereco}
                                placeholder="00000-000"
                              />
                            </Field.Root>
                          </GridItem>
                          <GridItem colSpan={1}>
                            <Field.Root required>
                              <Field.Label>Estado (UF)</Field.Label>
                              <Input
                                name="estado"
                                value={novoEndereco.estado}
                                onChange={handleChangeNovoEndereco}
                                placeholder="Ex: PE"
                                maxLength={2}
                              />
                            </Field.Root>
                          </GridItem>
                          <GridItem colSpan={{ base: 1, md: 2 }}>
                            <Field.Root required>
                              <Field.Label>Rua / Logradouro</Field.Label>
                              <Input
                                name="rua"
                                value={novoEndereco.rua}
                                onChange={handleChangeNovoEndereco}
                                placeholder="Ex: Rua das Flores"
                              />
                            </Field.Root>
                          </GridItem>
                          <GridItem colSpan={1}>
                            <Field.Root required>
                              <Field.Label>Número</Field.Label>
                              <Input
                                name="numero"
                                value={novoEndereco.numero}
                                onChange={handleChangeNovoEndereco}
                                placeholder="123"
                              />
                            </Field.Root>
                          </GridItem>
                          <GridItem colSpan={1}>
                            <Field.Root required>
                              <Field.Label>Bairro</Field.Label>
                              <Input
                                name="bairro"
                                value={novoEndereco.bairro}
                                onChange={handleChangeNovoEndereco}
                                placeholder="Ex: Centro"
                              />
                            </Field.Root>
                          </GridItem>
                          <GridItem colSpan={1}>
                            <Field.Root>
                              <Field.Label>Complemento (Opcional)</Field.Label>
                              <Input
                                name="complemento"
                                value={novoEndereco.complemento}
                                onChange={handleChangeNovoEndereco}
                                placeholder="Apto 101"
                              />
                            </Field.Root>
                          </GridItem>
                          <GridItem colSpan={1}>
                            <Field.Root required>
                              <Field.Label>Cidade</Field.Label>
                              <Input
                                name="cidade"
                                value={novoEndereco.cidade}
                                onChange={handleChangeNovoEndereco}
                                placeholder="Ex: Recife"
                              />
                            </Field.Root>
                          </GridItem>
                        </Grid>

                        <HStack gap={3} mt={4}>
                          <Button
                            type="submit"
                            colorPalette="brand"
                            loading={isSavingEndereco}
                            loadingText="Salvando..."
                          >
                            Salvar endereço
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setMostrarFormNovoEndereco(false)}
                          >
                            Cancelar
                          </Button>
                        </HStack>
                      </form>
                    </Box>
                  )}

                  <Separator />

                  <Button
                    colorPalette="brand"
                    alignSelf="end"
                    disabled={!enderecoSelecionadoId}
                    onClick={() => setStep("pagamento")}
                  >
                    Continuar para pagamento
                  </Button>
                </VStack>
              )}

              {step === "pagamento" && (
                <VStack align="stretch" gap={5}>
                  <Heading size="md">Pagamento</Heading>

                  <HStack gap={3}>
                    <Button
                      variant={metodo === "cartao" ? "solid" : "outline"}
                      colorPalette="brand"
                      onClick={() => setMetodo("cartao")}
                    >
                      Cartão de Crédito
                    </Button>
                    <Button
                      variant={metodo === "pix" ? "solid" : "outline"}
                      colorPalette="brand"
                      onClick={() => setMetodo("pix")}
                    >
                      Pix
                    </Button>
                  </HStack>

                  {metodo === "cartao" && (
                    <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
                      <GridItem colSpan={{ base: 1, md: 2 }}>
                        <Field.Root required>
                          <Field.Label>Número do Cartão</Field.Label>
                          <Input
                            name="numero"
                            value={cartaoData.numero}
                            onChange={handleChangeCartao}
                            placeholder="0000 0000 0000 0000"
                            maxLength={19}
                          />
                        </Field.Root>
                      </GridItem>
                      <GridItem colSpan={{ base: 1, md: 2 }}>
                        <Field.Root required>
                          <Field.Label>Nome impresso no cartão</Field.Label>
                          <Input
                            name="nomeImpresso"
                            value={cartaoData.nomeImpresso}
                            onChange={handleChangeCartao}
                            placeholder="Como está no cartão"
                          />
                        </Field.Root>
                      </GridItem>
                      <GridItem colSpan={1}>
                        <Field.Root required>
                          <Field.Label>Validade</Field.Label>
                          <Input
                            name="validade"
                            value={cartaoData.validade}
                            onChange={handleChangeCartao}
                            placeholder="MM/AA"
                            maxLength={5}
                          />
                        </Field.Root>
                      </GridItem>
                      <GridItem colSpan={1}>
                        <Field.Root required>
                          <Field.Label>CVV</Field.Label>
                          <Input
                            name="cvv"
                            value={cartaoData.cvv}
                            onChange={handleChangeCartao}
                            placeholder="123"
                            maxLength={4}
                          />
                        </Field.Root>
                      </GridItem>
                    </Grid>
                  )}

                  {metodo === "pix" && (
                    <Box bg="gray.50" p={4} rounded="md" border="1px dashed" borderColor="gray.300">
                      <Text fontSize="sm" color="gray.600">
                        Pagamento via Pix simulado — ao confirmar o pedido, o pagamento será
                        considerado aprovado automaticamente.
                      </Text>
                    </Box>
                  )}

                  {confirmError && (
                    <Text color="red.500" fontSize="sm">
                      {confirmError}
                    </Text>
                  )}

                  <HStack justify="space-between">
                    <Button variant="ghost" onClick={() => setStep("endereco")}>
                      Voltar
                    </Button>
                    <Button
                      colorPalette="brand"
                      loading={isConfirming}
                      loadingText="Confirmando..."
                      onClick={handleConfirmarPedido}
                    >
                      Confirmar Pedido
                    </Button>
                  </HStack>
                </VStack>
              )}
            </Box>
          </GridItem>

          <GridItem>
            <Box bg="white" p={6} rounded="lg" shadow="sm" border="1px solid" borderColor="gray.200">
              <Heading size="sm" mb={4}>
                Resumo do Pedido
              </Heading>
              <VStack align="stretch" gap={3}>
                {items.map((item) => (
                  <HStack key={item.product.id} justify="space-between">
                    <Text fontSize="sm" lineClamp={1}>
                      {item.product.titulo} x{item.quantity}
                    </Text>
                    <Text fontSize="sm" fontWeight="semibold">
                      R$ {(item.product.preco * item.quantity).toFixed(2)}
                    </Text>
                  </HStack>
                ))}
              </VStack>
              <Separator my={4} />
              <HStack justify="space-between">
                <Text fontWeight="bold">Total</Text>
                <Text fontWeight="bold" color="brand.600">
                  R$ {totalPrice().toFixed(2)}
                </Text>
              </HStack>
            </Box>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
}
