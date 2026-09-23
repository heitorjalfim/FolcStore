// src/app/components/ConditionalHeader.tsx
'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Box, Flex, Text, Button, Container, HStack } from '@chakra-ui/react';
import NextLink from 'next/link';
import { HeaderCarrinho } from './HeaderCarrinho';
import { FiPackage, FiHome } from 'react-icons/fi';

export function ConditionalHeader() {
  const pathname = usePathname() || '';

  // 1. Área de Admin (/admin...)
  if (pathname.startsWith('/admin')) {
    return (
      <Box as="header" bg="white" borderBottomWidth="1px" borderColor="gray.200" py={3} px={8} shadow="sm">
        <Container maxW="1200px">
          <Flex justify="space-between" align="center">
            <HStack gap={3}>
              <Box w={7} h={7} borderRadius="md" bg="brand.500" color="gray.900" display="flex" align="center" justify="center" fontWeight="bold">
                ✦
              </Box>
              <Text fontWeight="bold" fontSize="md" color="gray.950">FolcStore • Painel Administrativo</Text>
            </HStack>
            <NextLink href="/">
              <Button size="sm" variant="ghost" colorPalette="gray">
                <FiHome /> Sair para a Loja
              </Button>
            </NextLink>
          </Flex>
        </Container>
      </Box>
    );
  }

  // 2. Área de Artesão (/artesao...) - Aplicado de forma consistente em todas as subrotas
  if (pathname.startsWith('/artesao')) {
    return (
      <Box as="header" bg="white" borderBottomWidth="1px" borderColor="gray.200" py={3} px={8} shadow="sm">
        <Container maxW="1200px">
          <Flex justify="space-between" align="center">
            <HStack gap={3}>
              <NextLink href="/artesao">
                <Flex align="center" gap={2} cursor="pointer">
                  <Box w={7} h={7} borderRadius="md" bg="brand.500" color="gray.900" display="flex" align="center" justify="center" fontWeight="bold">
                    ✦
                  </Box>
                  <Text fontWeight="bold" fontSize="md" color="gray.950">Portal do Artesão</Text>
                </Flex>
              </NextLink>
            </HStack>
            <HStack gap={3}>
              <NextLink href="/artesao/produtos">
                <Button size="sm" variant="outline" colorPalette="brand">
                  <FiPackage /> Meu Catálogo
                </Button>
              </NextLink>
              <NextLink href="/">
                <Button size="sm" variant="ghost" colorPalette="gray">
                  <FiHome /> Sair para a Loja
                </Button>
              </NextLink>
            </HStack>
          </Flex>
        </Container>
      </Box>
    );
  }

  // 3. Área do Comprador / Vitrine Pública (Home, Produtos, Carrinho, Checkout)
  return <HeaderCarrinho />;
}