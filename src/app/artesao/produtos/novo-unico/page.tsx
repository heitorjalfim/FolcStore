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
import { FiArrowLeft, FiCheck, FiLock, FiEye, FiTrendingUp } from 'react-icons/fi';
import { productService } from '@/services/productService';
import { sessionStore } from '@/store/sessionStore';
import { CriarProdutoDTO } from '@/types/product';

export default function NovoProdutoUnicoPage() {
  const router = useRouter();

  const artesao = sessionStore((state) => state.artesao);

  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('Cerâmica');
  const [regiaoProducao, setRegiaoProducao] = useState(artesao?.regiaoProducao || 'Caruaru, PE');
  const [nomeArtesao, setNomeArtesao] = useState(artesao?.nome || '');
  const [descricao, setDescricao] = useState('');
  const [materiaPrima, setMateriaPrima] = useState('');
  const [tecnica, setTecnica] = useState('');
  const [preco, setPreco] = useState('');
  const [sku, setSku] = useState('');
  const [guiaCuidados, setGuiaCuidados] = useState('');
  const [imagemUrl, setImagemUrl] = useState('');

  const [altura, setAltura] = useState('');
  const [largura, setLargura] = useState('');
  const [profundidade, setProfundidade] = useState('');
  const [peso, setPeso] = useState('');

  const [erroValidacao, setErroValidacao] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErroValidacao(null);

    if (!descricao.trim()) {
      setErroValidacao('A descrição e história da peça é obrigatória para prosseguir.');
      return;
    }

    if (!titulo.trim() || !preco || Number(preco.replace(',', '.')) <= 0) {
      setErroValidacao('Informe um título e um preço válido maior que zero.');
      return;
    }

    try {
      setCarregando(true);

      const payload: CriarProdutoDTO = {
        sku: sku.trim() || `UNI-${Date.now().toString().slice(-4)}`,
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        materiaPrima: materiaPrima.trim() || 'Argila regional cozida',
        tecnica: tecnica.trim() || 'Modelagem artesanal',
        regiaoProducao: regiaoProducao.trim() || artesao?.regiaoProducao || 'Caruaru, PE',
        categoria,
        preco: parseFloat(preco.replace(',', '.')),
        tipo: 'unico',
        quantidadeEstoque: 1, // Regra HU-88: estoque fixo em 1 unidade
        idArtesao: artesao?.id || 'e1eK141d4u70m471c4m3n73',
        nomeArtesao: nomeArtesao.trim() || artesao?.nome || 'Mestre Artesão',
        dimensoes: {
          altura: parseFloat(altura) || 15,
          largura: parseFloat(largura) || 15,
          profundidade: parseFloat(profundidade) || 10,
          peso: parseFloat(peso) || 0.8,
        },
        guiaCuidados: guiaCuidados.trim() || 'Limpar com flanela seca. Proteger contra quedas e umidade excessiva.',
        galeriaImagens: imagemUrl.trim()
          ? [imagemUrl.trim()]
          : ['https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80'],
        prazoProducao: 0,
        ativo: true,
      };

      await productService.create(payload);
      router.push('/artesao/produtos');
    } catch (err) {
      console.error(err);
      setErroValidacao('Falha ao registrar produto na API. Verifique a conexão com o json-server.');
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
            HU-88: Peça Única
          </Badge>
        </HStack>

        <Grid templateColumns={{ base: '1fr', lg: '240px 1fr 300px' }} gap={6} alignItems="start">
          
          {/* Stepper lateral informativo */}
          <Box bg="white" p={5} borderRadius="xl" borderWidth="1px" borderColor="gray.200">
            <Text fontWeight="bold" fontSize="sm" color="gray.900" mb={1}>
              Cadastro Peça Única
            </Text>
            <Text fontSize="xs" color="gray.500" mb={6}>
              Obra autoral exclusiva com estoque travado em 1 unidade.
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
                <Text>4. Dimensões & Matéria</Text>
              </HStack>
              <HStack gap={2.5} color="gray.500">
                <Box p={1} bg="gray.100" borderRadius="full">
                  <FiCheck size={14} />
                </Box>
                <Text>5. Preço & SKU</Text>
              </HStack>
            </VStack>
          </Box>

          {/* Formulário Central */}
          <Box as="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={6}>
            {erroValidacao && (
              <Box bg="red.50" borderColor="red.200" borderWidth="1px" p={4} borderRadius="lg">
                <Text color="red.600" fontSize="sm" fontWeight="semibold">
                  {erroValidacao}
                </Text>
              </Box>
            )}

            {/* 1. Informações Básicas */}
            <Box bg="white" p={6} borderRadius="xl" borderWidth="1px" borderColor="gray.200">
              <Heading size="sm" mb={4} color="gray.800">
                1. Informações Básicas
              </Heading>

              <VStack gap={4} align="stretch">
                <Field.Root required>
                  <Field.Label>Título da Peça</Field.Label>
                  <Input
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Ex: Escultura Trio Nordestino em Barro Cozido"
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
                        <option value="Cerâmica">Cerâmica</option>
                        <option value="Madeira">Madeira</option>
                        <option value="Têxtil & Renda">Têxtil & Renda</option>
                        <option value="Xilogravura">Xilogravura</option>
                        <option value="Arte Sacra e Escultura">Arte Sacra e Escultura</option>
                        <option value="Decoração">Decoração</option>
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
                    placeholder={artesao?.nome || "Ex: Severino Vitalino"}
                    bg="white"
                  />
                </Field.Root>
              </VStack>
            </Box>

            {/* 2. Fotos da Peça */}
            <Box bg="white" p={6} borderRadius="xl" borderWidth="1px" borderColor="gray.200">
              <Heading size="sm" mb={4} color="gray.800">
                2. Imagem Principal da Peça
              </Heading>
              <Field.Root>
                <Field.Label>URL da Imagem</Field.Label>
                <Input
                  value={imagemUrl}
                  onChange={(e) => setImagemUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  bg="white"
                />
              </Field.Root>
            </Box>

            {/* 3. História Cultural & Descrição */}
            <Box bg="white" p={6} borderRadius="xl" borderWidth="1px" borderColor="gray.200">
              <Heading size="sm" mb={1} color="gray.800">
                3. História e Significado Cultural *
              </Heading>
              <Text fontSize="xs" color="gray.500" mb={4}>
                Conte o simbolismo, raízes e detalhes autorais da criação desta peça.
              </Text>
              <Field.Root required>
                <Textarea
                  rows={4}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Descreva a inspiração regional, matéria-prima e processo manual..."
                  bg="white"
                />
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
                    placeholder="Ex: Argila cozida e pigmento natural"
                    bg="white"
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Técnica Empregada</Field.Label>
                  <Input
                    value={tecnica}
                    onChange={(e) => setTecnica(e.target.value)}
                    placeholder="Ex: Modelagem figurativa em torno"
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
                    placeholder="20"
                    bg="white"
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Larg. (cm)</Field.Label>
                  <Input
                    type="number"
                    value={largura}
                    onChange={(e) => setLargura(e.target.value)}
                    placeholder="15"
                    bg="white"
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Prof. (cm)</Field.Label>
                  <Input
                    type="number"
                    value={profundidade}
                    onChange={(e) => setProfundidade(e.target.value)}
                    placeholder="15"
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
                    placeholder="1.2"
                    bg="white"
                  />
                </Field.Root>
              </Grid>

              <Field.Root>
                <Field.Label>Instruções de Cuidado</Field.Label>
                <Input
                  value={guiaCuidados}
                  onChange={(e) => setGuiaCuidados(e.target.value)}
                  placeholder="Ex: Limpar com flanela seca. Não molhar."
                  bg="white"
                />
              </Field.Root>
            </Box>

            {/* 5. Preço & Estoque Travado */}
            <Box bg="white" p={6} borderRadius="xl" borderWidth="1px" borderColor="gray.200">
              <Heading size="sm" mb={4} color="gray.800">
                5. Precificação e Controle de Estoque
              </Heading>

              <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
                <Field.Root required>
                  <Field.Label>Preço à vista (R$)</Field.Label>
                  <Input
                    value={preco}
                    onChange={(e) => setPreco(e.target.value)}
                    placeholder="180.00"
                    fontWeight="bold"
                    bg="white"
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>
                    <HStack gap={1}>
                      <Text>Estoque</Text>
                      <FiLock size={12} color="#718096" />
                    </HStack>
                  </Field.Label>
                  <Input
                    value="1 unidade (Peça Única)"
                    readOnly
                    bg="gray.100"
                    color="gray.600"
                    fontWeight="bold"
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Código SKU</Field.Label>
                  <Input
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="Ex: UNI-001"
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
                loadingText="Cadastrando obra..."
                px={8}
              >
                Publicar Peça Única
              </Button>
            </Flex>
          </Box>

          {/* Coluna Direita: Live Preview */}
          <Box position="sticky" top="20px">
            <Card.Root bg="white" p={4} borderRadius="xl" borderWidth="1px" borderColor="gray.200" shadow="sm">
              <HStack justify="space-between" mb={3}>
                <HStack gap={1.5} color="gray.800" fontWeight="bold" fontSize="xs">
                  <FiEye size={14} />
                  <Text>Pré-visualização</Text>
                </HStack>
                <Badge colorPalette="brand" fontSize="2xs">
                  Ao Vivo
                </Badge>
              </HStack>

              <Box borderRadius="lg" overflow="hidden" mb={3} h="180px" bg="gray.100">
                <Image
                  src={imagemUrl || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80'}
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
                {titulo || 'Título da Peça'}
              </Text>
              <Text fontSize="xs" color="gray.600" mb={3}>
                Por {nomeArtesao.trim() || artesao?.nome || 'Mestre Artesão'}
              </Text>

              <HStack justify="space-between" pt={2} borderTopWidth="1px" borderColor="gray.100">
                <Text fontWeight="bold" fontSize="lg" color="brand.600">
                  R$ {preco ? Number(preco.replace(',', '.')).toFixed(2) : '0.00'}
                </Text>
                <Badge colorPalette="purple" fontSize="2xs">
                  1 un. exclusiva
                </Badge>
              </HStack>

              <VStack align="start" gap={2} pt={4} mt={3} borderTopWidth="1px" borderColor="gray.100" fontSize="2xs" color="gray.500">
                <HStack gap={2}>
                  <FiTrendingUp color="#38A169" />
                  <Text>Histórias autorais valorizam o artesanato.</Text>
                </HStack>
              </VStack>
            </Card.Root>
          </Box>

        </Grid>
      </Container>
    </Box>
  );
}