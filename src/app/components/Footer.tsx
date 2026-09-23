'use client';

import React from 'react';
import { Box, Container, Grid, Text, Input, Button, HStack, VStack, Flex, Separator } from '@chakra-ui/react';
import { FaFacebookF, FaInstagram, FaWhatsapp, FaYoutube } from 'react-icons/fa';
import { FiMapPin } from 'react-icons/fi';
import NextLink from 'next/link';

export function Footer() {
  return (
    <Box as="footer" bg="white" color="gray.700" pt={8} pb={6} borderTopWidth="1px" borderColor="gray.200" mt="auto">
      <Container maxW="1200px">
        {/* 4 Colunas Superiores */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: '2fr 1.2fr 1.2fr 1.5fr' }} gap={6} mb={8}>
          <VStack align="start" gap={2}>
            <HStack gap={2}>
              <Box w={5} h={5} borderRadius="md" bg="brand.500" color="white" display="flex" align="center" justify="center" fontWeight="bold" fontSize="xs">
                ✦
              </Box>
              <Text fontWeight="extrabold" fontSize="sm" color="gray.900">
                Sobre o PernambucoCrafts
              </Text>
            </HStack>
            <Text fontSize="xs" color="gray.600" lineHeight="tall">
              Celebrando os artesãos e o artesanato tradicional de Pernambuco. Parceria com cooperativas para levar produtos autênticos feitos à mão para o mundo.
            </Text>
            <Button size="xs" variant="outline" borderRadius="full" px={5}>
              Saiba mais
            </Button>
          </VStack>

          <VStack align="start" gap={1.5}>
            <Text fontWeight="bold" fontSize="xs" color="gray.900" mb={0.5}>
              Como Funciona
            </Text>
            <NextLink href="#"><Text fontSize="xs" color="gray.600" _hover={{ color: 'brand.600' }}>Para Compradores: Explore e compre</Text></NextLink>
            <NextLink href="#"><Text fontSize="xs" color="gray.600" _hover={{ color: 'brand.600' }}>Para Artesãos: Publique e gerencie</Text></NextLink>
            <NextLink href="#"><Text fontSize="xs" color="gray.600" _hover={{ color: 'brand.600' }}>Guias e Perguntas Frequentes</Text></NextLink>
            <NextLink href="#"><Text fontSize="xs" color="gray.600" _hover={{ color: 'brand.600' }}>Programa de apoio ao artesão</Text></NextLink>
          </VStack>

          <VStack align="start" gap={1.5}>
            <Text fontWeight="bold" fontSize="xs" color="gray.900" mb={0.5}>
              Cliente e Jurídico
            </Text>
            <NextLink href="#"><Text fontSize="xs" color="gray.600" _hover={{ color: 'brand.600' }}>Envios e Devoluções</Text></NextLink>
            <NextLink href="#"><Text fontSize="xs" color="gray.600" _hover={{ color: 'brand.600' }}>Central de Ajuda</Text></NextLink>
            <NextLink href="#"><Text fontSize="xs" color="gray.600" _hover={{ color: 'brand.600' }}>Política de Privacidade</Text></NextLink>
            <NextLink href="#"><Text fontSize="xs" color="gray.600" _hover={{ color: 'brand.600' }}>Termos de Serviço</Text></NextLink>
          </VStack>

          <VStack align="start" gap={2}>
            <Text fontWeight="bold" fontSize="xs" color="gray.900" mb={0.5}>
              Contato e Redes Sociais
            </Text>
            <Text fontSize="xs" color="gray.600">
              E-mail: <a href="mailto:support@pernambucocrafts.org" style={{ color: '#3182ce' }}>support@pernambucocrafts.org</a>
            </Text>
            <Text fontSize="xs" color="gray.600">
              Telefone: +55 81 1234 5678
            </Text>
            <HStack gap={2.5} pt={1}>
              <Box as="a" href="#" p={1.5} bg="gray.100" borderRadius="full" color="gray.600" _hover={{ bg: 'gray.200' }}><FaFacebookF size={11} /></Box>
              <Box as="a" href="#" p={1.5} bg="gray.100" borderRadius="full" color="gray.600" _hover={{ bg: 'gray.200' }}><FaInstagram size={11} /></Box>
              <Box as="a" href="#" p={1.5} bg="gray.100" borderRadius="full" color="gray.600" _hover={{ bg: 'gray.200' }}><FaWhatsapp size={11} /></Box>
              <Box as="a" href="#" p={1.5} bg="gray.100" borderRadius="full" color="gray.600" _hover={{ bg: 'gray.200' }}><FaYoutube size={11} /></Box>
            </HStack>
          </VStack>
        </Grid>

        {/* Seção do Meio: Mapa e Newsletter lado a lado (Fundo totalmente branco e limpo) */}
        <Grid templateColumns={{ base: '1fr', lg: '1.4fr 1fr' }} gap={5} mb={6}>
          {/* Card Esquerda: Mapa da Rede */}
          <Box bg="white" p={4} borderRadius="xl" borderWidth="1px" borderColor="gray.200" display="flex" flexDirection="column" justify="space-between">
            <Text fontWeight="bold" fontSize="xs" color="gray.900" mb={2}>
              Mapa da Rede de Artesãos
            </Text>
            <Flex direction={{ base: 'column', sm: 'row' }} gap={3} align="center">
              <Box w={{ base: 'full', sm: '140px' }} h="90px" bg="brand.50" borderRadius="md" borderWidth="1px" borderColor="brand.200" display="flex" flexDirection="column" align="center" justify="center" flexShrink={0} p={2}>
                <FiMapPin size={24} color="#b8ad2a" />
                <Text fontSize="3xs" fontWeight="bold" color="gray.700" mt={1}>Pernambuco, PE</Text>
              </Box>
              <VStack align="start" gap={1} flex={1}>
                <Text fontSize="xs" fontWeight="semibold" color="gray.800">
                  Municípios ativos: 45 polos criativos
                </Text>
                <Text fontSize="3xs" color="gray.600" lineHeight="short">
                  Explore o mapa interativo para descobrir coletivos artesanais do Agreste ao Sertão.
                </Text>
                <HStack gap={2} pt={1}>
                  <Button size="xs" variant="outline">Ver mapa</Button>
                  <Button size="xs" colorPalette="brand">Perto de mim</Button>
                </HStack>
              </VStack>
            </Flex>
          </Box>

          {/* Card Direita: Newsletter & Pagamentos */}
          <VStack align="start" gap={3} bg="white" p={4} borderRadius="xl" borderWidth="1px" borderColor="gray.200" justify="space-between">
            <VStack align="start" gap={1} w="full">
              <Text fontWeight="bold" fontSize="xs" color="gray.900">
                Newsletter
              </Text>
              <Text fontSize="3xs" color="gray.600">
                Receba histórias de artesãos, novos produtos e ofertas exclusivas.
              </Text>
              <HStack w="full" gap={2} pt={0.5}>
                <Input size="xs" placeholder="voce@dominio.com" bg="white" />
                <Button size="xs" colorPalette="brand" px={4}>Inscrever</Button>
              </HStack>
            </VStack>

            <VStack align="start" gap={1} w="full" pt={2} borderTopWidth="1px" borderColor="gray.100">
              <Text fontWeight="bold" fontSize="3xs" color="gray.700" textTransform="uppercase">
                Pagamentos Seguros
              </Text>
              <HStack gap={1.5} opacity={0.8}>
                <Box px={2} py={0.5} bg="gray.50" borderWidth="1px" borderColor="gray.300" borderRadius="sm" fontSize="3xs" fontWeight="bold">PAGSEGURO</Box>
                <Box px={2} py={0.5} bg="gray.50" borderWidth="1px" borderColor="gray.300" borderRadius="sm" fontSize="3xs" fontWeight="bold">PIX</Box>
                <Box px={2} py={0.5} bg="gray.50" borderWidth="1px" borderColor="gray.300" borderRadius="sm" fontSize="3xs" fontWeight="bold">CARTÃO</Box>
              </HStack>
              <Text fontSize="3xs" color="gray.500">
                Checkout seguro • Proteção ao comprador • Devoluções em 30 dias
              </Text>
            </VStack>
          </VStack>
        </Grid>

        <Separator my={4} />

        {/* Rodapé Base */}
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align="center" gap={2} fontSize="3xs" color="gray.500">
          <Text>© 2026 PernambucoCrafts Marketplace. Todos os direitos reservados.</Text>
          <HStack gap={4}>
            <Text>Idioma: PT-BR</Text>
            <Text>Moeda: BRL</Text>
            <Text>Contato: support@pernambucocrafts.org</Text>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}