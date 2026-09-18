"use client";

import { Box, Container, Flex, Text, Button, Badge, useDisclosure } from "@chakra-ui/react";
import NextLink from "next/link";
import { FiShoppingCart } from "react-icons/fi";
import { useCartStore } from "@/store/cartStore";
import { CartDrawer } from "./CartDrawer";

const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "Cliente", href: "/customer" },
    { label: "Artesão", href: "/artesao" },
    { label: "Admin", href: "/admin" },
];

export function HeaderCarrinho() {
    const { open, onOpen, onClose } = useDisclosure();
    const totalItems = useCartStore((state) => state.totalItems());

    return (
        <>
            <Box
                as="header"
                bg="neutral.white"
                shadow="sm"

            >
                <Container maxW="7xl">
                    <Flex h="16" align="center" justify="space-between">
                        {/* Logo / marca */}
                        <Text fontSize="xl" fontWeight="bold" color="brand.500">
                            Origem
                        </Text>

                        {/* Navegação principal */}
                        <Flex gap={6} align="center" fontWeight="medium" color="neutral.grayText">
                            {NAV_LINKS.map((link) => (
                                <Text asChild key={link.href} _hover={{ color: "brand.600" }}>
                                    <NextLink href={link.href}>{link.label}</NextLink>
                                </Text>
                            ))}
                        </Flex>

                        {/* Carrinho */}
                        <Button variant="outline" colorPalette="brand" onClick={onOpen} position="relative">
                            <FiShoppingCart />
                            Carrinho
                            {totalItems > 0 && (
                                <Badge
                                    ml={2}
                                    colorPalette="red"
                                    borderRadius="full"
                                    px={2}
                                    fontSize="xs"
                                >
                                    {totalItems}
                                </Badge>
                            )}
                        </Button>
                    </Flex>
                </Container>
            </Box>

            <CartDrawer open={open} onClose={onClose} />
        </>
    );
}
