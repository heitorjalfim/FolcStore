// src/app/components/HeaderCarrinho.tsx
"use client";

import React, { useState } from "react";
import { Box, Flex, Text, Button, Container, HStack, VStack, IconButton } from "@chakra-ui/react";
import NextLink from "next/link";
import { FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import { useCartStore } from "@/store/cartStore";

const NAV_LINKS = [
  { label: "Cliente", href: "/customer" },
  { label: "Artesão", href: "/artesao" },
  { label: "Admin", href: "/admin" },
];

export function HeaderCarrinho({ mounted = true }: { mounted?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const cartItems = useCartStore((state) => state.items);
  const totalItens = mounted ? cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0) : 0;

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <Box 
      as="header" 
      position="sticky" 
      top="0" 
      zIndex="1000" 
      bg="gray.900" 
      color="white" 
      py={4} 
      px={{ base: 4, md: 8 }} 
      shadow="sm"
    >
      <Container maxW="1200px">
        <Flex justify="space-between" align="center">
          {/* 1. Logotipo */}
          <NextLink href="/" style={{ textDecoration: "none" }}>
            <HStack gap={3} cursor="pointer">
              <Flex w={7} h={7} borderRadius="md" bg="brand.500" color="gray.900" align="center" justify="center" fontWeight="bold">
                ✦
              </Flex>
              <Text fontWeight="bold" fontSize={{ base: "sm", md: "md" }} color="white">
                FolcStore
              </Text>
            </HStack>
          </NextLink>

          {/* 2. Links de Navegação (Desktop) */}
          <HStack gap={8} display={{ base: "none", md: "flex" }}>
            {NAV_LINKS.map((link) => (
              <NextLink key={link.href} href={link.href} style={{ textDecoration: "none" }}>
                <Text color="gray.300" _hover={{ color: "white" }} fontSize="sm" fontWeight="medium">
                  {link.label}
                </Text>
              </NextLink>
            ))}
          </HStack>

          {/* 3. Ações à Direita (Carrinho + Botão Menu Mobile) */}
          <HStack gap={3}>
            <NextLink href="/customer/checkout" style={{ textDecoration: "none" }}>
              <Button size="sm" variant="outline" colorPalette="brand">
                <FiShoppingCart /> 
                <Box as="span" display={{ base: "none", sm: "inline" }} ml={1}>
                  Carrinho
                </Box> 
                {mounted && totalItens > 0 ? ` (${totalItens})` : ""}
              </Button>
            </NextLink>

            {/* Botão Hambúrguer para Telemóveis */}
            <IconButton
              display={{ base: "flex", md: "none" }}
              onClick={toggleMenu}
              variant="ghost"
              color="white"
              aria-label="Abrir Menu"
              size="sm"
            >
              {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </IconButton>
          </HStack>
        </Flex>

        {/* 4. Menu Dropdown para Telemóveis */}
        {isOpen && (
          <VStack 
            display={{ base: "flex", md: "none" }} 
            pt={4} 
            pb={2} 
            align="stretch" 
            gap={3}
            borderTop="1px solid"
            borderColor="gray.800"
            mt={3}
          >
            {NAV_LINKS.map((link) => (
              <NextLink key={link.href} href={link.href} onClick={() => setIsOpen(false)} style={{ textDecoration: "none" }}>
                <Text 
                  color="gray.300" 
                  _hover={{ color: "white", bg: "gray.800" }} 
                  p={2} 
                  borderRadius="md" 
                  fontSize="sm" 
                  fontWeight="medium"
                >
                  {link.label}
                </Text>
              </NextLink>
            ))}
          </VStack>
        )}
      </Container>
    </Box>
  );
}