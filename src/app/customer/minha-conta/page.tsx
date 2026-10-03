'use client';

import { Box, Container, Heading, SimpleGrid, Card, Text, VStack, HStack, Icon, Spinner, Flex, Button } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { sessionStore } from '@/store/sessionStore';
import NextLink from 'next/link';
import { FiBox, FiMapPin, FiLock, FiArrowLeft } from 'react-icons/fi';

const accountSections = [
    {
        title: "Seus pedidos",
        description: "Rastrear, devolver ou ver histórico de compras",
        icon: FiBox,
        href: "/customer/pedidos"
    },
    {
        title: "Seus endereços",
        description: "Ver endereços salvos ou adicionar novos para entrega",
        icon: FiMapPin,
        href: "/customer/enderecos"
    },
    {
        title: "Acesso e segurança",
        description: "Gerenciar senha, e-mail e dados pessoais",
        icon: FiLock,
        href: "/customer/seguranca"
    }
];

export default function CustomerAccountHubPage() {
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const isCustomerLogged = sessionStore((state) => state.isCustomerLogged);
    const customer = sessionStore((state) => state.customer);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (mounted && !isCustomerLogged()) {
            router.push('/customer/login');
        }
    }, [mounted, isCustomerLogged, router]);

    if (!mounted || !isCustomerLogged()) {
        return (
            <Flex minH="80vh" align="center" justify="center">
                <Spinner size="xl" color="brand.500" />
            </Flex>
        );
    }

    return (
        <Box minH="100vh" bg="gray.50">
            {/* Header só com a logo */}
            <Box as="header" bg="gray.900" color="white" py={4} px={{ base: 4, md: 8 }} shadow="sm">
                <Container maxW="1200px">
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
                </Container>
            </Box>

            <Container maxW="1100px" py={8}>
                {/* Botão de voltar para a vitrine */}
                <NextLink href="/customer">
                    <Button variant="ghost" size="sm" mb={6}>
                        <HStack gap={2}>
                            <FiArrowLeft />
                            <Text>Voltar para a Loja</Text>
                        </HStack>
                    </Button>
                </NextLink>

                <VStack align="start" mb={8} gap={1}>
                    <Heading size="xl">Sua Conta</Heading>
                    <Text color="gray.600">Olá, <b>{customer?.nome}</b></Text>
                </VStack>

                {/* Grid com as seções da conta */}
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
                    {accountSections.map((section) => (
                        <NextLink key={section.href} href={section.href} style={{ textDecoration: 'none' }}>
                            <Card.Root
                                p={6}
                                borderWidth="1px"
                                borderRadius="lg"
                                bg="white"
                                height="100%"
                                _hover={{ shadow: "md", borderColor: "brand.500", transform: "translateY(-2px)" }}
                                transition="all 0.2s"
                                cursor="pointer"
                            >
                                <HStack align="flex-start" gap={4}>
                                    <Box p={3} bg="brand.50" color="brand.500" borderRadius="md">
                                        <Icon as={section.icon} boxSize={6} />
                                    </Box>
                                    <VStack align="start" gap={1}>
                                        <Text fontWeight="bold" fontSize="lg" color="gray.800">
                                            {section.title}
                                        </Text>
                                        <Text color="gray.500" fontSize="sm">
                                            {section.description}
                                        </Text>
                                    </VStack>
                                </HStack>
                            </Card.Root>
                        </NextLink>
                    ))}
                </SimpleGrid>
            </Container>
        </Box>
    );
}