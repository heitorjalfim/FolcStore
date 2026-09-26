'use client';

import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import {
  Box,
  Flex,
  Grid,
  Text,
  Badge,
  Image,
  Input,
  Textarea,
  Button,
  Field,
  Container,
  Heading,
  HStack,
  VStack,
  Card,
  Spinner,
  Dialog,
  Portal,
} from '@chakra-ui/react';
import { FiPlus, FiEdit, FiExternalLink, FiPackage, FiArrowLeft, FiAlertCircle } from 'react-icons/fi';
import { productService } from '@/services/productService';
import { sessionStore } from '@/store/sessionStore';
import { Produto } from '@/types/product';

function createSlug(titulo: string) {
  return titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export default function GerenciarCatalogoPage() {
  const artesao = sessionStore((state) => state.artesao);

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  // Estados de edição modal (PI4-129)
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);
  const [precoEdit, setPrecoEdit] = useState('');
  const [descricaoEdit, setDescricaoEdit] = useState('');
  const [erroPreco, setErroPreco] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    let ativo = true;

    async function carregarDados() {
      try {
        const dados = await productService.getAll();
        if (ativo) {
          const filtrados = artesao?.id
            ? dados.filter((p) => String(p.idArtesao) === String(artesao.id))
            : dados;
          setProdutos(filtrados.length > 0 ? filtrados : dados);
        }
      } catch (error) {
        console.error('Erro ao carregar catálogo:', error);
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregarDados();
    return () => {
      ativo = false;
    };
  }, [artesao]);

  // Validação em tempo real de preço (PI4-130)
  const validarPreco = (valor: string): boolean => {
    const valorTratado = valor.replace(',', '.').trim();
    const num = parseFloat(valorTratado);

    if (!valorTratado || isNaN(num)) {
      setErroPreco('Informe um valor numérico válido.');
      return false;
    }
    if (num <= 0) {
      setErroPreco('O preço deve ser estritamente maior que zero (R$ > 0,00).');
      return false;
    }

    setErroPreco(null);
    return true;
  };

  // Abertura do modal com dados pré-preenchidos (PI4-128 & PI4-129)
  const handleAbrirEdicao = (prod: Produto) => {
    setProdutoEditando(prod);
    setPrecoEdit(prod.preco.toString());
    setDescricaoEdit(prod.descricao || '');
    setErroPreco(null);
    setModalAberto(true);
  };

  // Submissão PATCH parcial e atualização da listagem em tempo real (PI4-129 & PI4-130)
  const handleSalvarEdicao = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarPreco(precoEdit) || !produtoEditando) {
      return;
    }

    try {
      setSalvando(true);
      const novoPreco = parseFloat(precoEdit.replace(',', '.'));

      const atualizado = await productService.update(produtoEditando.id, {
        preco: novoPreco,
        descricao: descricaoEdit.trim(),
      });

      // Atualização imediata do estado local sem recarregar a tela
      setProdutos((lista) =>
        lista.map((item) => (String(item.id) === String(atualizado.id) ? { ...item, ...atualizado } : item))
      );

      setModalAberto(false);
      setProdutoEditando(null);
    } catch (error) {
      console.error('Erro ao salvar edição:', error);
      setErroPreco('Não foi possível salvar as alterações na API.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Box minH="100vh" bg="gray.50" py={8}>
      <Container maxW="1200px">
        {/* Cabeçalho do Catálogo */}
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ md: 'center' }} gap={4} mb={8}>
          <Box>
            <HStack gap={3} mb={1}>
              <NextLink href="/artesao">
                <Button variant="ghost" size="sm">
                  <HStack gap={2}>
                    <FiArrowLeft />
                    <Text>Painel</Text>
                  </HStack>
                </Button>
              </NextLink>
              <Heading size="lg" color="gray.900">
                Gerenciar Catálogo
              </Heading>
              
            </HStack>
            <Text fontSize="xs" color="gray.600">
              Painel de manutenção de preços, descrições e estoque das peças artesanais cadastradas.
            </Text>
          </Box>

          <HStack gap={3}>
            <NextLink href="/artesao/produtos/novo-unico">
              <Button colorPalette="brand" size="sm">
                <HStack gap={1.5}>
                  <FiPlus />
                  <Text>Peça Única</Text>
                </HStack>
              </Button>
            </NextLink>

            <NextLink href="/artesao/produtos/novo-lote">
              <Button variant="outline" colorPalette="brand" size="sm">
                <HStack gap={1.5}>
                  <FiPlus />
                  <Text>Nova Peça / Lote</Text>
                </HStack>
              </Button>
            </NextLink>
          </HStack>
        </Flex>

        {/* Listagem do Catálogo */}
        {carregando ? (
          <Flex justify="center" py={20}>
            <Spinner size="xl" color="brand.500" />
          </Flex>
        ) : produtos.length === 0 ? (
          <Box bg="white" p={12} borderRadius="xl" borderWidth="1px" borderColor="gray.200" textAlign="center">
            <FiPackage size={44} style={{ margin: '0 auto 12px auto', color: '#A0AEC0' }} />
            <Heading size="md" color="gray.700" mb={1}>
              Nenhum produto cadastrado no catálogo.
            </Heading>
            <Text fontSize="sm" color="gray.500" mb={4}>
              Cadastre sua primeira peça única ou lote para começar a gerenciar sua loja.
            </Text>
          </Box>
        ) : (
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
            {produtos.map((prod) => {
              const foto = prod.galeriaImagens?.[0] || prod.linkImagens?.[0] || prod.imagem || 'https://picsum.photos/400/300';
              const productUrl = `/product/${createSlug(prod.titulo)}-${prod.id}`;

              return (
                <Card.Root
                  key={prod.id}
                  bg="white"
                  borderWidth="1px"
                  borderColor="gray.200"
                  borderRadius="xl"
                  overflow="hidden"
                  shadow="sm"
                  transition="all 0.2s"
                  _hover={{ shadow: 'md' }}
                >
                  <Box position="relative" w="full" h="200px" bg="gray.100" overflow="hidden">
                    <Image src={foto} alt={prod.titulo} w="full" h="full" objectFit="cover" />
                    <Badge
                      position="absolute"
                      top={3}
                      left={3}
                      bg="whiteAlpha.900"
                      color="gray.800"
                      fontSize="2xs"
                      px={2}
                      py={0.5}
                      borderRadius="md"
                    >
                      {prod.tipo === 'unico' ? 'Peça Única' : 'Lote'}
                    </Badge>
                    <Badge
                      position="absolute"
                      top={3}
                      right={3}
                      colorPalette={prod.ativo !== false ? 'green' : 'gray'}
                      fontSize="2xs"
                      borderRadius="md"
                    >
                      {prod.ativo !== false ? 'Ativo' : 'Pausado'}
                    </Badge>
                  </Box>

                  <Box p={5} display="flex" flexDirection="column" flex="1">
                    <Text fontSize="2xs" color="gray.400" fontWeight="bold" textTransform="uppercase" mb={1}>
                      SKU: {prod.sku || prod.id}
                    </Text>
                    <Text fontSize="sm" fontWeight="bold" color="gray.900" lineClamp={1} mb={1}>
                      {prod.titulo}
                    </Text>
                    <Text fontSize="xs" color="gray.600" lineClamp={2} mb={4}>
                      {prod.descricao || 'Sem descrição cadastrada.'}
                    </Text>

                    <Flex justify="space-between" align="baseline" pt={3} borderTopWidth="1px" borderColor="gray.100" mt="auto">
                      <Box>
                        <Text fontSize="2xs" color="gray.400" fontWeight="bold">
                          PREÇO ATUAL
                        </Text>
                        <Text fontSize="md" fontWeight="bold" color="brand.600">
                          R$ {Number(prod.preco || 0).toFixed(2)}
                        </Text>
                      </Box>
                      <Text fontSize="xs" color="gray.500">
                        Estoque: <strong>{prod.quantidadeEstoque} un.</strong>
                      </Text>
                    </Flex>

                    {/* Ações Rápidas (PI4-128) */}
                    <HStack gap={2} mt={4}>
                      <Button
                        variant="outline"
                        colorPalette="brand"
                        size="sm"
                        flex={1}
                        onClick={() => handleAbrirEdicao(prod)}
                      >
                        <HStack gap={1.5}>
                          <FiEdit size={13} />
                          <Text>Editar</Text>
                        </HStack>
                      </Button>

                      {/* Link direto para a vitrine pública em nova aba */}
                      <NextLink href={productUrl} target="_blank">
                        <Button variant="ghost" size="sm" aria-label="Ver na vitrine pública">
                          <FiExternalLink size={14} />
                        </Button>
                      </NextLink>
                    </HStack>
                  </Box>
                </Card.Root>
              );
            })}
          </Grid>
        )}

        {/* Modal de Manutenção e Edição Rápida (PI4-129 & PI4-130) */}
        <Dialog.Root open={modalAberto} onOpenChange={(e) => !e.open && setModalAberto(false)}>
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content as="form" onSubmit={handleSalvarEdicao}>
                <Dialog.Header>
                  <Dialog.Title>Editar Produto — {produtoEditando?.titulo}</Dialog.Title>
                </Dialog.Header>

                <Dialog.Body>
                  <VStack gap={4} align="stretch">
                    <Box p={3} bg="amber.50" borderRadius="md" borderWidth="1px" borderColor="amber.200">
                      <HStack gap={2} color="amber.900" fontSize="xs">
                        <FiAlertCircle size={16} />
                        <Text>
                          Alterações de preço e descrição entram em vigor imediatamente na vitrine pública via atualização parcial (PATCH).
                        </Text>
                      </HStack>
                    </Box>

                    {/* Validação estrita de preço em tempo real (PI4-130) */}
                    <Field.Root invalid={!!erroPreco} required>
                      <Field.Label>Preço (R$)</Field.Label>
                      <Input
                        value={precoEdit}
                        onChange={(e) => {
                          setPrecoEdit(e.target.value);
                          validarPreco(e.target.value);
                        }}
                        placeholder="Ex: 140.00"
                        bg="white"
                      />
                      {erroPreco && (
                        <Text color="red.500" fontSize="2xs" mt={1}>
                          {erroPreco}
                        </Text>
                      )}
                    </Field.Root>

                    {/* Edição da história e descrição cultural (PI4-129) */}
                    <Field.Root>
                      <Field.Label>História & Descrição Cultural</Field.Label>
                      <Textarea
                        rows={4}
                        value={descricaoEdit}
                        onChange={(e) => setDescricaoEdit(e.target.value)}
                        placeholder="Descreva a história e técnicas da peça..."
                        bg="white"
                      />
                    </Field.Root>
                  </VStack>
                </Dialog.Body>

                <Dialog.Footer>
                  <Button variant="ghost" size="sm" onClick={() => setModalAberto(false)} disabled={salvando}>
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    colorPalette="brand"
                    size="sm"
                    loading={salvando}
                    disabled={!!erroPreco || !precoEdit}
                  >
                    Salvar Alterações
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