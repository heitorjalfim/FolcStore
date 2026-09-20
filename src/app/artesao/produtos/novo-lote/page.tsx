'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Text,
  Input,
  Textarea,
  Button,
  Field,
  Badge,
  Container,
  Heading,
  Image,
  VStack,
  HStack,
  Card,
} from '@chakra-ui/react';
import { FiArrowLeft, FiCheck, FiEye, FiTruck, FiShield } from 'react-icons/fi';
import { productService } from '@/services/productService';
import { sessionStore } from '@/store/sessionStore';
import { CriarProdutoDTO } from '@/types/product';

export default function NovoProdutoLotePage() {
  const router = useRouter();
  const artesao = sessionStore((state) => state.artesao);

  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('Cerâmica Tradicional');
  const [regiaoProducao, setRegiaoProducao] = useState(artesao?.regiaoProducao || 'Caruaru, PE');
  const [nomeArtesao, setNomeArtesao] = useState(artesao?.nome || '');
  const [descricao, setDescricao] = useState('');
  const [materiaPrima, setMateriaPrima] = useState('');
  const [tecnica, setTecnica] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidadeEstoque, setQuantidadeEstoque] = useState('');
  const [prazoProducao, setPrazoProducao] = useState('5');
  const [sku, setSku] = useState('');
  const [guiaCuidados, setGuiaCuidados] = useState('');
  const [urlFotoPrincipal, setUrlFotoPrincipal] = useState(
    'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80'
  );
  const [fotoAdicional1, setFotoAdicional1] = useState('');

  const [altura, setAltura] = useState('');
  const [largura, setLargura] = useState('');
  const [profundidade, setProfundidade] = useState('');
  const [peso, setPeso] = useState('');

  const [erroValidacao, setErroValidacao] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErroValidacao(null);

    if (!titulo.trim()) {
      setErroValidacao('O título do lote é obrigatório.');
      return;
    }
    if (!descricao.trim()) {
      setErroValidacao('A história e significado cultural são obrigatórios.');
      return;
    }
    const precoNum = parseFloat(preco.replace(',', '.'));
    if (!preco || isNaN(precoNum) || precoNum <= 0) {
      setErroValidacao('Informe um preço unitário válido.');
      return;
    }
    const estoqueNum = parseInt(quantidadeEstoque, 10);
    if (!quantidadeEstoque || isNaN(estoqueNum) || estoqueNum < 1) {
      setErroValidacao('Para lotes, o estoque inicial deve ser de pelo menos 1 peça.');
      return;
    }

    try {
      setCarregando(true);

      const listaImagens = [urlFotoPrincipal.trim(), fotoAdicional1.trim()].filter(Boolean);

      const payload: CriarProdutoDTO = {
        sku: sku.trim() || `LOT-${Date.now().toString().slice(-4)}`,
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        materiaPrima: materiaPrima.trim() || 'Argila regional cozida',
        tecnica: tecnica.trim() || 'Torno cerâmico e queima a lenha',
        regiaoProducao: regiaoProducao.trim() || artesao?.regiaoProducao || 'Caruaru, PE',
        categoria,
        preco: precoNum,
        tipo: 'lote',
        quantidadeEstoque: estoqueNum,
        prazoProducao: parseInt(prazoProducao, 10) || 0,
        idArtesao: artesao?.id || 'e1eK141d4u70m471c4m3n73',
        nomeArtesao: nomeArtesao.trim() || artesao?.nome || 'Severino Vitalino',
        dimensoes: {
          altura: parseFloat(altura) || 12,
          largura: parseFloat(largura) || 20,
          profundidade: parseFloat(profundidade) || 20,
          peso: parseFloat(peso) || 0.7,
        },
        guiaCuidados: guiaCuidados.trim() || 'Lavar com esponja macia e sabão neutro.',
        galeriaImagens: listaImagens,
        ativo: true,
      };

      await productService.create(payload);
      router.push('/artesao/produtos');
    } catch (err) {
      console.error(err);
      setErroValidacao('Falha ao registrar lote na API. Verifique se o servidor está ativo.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Box minH="100vh" bg="gray.50" py={8}>
      <Container maxW="1200px">
        <HStack justify="space-between" mb={6}>
          <NextLink href="/artesao/produtos">
            <Button variant="ghost" size="sm">
              <HStack gap={2}>
                <FiArrowLeft />
                <Text>Voltar ao Catálogo</Text>
              </HStack>
            </Button>
          </NextLink>

          <Badge colorPalette="brand" size="lg" px={3} py={1}>
            HU-89: Cadastro em Lote
          </Badge>
        </HStack>

        <Grid templateColumns={{ base: '1fr', lg: '240px 1fr 300px' }} gap={6} alignItems="start">
          <Box bg="white" p={5} borderRadius="xl" borderWidth="1px" borderColor="gray.200">
            <Text fontWeight="bold" fontSize="sm" color="gray.900" mb={1}>
              Cadastro em Lote
            </Text>
            <Text fontSize="xs" color="gray.500" mb={6}>
              Peças seriadas com estoque variável e prazo de confecção.
            </Text>

            <VStack align="stretch" gap={4} fontSize="xs">
              <HStack gap={2.5} color="brand.600" fontWeight="bold">
                <Box p={1} bg="brand.50" borderRadius="full">
                  <FiCheck size={14} />
                </Box>
                <Text>1. Informações Básicas</Text>
              </HStack>
              <HStack gap={2.5} color="gray.500">
                <Box p={1} bg="gray.100" borderRadius="full">
                  <FiCheck size={14} />
                </Box>
                <Text>2. Imagens</Text>
              </HStack>
              <HStack gap={2.5} color="gray.500">
                <Box p={1} bg="gray.100" borderRadius="full">
                  <FiCheck size={14} />
                </Box>
                <Text>3. História Cultural</Text>
              </HStack>
              <HStack gap={2.5} color="gray.500">
                <Box p={1} bg="gray.100" borderRadius="full">
                  <FiCheck size={14} />
                </Box>
                <Text>4. Materiais & Medidas</Text>
              </HStack>
              <HStack gap={2.5} color="gray.500">
                <Box p={1} bg="gray.100" borderRadius="full">
                  <FiCheck size={14} />
                </Box>
                <Text>5. Preço & Estoque</Text>
              </HStack>
            </VStack>
          </Box>

          <Box as="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={6}>
            {erroValidacao && (
              <Box bg="red.50" borderColor="red.200" borderWidth="1px" p={4} borderRadius="lg">
                <Text color="red.600" fontSize="sm" fontWeight="semibold">
                  {erroValidacao}
                </Text>
              </Box>
            )}

            <Box bg="white" p={6} borderRadius="xl" borderWidth="1px" borderColor="gray.200">
              <Heading size="sm" mb={4} color="gray.800">
                1. Informações Básicas
              </Heading>

              <VStack gap={4} align="stretch">
                <Field.Root required>
                  <Field.Label>Título do Lote de Produtos</Field.Label>
                  <Input
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Ex: Tigela Cerâmica Vitrificada Massapê"
                    bg="white"
                  />
                </Field.Root>

                <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                  <GridItem>
                    <Field.Root required>
                      <Field.Label>Categoria</Field.Label>
                      <select
                        value={categoria}
                        onChange={(e) => setCategoria(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: '1px solid #E2E8F0',
                          backgroundColor: 'white',
                          fontSize: '14px',
                        }}
                      >
                        <option value="Cerâmica Tradicional">Cerâmica Tradicional</option>
                        <option value="Madeira e Xilogravura">Madeira e Xilogravura</option>
                        <option value="Fibras Naturais">Fibras Naturais</option>
                        <option value="Rendas e Bordados">Rendas e Bordados</option>
                        <option value="Utilidades Domésticas">Utilidades Domésticas</option>
                      </select>
                    </Field.Root>
                  </GridItem>

                  <GridItem>
                    <Field.Root required>
                      <Field.Label>Polo Regional</Field.Label>
                      <Input
                        value={regiaoProducao}
                        onChange={(e) => setRegiaoProducao(e.target.value)}
                        placeholder="Ex: Caruaru, PE"
                        bg="white"
                      />
                    </Field.Root>
                  </GridItem>
                </Grid>

                <Field.Root required>
                  <Field.Label>Nome do Artesão Responsável</Field.Label>
                  <Input
                    value={nomeArtesao}
                    onChange={(e) => setNomeArtesao(e.target.value)}
                    placeholder={artesao?.nome || 'Severino Vitalino'}
                    bg="white"
                  />
                </Field.Root>
              </VStack>
            </Box>

            <Box bg="white" p={6} borderRadius="xl" borderWidth="1px" borderColor="gray.200">
              <Heading size="sm" mb={4} color="gray.800">
                2. Imagens da Peça
              </Heading>
              <VStack gap={4} align="stretch">
                <Field.Root required>
                  <Field.Label>URL da Imagem Principal</Field.Label>
                  <Input
                    value={urlFotoPrincipal}
                    onChange={(e) => setUrlFotoPrincipal(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    bg="white"
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>URL de Imagem Adicional (Opcional)</Field.Label>
                  <Input
                    value={fotoAdicional1}
                    onChange={(e) => setFotoAdicional1(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    bg="white"
                  />
                </Field.Root>
              </VStack>
            </Box>

            <Box bg="white" p={6} borderRadius="xl" borderWidth="1px" borderColor="gray.200">
              <Heading size="sm" mb={1} color="gray.800">
                3. História e Significado Cultural *
              </Heading>
              <Text fontSize="xs" color="gray.500" mb={4}>
                Descreva a narrativa, técnica e tradição transmitida através desta produção.
              </Text>
              <Field.Root required>
                <Textarea
                  rows={4}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Linha de utensílios utilitários inspirados nos traços artesanais de Caruaru..."
                  bg="white"
                />
              </Field.Root>
            </Box>

            <Box bg="white" p={6} borderRadius="xl" borderWidth="1px" borderColor="gray.200">
              <Heading size="sm" mb={4} color="gray.800">
                4. Especificações Técnicas
              </Heading>

              <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4} mb={4}>
                <Field.Root>
                  <Field.Label>Matéria-Prima</Field.Label>
                  <Input
                    value={materiaPrima}
                    onChange={(e) => setMateriaPrima(e.target.value)}
                    placeholder="Ex: Argila regional e esmalte fosco"
                    bg="white"
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Técnica Empregada</Field.Label>
                  <Input
                    value={tecnica}
                    onChange={(e) => setTecnica(e.target.value)}
                    placeholder="Ex: Torno cerâmico e queima a lenha"
                    bg="white"
                  />
                </Field.Root>
              </Grid>

              <Grid templateColumns="repeat(4, 1fr)" gap={3} mb={4}>
                <Field.Root>
                  <Field.Label>Alt. (cm)</Field.Label>
                  <Input
                    type="number"
                    value={altura}
                    onChange={(e) => setAltura(e.target.value)}
                    placeholder="12"
                    bg="white"
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Larg. (cm)</Field.Label>
                  <Input
                    type="number"
                    value={largura}
                    onChange={(e) => setLargura(e.target.value)}
                    placeholder="20"
                    bg="white"
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Prof. (cm)</Field.Label>
                  <Input
                    type="number"
                    value={profundidade}
                    onChange={(e) => setProfundidade(e.target.value)}
                    placeholder="20"
                    bg="white"
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Peso (kg)</Field.Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={peso}
                    onChange={(e) => setPeso(e.target.value)}
                    placeholder="0.7"
                    bg="white"
                  />
                </Field.Root>
              </Grid>

              <Field.Root>
                <Field.Label>Instruções de Cuidados</Field.Label>
                <Input
                  value={guiaCuidados}
                  onChange={(e) => setGuiaCuidados(e.target.value)}
                  placeholder="Ex: Pode ir ao micro-ondas. Lavar com esponja macia."
                  bg="white"
                />
              </Field.Root>
            </Box>

            <Box bg="white" p={6} borderRadius="xl" borderWidth="1px" borderColor="gray.200">
              <Heading size="sm" mb={4} color="gray.800">
                5. Preço, Estoque & Produção
              </Heading>

              <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={4}>
                <Field.Root required>
                  <Field.Label>Preço Unitário (R$)</Field.Label>
                  <Input
                    value={preco}
                    onChange={(e) => setPreco(e.target.value)}
                    placeholder="75.00"
                    fontWeight="bold"
                    bg="white"
                  />
                </Field.Root>

                <Field.Root required>
                  <Field.Label>Estoque Inicial</Field.Label>
                  <Input
                    type="number"
                    min="1"
                    value={quantidadeEstoque}
                    onChange={(e) => setQuantidadeEstoque(e.target.value)}
                    placeholder="25"
                    fontWeight="bold"
                    bg="white"
                  />
                </Field.Root>

                <Field.Root required>
                  <Field.Label>Prazo Produção (dias)</Field.Label>
                  <Input
                    type="number"
                    min="0"
                    value={prazoProducao}
                    onChange={(e) => setPrazoProducao(e.target.value)}
                    placeholder="7"
                    bg="white"
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>SKU</Field.Label>
                  <Input
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="LOT-101"
                    bg="white"
                  />
                </Field.Root>
              </Grid>
            </Box>

            <Flex justify="flex-end" pt={2}>
              <Button
                type="submit"
                colorPalette="brand"
                size="lg"
                loading={carregando}
                loadingText="Publicando lote..."
                px={8}
              >
                Publicar Peça em Lote
              </Button>
            </Flex>
          </Box>

          <Box position="sticky" top="20px">
            <Card.Root bg="white" p={4} borderRadius="xl" borderWidth="1px" borderColor="gray.200" shadow="sm">
              <HStack justify="space-between" mb={3}>
                <HStack gap={1.5} color="gray.800" fontWeight="bold" fontSize="xs">
                  <FiEye size={14} />
                  <Text>Pré-visualização</Text>
                </HStack>
                <Badge colorPalette="brand" fontSize="2xs">
                  Lote
                </Badge>
              </HStack>

              <Box borderRadius="lg" overflow="hidden" mb={3} h="180px" bg="gray.100">
                <Image
                  src={urlFotoPrincipal || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80'}
                  alt="Preview"
                  w="full"
                  h="full"
                  objectFit="cover"
                />
              </Box>

              <Text fontSize="xs" color="gray.500" mb={1}>
                {regiaoProducao}
              </Text>
              <Text fontWeight="bold" fontSize="md" color="gray.900" lineClamp={1}>
                {titulo || 'Título do Produto'}
              </Text>
              <Text fontSize="xs" color="gray.600" mb={3}>
                Por {nomeArtesao.trim() || artesao?.nome || 'Mestre Artesão'}
              </Text>

              <HStack justify="space-between" pt={2} borderTopWidth="1px" borderColor="gray.100">
                <Text fontWeight="bold" fontSize="lg" color="brand.600">
                  R$ {preco ? Number(preco.replace(',', '.')).toFixed(2) : '0.00'}
                </Text>
                <Badge colorPalette="green" fontSize="2xs">
                  {quantidadeEstoque ? `${quantidadeEstoque} un. em lote` : 'Em lote'}
                </Badge>
              </HStack>

              <VStack align="start" gap={2} pt={4} mt={3} borderTopWidth="1px" borderColor="gray.100" fontSize="2xs" color="gray.500">
                <HStack gap={2}>
                  <FiTruck color="#C25E2E" />
                  <Text>
                    {prazoProducao === '0' || prazoProducao === ''
                      ? 'Pronta entrega'
                      : `Produção: ${prazoProducao} dias úteis`}
                  </Text>
                </HStack>
                <HStack gap={2}>
                  <FiShield color="#38A169" />
                  <Text>Autenticidade artesanal de Pernambuco.</Text>
                </HStack>
              </VStack>
            </Card.Root>
          </Box>
        </Grid>
      </Container>
    </Box>
  );
}