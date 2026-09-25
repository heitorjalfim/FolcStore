// src/app/components/ConditionalHeader.tsx
"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Box, Flex, Text, Button, Container, HStack } from "@chakra-ui/react";
import NextLink from "next/link";
import { HeaderCarrinho } from "./HeaderCarrinho";
import { FiPackage, FiHome, FiLogOut } from 'react-icons/fi';
import { sessionStore } from "@/store/sessionStore";

export function ConditionalHeader() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname() || "";
  const router = useRouter();

  const isAdminLogged = sessionStore((state) => state.isAdminLogged);
  const logoutAdmin = sessionStore((state) => state.logoutAdmin);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logoutAdmin();
    router.push("/");
  };

  if (pathname.startsWith("/customer")) {
    return null;
  }

  // 1. Área de Admin (/admin...)
  if (pathname.startsWith("/admin")) {
    const logged = isAdminLogged();

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
                  FolcStore • Painel Administrativo
                </Text>
              </HStack>
            </NextLink>

            <HStack gap={2} justify={{ base: "center", md: "flex-end" }} wrap="wrap">
              {logged && (
                <Button variant="outline" colorPalette="red" size="sm" onClick={handleLogout}>
                  <FiLogOut /> Sair da Conta
                </Button>
              )}
            </HStack>
          </Flex>
        </Container>
      </Box>
    );
  }

  // 2. Área de Gestão Interna do Artesão (ex: /artesao/produtos, /artesao/login, etc.)
  const isArtesaoManagement = 
    pathname === "/artesao/produtos" || 
    pathname.startsWith("/artesao/produtos/") || 
    pathname === "/artesao/dashboard" ||
    pathname === "/artesao/login" ||
    pathname === "/artesao/register";

  if (isArtesaoManagement) {
    return (
      <Box as="header" bg="white" borderBottomWidth="1px" borderColor="gray.200" py={3} px={8} shadow="sm">
        <Container maxW="1200px">
          <Flex justify="space-between" align="center">
            <HStack gap={3}>
              <NextLink href="/artesao" style={{ textDecoration: "none" }}>
                <Flex align="center" gap={2} cursor="pointer">
                  <Flex w={7} h={7} borderRadius="md" bg="brand.500" color="gray.900" align="center" justify="center" fontWeight="bold">
                    ✦
                  </Flex>
                  <Text fontWeight="bold" fontSize="md" color="gray.950">
                    Portal do Artesão
                  </Text>
                </Flex>
              </NextLink>
            </HStack>
            <HStack gap={3}>
              <NextLink href="/artesao/produtos" style={{ textDecoration: "none" }}>
                <Button size="sm" variant="outline" colorPalette="brand">
                  <FiPackage /> Meu Catálogo
                </Button>
              </NextLink>
              <NextLink href="/" style={{ textDecoration: "none" }}>
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

  // 3. Se for a página pública do perfil do artesão (/artesao/[slug]), 
  // evitamos renderizar o HeaderCarrinho aqui caso ele esteja a ser duplicado por outra via,
  // ou garantimos que é renderizado apenas uma vez de forma limpa.
  const isPublicArtesaoProfile = pathname.startsWith("/artesao/") && !isArtesaoManagement;
  
  if (isPublicArtesaoProfile) {
    // Retorna null aqui para testar se o segundo cabeçalho desaparece. 
    // (Se a página do artesão precisar do HeaderCarrinho, ele deve vir daqui e não de outro lugar).
    return <HeaderCarrinho mounted={mounted} />;
  }

  // 4. Área Geral do Comprador / Vitrine Pública (Página Inicial)
  return <HeaderCarrinho mounted={mounted} />;

}

  