// src/app/components/Footer.tsx
'use client';

import React from 'react';
import { Box, Container, Flex, Text, Input, Button, VStack, HStack, Link as ChakraLink } from '@chakra-ui/react';
import NextLink from 'next/link';
import { FiMapPin } from 'react-icons/fi';

export function Footer() {
  return (
    <Box as="footer" bg="gray.900" color="gray.300" pt={8} pb={4} borderTopWidth="1px" borderColor="gray.800">
      <Container maxW="1200px">
        <Flex 
          direction={{ base: 'column', md: 'row' }} 
          justify="space-between" 
          align={{ base: 'center', md: 'flex-start' }} 
          textAlign={{ base: 'center', md: 'left' }}
          gap={8} 
          mb={6}
        >
          
          {/* Coluna 1: Sobre */}
          <VStack align={{ base: 'center', md: 'flex-start' }} maxW={{ base: 'full', md: '280px' }} gap={2}>
            <Text fontSize="md" fontWeight="bold" color="white">
              FolcStore ✦
            </Text>
            <Text fontSize="xs" color="gray.400">
              Valorizando a arte e o artesanato autêntico de Pernambuco direto dos mestres artesãos.
            </Text>
            <Flex align="center" justify={{ base: 'center', md: 'flex-start' }} gap={1} fontSize="xs" color="gray.400">
              <FiMapPin /> Pernambuco, Brasil
            </Flex>
          </VStack>

          {/* Coluna 2: Navegação */}
          <VStack align={{ base: 'center', md: 'flex-start' }} gap={1.5}>
            <Text fontSize="sm" fontWeight="bold" color="white">
              Navegação
            </Text>
            <ChakraLink as={NextLink} href="/" fontSize="xs" color="gray.400" _hover={{ color: 'brand.500' }}>
              Início / Vitrine
            </ChakraLink>
            <ChakraLink as={NextLink} href="/artesao" fontSize="xs" color="gray.400" _hover={{ color: 'brand.500' }}>
              Portal do Artesão
            </ChakraLink>
            <ChakraLink as={NextLink} href="/admin" fontSize="xs" color="gray.400" _hover={{ color: 'brand.500' }}>
              Painel Administrativo
            </ChakraLink>
          </VStack>

          {/* Coluna 3: Pagamento */}
          <VStack align={{ base: 'center', md: 'flex-start' }} gap={1.5}>
            <Text fontSize="sm" fontWeight="bold" color="white">
              Pagamento Seguro
            </Text>
            <Text fontSize="xs" color="gray.400">
              Aceitamos Pix, Cartão e Boleto.
            </Text>
            <HStack justify={{ base: 'center', md: 'flex-start' }} gap={1.5} pt={0.5}>
              <Box px={2} py={0.5} bg="gray.800" borderRadius="sm" fontSize="10px" fontWeight="bold" color="white">PIX</Box>
              <Box px={2} py={0.5} bg="gray.800" borderRadius="sm" fontSize="10px" fontWeight="bold" color="white">Crédito</Box>
              <Box px={2} py={0.5} bg="gray.800" borderRadius="sm" fontSize="10px" fontWeight="bold" color="white">Boleto</Box>
            </HStack>
          </VStack>

          {/* Coluna 4: Newsletter */}
          <VStack align={{ base: 'center', md: 'flex-start' }} maxW={{ base: 'full', md: '260px' }} w="full" gap={2}>
            <Text fontSize="sm" fontWeight="bold" color="white">
              Newsletter
            </Text>
            <Text fontSize="xs" color="gray.400">
              Receba novidades e coleções exclusivas.
            </Text>
            <HStack w="full" maxW={{ base: '280px', md: 'full' }}>
              <Input 
                placeholder="Seu e-mail" 
                size="xs" 
                bg="gray.800" 
                border="none" 
                color="white"
                _placeholder={{ color: 'gray.500' }}
              />
              <Button size="xs" colorPalette="brand" px={3}>
                Assinar
              </Button>
            </HStack>
          </VStack>

        </Flex>

        {/* Copyright */}
        <Box pt={4} borderTopWidth="1px" borderColor="gray.800" textAlign="center">
          <Text fontSize="11px" color="gray.500">
            &copy; {new Date().getFullYear()} FolcStore. Todos os direitos reservados. Projeto Integrador - Pernambuco.
          </Text>
        </Box>
      </Container>
    </Box>
  );
}