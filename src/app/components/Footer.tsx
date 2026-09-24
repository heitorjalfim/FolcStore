// src/app/components/Footer.tsx
'use client';

import React from 'react';
import { Box, Container, Flex, Text, Input, Button, VStack, HStack, Link as ChakraLink } from '@chakra-ui/react';
import NextLink from 'next/link';
import { FiMapPin } from 'react-icons/fi';

export function Footer() {
  return (
    <Box as="footer" bg="gray.900" color="gray.300" pt={12} pb={6} borderTopWidth="1px" borderColor="gray.800">
      <Container maxW="1200px">
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" gap={8} mb={10}>
          
          {/* Coluna 1 */}
          <VStack align="flex-start" maxW="320px" gap={4}>
            <Text fontSize="xl" fontWeight="bold" color="white">
              FolcStore ✦
            </Text>
            <Text fontSize="sm" color="gray.400">
              Valorizando a cultura, a arte e o artesanato autêntico de Pernambuco direto das mãos dos mestres artesãos para a sua casa.
            </Text>
            <Flex align="center" gap={2} fontSize="sm" color="gray.400">
              <FiMapPin /> Pernambuco, Brasil
            </Flex>
          </VStack>

          {/* Coluna 2 */}
          <VStack align="flex-start" gap={3}>
            <Text fontSize="md" fontWeight="bold" color="white">
              Navegação
            </Text>
            <NextLink href="/" passHref style={{ textDecoration: 'none' }}>
              <ChakraLink fontSize="sm" color="gray.400" _hover={{ color: 'brand.500' }}>Início / Vitrine</ChakraLink>
            </NextLink>
            <NextLink href="/artesao" passHref style={{ textDecoration: 'none' }}>
              <ChakraLink fontSize="sm" color="gray.400" _hover={{ color: 'brand.500' }}>Portal do Artesão</ChakraLink>
            </NextLink>
            <NextLink href="/admin" passHref style={{ textDecoration: 'none' }}>
              <ChakraLink fontSize="sm" color="gray.400" _hover={{ color: 'brand.500' }}>Painel Administrativo</ChakraLink>
            </NextLink>
          </VStack>

          {/* Coluna 3 */}
          <VStack align="flex-start" gap={3}>
            <Text fontSize="md" fontWeight="bold" color="white">
              Formas de Pagamento
            </Text>
            <Text fontSize="sm" color="gray.400">
              Aceitamos Pix, Cartão de Crédito e Boleto Bancário com total segurança.
            </Text>
            <HStack gap={2} pt={1}>
              <Box px={2} py={1} bg="gray.800" borderRadius="md" fontSize="xs" fontWeight="bold" color="white">PIX</Box>
              <Box px={2} py={1} bg="gray.800" borderRadius="md" fontSize="xs" fontWeight="bold" color="white">Crédito</Box>
              <Box px={2} py={1} bg="gray.800" borderRadius="md" fontSize="xs" fontWeight="bold" color="white">Boleto</Box>
            </HStack>
          </VStack>

          {/* Coluna 4 */}
          <VStack align="flex-start" maxW="300px" gap={3}>
            <Text fontSize="md" fontWeight="bold" color="white">
              Newsletter
            </Text>
            <Text fontSize="sm" color="gray.400">
              Receba novidades sobre novas peças e coleções exclusivas.
            </Text>
            <HStack w="full">
              <Input 
                placeholder="Seu e-mail" 
                size="sm" 
                bg="gray.800" 
                border="none" 
                color="white"
                _placeholder={{ color: 'gray.500' }}
              />
              <Button size="sm" colorPalette="brand" px={4}>
                Assinar
              </Button>
            </HStack>
          </VStack>

        </Flex>

        {/* Copyright */}
        <Box pt={6} borderTopWidth="1px" borderColor="gray.800" textAlign="center">
          <Text fontSize="xs" color="gray.500">
            &copy; {new Date().getFullYear()} FolcStore. Todos os direitos reservados. Projeto Integrador - Pernambuco.
          </Text>
        </Box>
      </Container>
    </Box>
  );
}