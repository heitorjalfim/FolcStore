// src/app/components/ConditionalHeader.tsx
"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Box,
  Flex,
  Text,
  Button,
  Container,
  HStack,
  Badge,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { HeaderCarrinho } from "./HeaderCarrinho";
import { FiPackage, FiLogOut, FiShoppingCart } from "react-icons/fi";
import { sessionStore } from "@/store/sessionStore";
import { useCartStore } from "@/store/cartStore";
import { CartDrawer } from "./CartDrawer"; // Certifique-se do caminho correto para o CartDrawer

export function ConditionalHeader() {
  const [mounted, setMounted] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const pathname = usePathname() || "";
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  const isAdminLogged = sessionStore((state) => state.isAdminLogged());
  const logoutAdmin = sessionStore((state) => state.logoutAdmin);

  const isArtesaoLogged = sessionStore((state) => state.isArtesaoLogged());
  const logoutArtesao = sessionStore((state) => state.logoutArtesao);

  const logoutCustomer = sessionStore((state) => state.logoutCustomer);

  const totalItemsCount = useCartStore((state) => state.totalItems)();
  const totalItems = mounted ? totalItemsCount : 0;

  const handleAdminLogout = () => {
    logoutAdmin();
    router.push("/");
  };

  const handleArtesaoLogout = () => {
    logoutArtesao();
    router.push("/");
  };

  const handleCustomerLogout = () => {
    logoutCustomer();
    router.push("/");
  };

  // 1. Área do Cliente (/customer...) -> Usa o cabeçalho rico com o carrinho integrado
  if (pathname.startsWith("/customer")) {
    return (
      <>
        <Box
          as="header"
          bg="gray.900"
          color="white"
          py={4}
          px={{ base: 4, md: 8 }}
          shadow="sm"
          mb={4}
        >
          <Container maxW="1200px">
            <Flex justify="space-between" align="center">
              {/* Logo */}
              <NextLink href="/" style={{ textDecoration: "none" }}>
                <HStack gap={3} cursor="pointer">
                  <Flex
                    w={7}
                    h={7}
                    borderRadius="md"
                    bg="brand.500"
                    color="gray.900"
                    align="center"
                    justify="center"
                    fontWeight="bold"
                  >
                    ✦
                  </Flex>
                  <Text
                    fontWeight="bold"
                    fontSize={{ base: "sm", md: "md" }}
                    color="white"
                  >
                    FolcStore
                  </Text>
                </HStack>
              </NextLink>

              {/* Ações à Direita */}
              <HStack gap={{ base: 2, md: 4 }}>
                <NextLink
                  href="/customer/minha-conta"
                  style={{ textDecoration: "none" }}
                >
                  <Text
                    display={{ base: "none", sm: "block" }}
                    color="gray.300"
                    _hover={{ color: "white" }}
                    fontSize="sm"
                    fontWeight="medium"
                  >
                    Sua Conta
                  </Text>
                </NextLink>

                {/* Botão do Carrinho que abre a gaveta */}
                <Button
                  variant="outline"
                  size="sm"
                  colorPalette="brand"
                  onClick={() => setIsCartOpen(true)}
                  borderColor="brand.500"
                  color="brand.500"
                  _hover={{ bg: "brand.500", color: "gray.900" }}
                >
                  <HStack gap={2}>
                    <FiShoppingCart />
                    <Text display={{ base: "none", sm: "inline" }}>
                      Carrinho
                    </Text>
                    {totalItems > 0 && (
                      <Badge
                        bg="brand.500"
                        color="gray.900"
                        borderRadius="full"
                      >
                        {totalItems}
                      </Badge>
                    )}
                  </HStack>
                </Button>

                {/* Botão Sair */}
                <Button
                  colorPalette="red"
                  variant="outline"
                  size="sm"
                  onClick={handleCustomerLogout}
                >
                  <HStack gap={1}>
                    <FiLogOut />
                    <Text display={{ base: "none", md: "inline" }}>Sair</Text>
                  </HStack>
                </Button>
              </HStack>
            </Flex>
          </Container>
        </Box>

        {/* Gaveta do Carrinho controlada globalmente no header do cliente */}
        <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </>
    );
  }

  // 2. Área de Admin (/admin...)
  if (pathname.startsWith("/admin")) {
    const logged = mounted && isAdminLogged;

    return (
      <Box
        as="header"
        bg="gray.900"
        color="white"
        py={4}
        px={{ base: 4, md: 8 }}
        shadow="sm"
      >
        <Container maxW="1200px">
          <Flex justify="space-between" align="center">
            <NextLink href="/" style={{ textDecoration: "none" }}>
              <HStack gap={3} cursor="pointer">
                <Flex
                  w={7}
                  h={7}
                  borderRadius="md"
                  bg="brand.500"
                  color="gray.900"
                  align="center"
                  justify="center"
                  fontWeight="bold"
                >
                  ✦
                </Flex>
                <Text
                  fontWeight="bold"
                  fontSize={{ base: "sm", md: "md" }}
                  color="white"
                >
                  FolcStore
                </Text>
              </HStack>
            </NextLink>
            {logged && (
              <Button
                variant="outline"
                colorPalette="brand"
                size="sm"
                onClick={handleAdminLogout}
              >
                <FiLogOut /> Sair da Conta
              </Button>
            )}
          </Flex>
        </Container>
      </Box>
    );
  }

  // 3. Área de Autenticação e Gestão do Artesão (/artesao...)
  if (pathname.startsWith("/artesao")) {
    const loggedArtesao = mounted && isArtesaoLogged;
    const isAuthPage =
      pathname === "/artesao/login" || pathname === "/artesao/register";
    const isPublicProfile =
      pathname.split("/").length > 2 &&
      !isAuthPage &&
      !pathname.includes("/produtos");

    if (isPublicProfile) {
      return <HeaderCarrinho mounted={mounted} />;
    }

    return (
      <Box
        as="header"
        bg="gray.900"
        color="white"
        py={4}
        px={{ base: 4, md: 8 }}
        shadow="sm"
      >
        <Container maxW="1200px">
          <Flex justify="space-between" align="center">
            <NextLink href="/" style={{ textDecoration: "none" }}>
              <HStack gap={3} cursor="pointer">
                <Flex
                  w={7}
                  h={7}
                  borderRadius="md"
                  bg="brand.500"
                  color="gray.900"
                  align="center"
                  justify="center"
                  fontWeight="bold"
                >
                  ✦
                </Flex>
                <Text
                  fontWeight="bold"
                  fontSize={{ base: "sm", md: "md" }}
                  color="white"
                >
                  FolcStore
                </Text>
              </HStack>
            </NextLink>
            <HStack gap={3}>
              {loggedArtesao && !isAuthPage && (
                <Button
                  variant="outline"
                  colorPalette="brand"
                  size="sm"
                  onClick={handleArtesaoLogout}
                >
                  <FiLogOut /> Sair da Conta
                </Button>
              )}
            </HStack>
          </Flex>
        </Container>
      </Box>
    );
  }

  return <HeaderCarrinho mounted={mounted} />;
}
