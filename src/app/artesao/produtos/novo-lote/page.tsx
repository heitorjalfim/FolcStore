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
import { FiArrowLeft, FiCheck, FiEye, FiTruck, FiShield, FiAlertCircle } from 'react-icons/fi';
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

  // Estados de validação granular (PI4-93, PI4-94, PI4-95)
  const [erros, setErros] = useState<Record<string, string>>({});
  const [carregando, setCarregando] = useState(false);

  const validarFormulario = () => {
    const novosErros: Record<string, string> = {};

    if (!titulo.trim()) {
      novosErros.titulo = 'O título do lote é obrigatório.';
    }

    if (!descricao.trim()) {
      novosErros.descricao = 'A história e significado cultural são obrigatórios.';
    }

    // PI4-95: Validação de preço
    const precoNum = parseFloat(preco.replace(',', '.'));
    if (!preco || isNaN(precoNum) || precoNum <= 0) {
      novosErros.preco = 'Informe um preço válido maior que zero (R$ > 0,00).';
    }

    // PI4-93: Validação de estoque inicial (inteiro >= 1)
    const estoqueNum = Number(quantidadeEstoque);
    if (!quantidadeEstoque || isNaN(estoqueNum) || estoqueNum < 1 || !Number.isInteger(estoqueNum)) {
      novosErros.quantidadeEstoque = 'O estoque de lote deve ser um número inteiro de no mínimo 1 peça.';
    }

    // PI4-94: Validação de prazo de produção (inteiro >= 0)
    const prazoNum = Number(prazoProducao);
    if (prazoProducao === '' || isNaN(prazoNum) || prazoNum < 0 || !Number.isInteger(prazoNum)) {
      novosErros.prazoProducao = 'O prazo de produção deve ser de 0 (pronta entrega) ou mais dias úteis.';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    try {
      setCarregando(true);

      const listaImagens = [urlFotoPrincipal.trim(), fotoAdicional1.trim()].filter(Boolean);
      const skuFinal = sku.trim() || `LOT-${Date.now().toString().slice(-4)}`;

      // PI4-95: Contrato estrito com tipo: 'lote'
      const payload: CriarProdutoDTO = {
        sku: skuFinal,
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        materiaPrima: materiaPrima.trim() || 'Argila regional cozida',
        tecnica: tecnica.trim() || 'Torno cerâmico e queima a lenha',
        regiaoProducao: regiaoProducao.trim() || artesao?.regiaoProducao || 'Caruaru, PE',
        categoria,
        preco: parseFloat(preco.replace(',', '.')),
        tipo: 'lote',
        quantidadeEstoque: parseInt(quantidadeEstoque, 10),
        prazoProducao: parseInt(prazoProducao, 10),
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
      console.error('Erro ao cadastrar lote:', err);
      setErros({ api: 'Falha ao registrar lote na API. Verifique a conexão com o servidor local.' });
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
            HU-89 (PI4-92 a PI4-95): Cadastro em Lote
          </Badge>
        </HStack>

        <Grid templateColumns={{ base: '1fr', lg: '240px 1fr 300px' }} gap={6} alignItems="start">
          
          {/* Stepper lateral */}
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
                <Text>4. Materiais & Dimensões</Text>
              </HStack>
              <HStack gap={2.5} color="gray.500">
                <Box p={1} bg="gray.100" borderRadius="full">
                  <FiCheck size={14} />
                </Box>
                <Text>5. Preço & Estoque</Text>
              </HStack>
            </VStack>
          </Box>

          {/* Formulário Central */}
          <Box as="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={6}>
            {erros.api && (
              <Box bg="red.50" borderColor="red.200" borderWidth="1px" p={4} borderRadius="lg">
                <HStack gap={2} color="red.600">
                  <FiAlertCircle />
                  <Text fontSize="sm" fontWeight="semibold">{erros.api}</Text>
                </HStack>
              </Box>
            )}

            {/* 1. Informações Básicas */}
            <Box bg="white" p={6} borderRadius="xl" borderWidth="1px" borderColor="gray.200">
              <Heading size="sm" mb={4} color="gray.800">
                1. Informações Básicas
              </Heading>

              <VStack gap={4} align="stretch">
                <Field.Root invalid={!!erros.titulo} required>
                  <Field.Label>Título do Lote de Produtos</Field.Label>
                  <Input
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Ex: Tigela Cerâmica Vitrificada Massapê"
                    bg="white"
                  />
                  {erros.titulo && (
                    <Text color="red.500" fontSize="2xs" mt={1}>{erros.titulo}</Text>
                  )}
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

            {/* 2. Fotos da Peça */}
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

            {/* 3. História Cultural & Descrição */}
            <Box bg="white" p={6} borderRadius="xl" borderWidth="1px" borderColor="gray.200">
              <Heading size="sm" mb={1} color="gray.800">
                3. História e Significado Cultural *
              </Heading>
              <Text fontSize="xs" color="gray.500" mb={4}>
                Descreva a narrativa, técnica e tradição transmitida através desta produção.
              </Text>
              <Field.Root invalid={!!erros.descricao} required>
                <Textarea
                  rows={4}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Linha de utensílios utilitários inspirados nos traços artesanais de Caruaru..."
                  bg="white"
                />
                {erros.descricao && (
                  <Text color="red.500" fontSize="2xs" mt={1}>{erros.descricao}</Text>
                )}
              </Field.Root>
            </Box>

            {/* 4. Materiais e Dimensões */}
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

            {/* 5. Preço, Estoque & Produção (PI4-93, PI4-94, PI4-95) */}
            <Box bg="white" p={6} borderRadius="xl" borderWidth="1px" borderColor="gray.200">
              <Heading size="sm" mb={4} color="gray.800">
                5. Preço, Estoque & Produção
              </Heading>

              <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={4}>
                {/* PI4-95: Preço */}
                <Field.Root invalid={!!erros.preco} required>
                  <Field.Label>Preço Unitário (R$)</Field.Label>
                  <Input
                    value={preco}
                    onChange={(e) => setPreco(e.target.value)}
                    placeholder="75.00"
                    fontWeight="bold"
                    bg="white"
                  />
                  {erros.preco && (
                    <Text color="red.500" fontSize="2xs" mt={1}>{erros.preco}</Text>
                  )}
                </Field.Root>

                {/* PI4-93: Estoque inicial em Lote */}
                <Field.Root invalid={!!erros.quantidadeEstoque} required>
                  <Field.Label>Estoque Inicial</Field.Label>
                  <Input
                    type="number"
                    min="1"
                    step="1"
                    value={quantidadeEstoque}
                    onChange={(e) => setQuantidadeEstoque(e.target.value)}
                    placeholder="25"
                    fontWeight="bold"
                    bg="white"
                  />
                  {erros.quantidadeEstoque && (
                    <Text color="red.500" fontSize="2xs" mt={1}>{erros.quantidadeEstoque}</Text>
                  )}
                </Field.Root>

                {/* PI4-94: Prazo de produção */}
                <Field.Root invalid={!!erros.prazoProducao} required>
                  <Field.Label>Prazo Produção (dias)</Field.Label>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    value={prazoProducao}
                    onChange={(e) => setPrazoProducao(e.target.value)}
                    placeholder="7"
                    bg="white"
                  />
                  {erros.prazoProducao && (
                    <Text color="red.500" fontSize="2xs" mt={1}>{erros.prazoProducao}</Text>
                  )}
                </Field.Root>

                {/* SKU */}
                <Field.Root>
                  <Field.Label>SKU (Opcional)</Field.Label>
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

          {/* Coluna Direita: Live Preview Reativo (PI4-94) */}
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

              {/* PI4-94: Reatividade do prazo */}
              <VStack align="start" gap={2} pt={4} mt={3} borderTopWidth="1px" borderColor="gray.100" fontSize="2xs" color="gray.500">
                <HStack gap={2}>
                  <FiTruck color="#C25E2E" />
                  <Text>
                    {prazoProducao === '0'
                      ? 'Pronta entrega: enviado em até 24h úteis'
                      : `Prazo de produção e postagem: ${prazoProducao || 0} dias úteis`}
                  </Text>
                </HStack>
                <HStack gap={2}>
                  <FiShield color="#38A169" />
                  <Text>Garantia de autenticidade artesanal de Pernambuco.</Text>
                </HStack>
              </VStack>
            </Card.Root>
          </Box>
        </Grid>
      </Container>
    </Box>
  );
}