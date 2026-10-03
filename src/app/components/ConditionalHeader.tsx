// src/app/components/ConditionalHeader.tsx
"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Box, Flex, Text, Button, Container, HStack } from "@chakra-ui/react";
import NextLink from "next/link";
import { HeaderCarrinho } from "./HeaderCarrinho";
import { FiPackage, FiLogOut } from "react-icons/fi";
import { sessionStore } from "@/store/sessionStore";

// Rotas internas do artesão (login, cadastro e gestão).
const ROTAS_GESTAO_ARTESAO = [
  "/artesao/login",
  "/artesao/register",
  "/artesao/produtos",
  // adicione aqui outras rotas internas do artesão, se existirem
];

export function ConditionalHeader() {
  // false no servidor e no primeiro render do cliente; vira true após hidratar
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const pathname = usePathname() || "";
  const router = useRouter();

  const isAdminLogged = sessionStore((state) => state.isAdminLogged);
  const logoutAdmin = sessionStore((state) => state.logoutAdmin);

  const isArtesaoLogged = sessionStore((state) => state.isArtesaoLogged);
  const logoutArtesao = sessionStore((state) => state.logoutArtesao);

  const handleAdminLogout = () => {
    logoutAdmin();
    router.push("/");
  };

  const handleArtesaoLogout = () => {
    logoutArtesao();
    router.push("/");
  };

  // 1. Área do Cliente (/customer...): o header vem da própria página
  if (pathname.startsWith("/customer")) {
    return null;
  }

  // 2. Área de Admin (/admin...)
  if (pathname.startsWith("/admin")) {
    const logged = mounted && isAdminLogged();

    return (
      <Box as="header" bg="gray.900" color="white" py={4} px={{ base: 4, md: 8 }} shadow="sm">
        <Container maxW="1200px">
          <Flex direction={{ base: "column", md: "row" }} justify="space-between" align={{ base: "stretch", md: "center" }} gap={{ base: 3, md: 4 }}>
            <NextLink href="/" style={{ textDecoration: "none" }}>
              <HStack gap={3} justify={{ base: "center", md: "flex-start" }} cursor="pointer">
                <Flex w={7} h={7} borderRadius="md" bg="brand.500" color="gray.900" align="center" justify="center" fontWeight="bold">
                  ✦
                </Flex>
                <Text fontWeight="bold" fontSize={{ base: "sm", md: "md" }} textAlign={{ base: "center", md: "left" }} color="white">
                  FolcStore
                </Text>
              </HStack>
            </NextLink>

            <HStack gap={2} justify={{ base: "center", md: "flex-end" }} wrap="wrap">
              {logged && (
                <Button variant="outline" colorPalette="brand" size="sm" onClick={handleAdminLogout}>
                  <FiLogOut /> Sair da Conta
                </Button>
              )}
            </HStack>
          </Flex>
        </Container>
      </Box>
    );
  }

  // 3. Artesão: rotas internas OU artesão logado em qualquer página
  const loggedArtesao = mounted && isArtesaoLogged();
  const isAreaGestaoArtesao = ROTAS_GESTAO_ARTESAO.some(
    (rota) => pathname === rota || pathname.startsWith(rota + "/")
  );

  if (isAreaGestaoArtesao || loggedArtesao) {
    const isAuthPage = pathname === "/artesao/login" || pathname === "/artesao/register";

    return (
      <Box as="header" bg="gray.900" color="white" py={4} px={{ base: 4, md: 8 }} shadow="sm">
        <Container maxW="1200px">
          <Flex direction={{ base: "column", md: "row" }} justify="space-between" align={{ base: "stretch", md: "center" }} gap={{ base: 3, md: 4 }}>
            <NextLink href="/" style={{ textDecoration: "none" }}>
              <HStack gap={3} justify={{ base: "center", md: "flex-start" }} cursor="pointer">
                <Flex w={7} h={7} borderRadius="md" bg="brand.500" color="gray.900" align="center" justify="center" fontWeight="bold">
                  ✦
                </Flex>
                <Text fontWeight="bold" fontSize={{ base: "sm", md: "md" }} textAlign={{ base: "center", md: "left" }} color="white">
                  FolcStore
                </Text>
              </HStack>
            </NextLink>

            <HStack gap={3} justify={{ base: "center", md: "flex-end" }} wrap="wrap">
              {!isAuthPage && (
                <NextLink href="/artesao/produtos" style={{ textDecoration: "none" }}>
                  <Button size="sm" variant="outline" colorPalette="brand">
                    <FiPackage /> Meu Catálogo
                  </Button>
                </NextLink>
              )}

              {loggedArtesao && !isAuthPage && (
                <Button variant="outline" colorPalette="brand" size="sm" onClick={handleArtesaoLogout}>
                  <FiLogOut /> Sair da Conta
                </Button>
              )}
            </HStack>
          </Flex>
        </Container>
      </Box>
    );
  }

  // 4. Visitantes e clientes: header com carrinho
  return <HeaderCarrinho mounted={mounted} />;
}