"use client";

import { useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';
import { sessionStore } from '@/store/sessionStore';
import AvaliacaoCard from "../components/AvaliacaoCard";
import { Box, Button, Container, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { FiPackage, FiLogOut } from 'react-icons/fi';

// Função vazia estável para subscrição de hidratação
const emptySubscribe = () => () => {};

export default function Artesao() {
    const router = useRouter();

    // Padrão do React 19 para detetar o cliente sem recorrer a setState em useEffect
    const mounted = useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false
    );

    const logoutArtesao = sessionStore((state) => state.logoutArtesao);
    const isArtesaoLogged = sessionStore((state) => state.isArtesaoLogged);
    const artesao = sessionStore((state) => state.artesao);

    useEffect(() => {
        if (mounted && !isArtesaoLogged()) {
            router.push('/artesao/login');
        }
    }, [mounted, isArtesaoLogged, router]);

    if (!mounted || !isArtesaoLogged()) return null;

    const handleLogout = () => {
        logoutArtesao();
        router.push('/');
    };

    const avaliacoes = [
        { nota: 5, comentario: "Peça linda, chegou rápido!", data: "10/09/2026" },
        { nota: 4, comentario: "Muito bonita, só demorou um pouco.", data: "05/09/2026" },
        { nota: 5, comentario: "Superou minhas expectativas.", data: "01/09/2026" },
    ];

    const soma = avaliacoes.reduce((total, a) => total + a.nota, 0);
    const media = (soma / avaliacoes.length).toFixed(1);

    return (
        <Box minH="100vh" bg="gray.50" py={8}>
            <Container maxW="1000px">
                {/* Barra de Ações do Artesão */}
                <Box bg="white" p={6} borderRadius="xl" shadow="sm" borderWidth="1px" borderColor="gray.200" mb={8}>
                    <Flex justify="space-between" align="center">
                        <VStack align="start" gap={1}>
                            <Heading size="lg" color="brand.500">
                                Olá, {artesao?.nome || 'Mestre Artesão'}!
                            </Heading>
                            <Text color="gray.600" fontSize="sm">
                                Polo Regional: <b>{artesao?.regiaoProducao || 'Pernambuco'}</b>
                            </Text>
                        </VStack>

                        <HStack gap={3}>
                            <NextLink href="/artesao/produtos">
                                <Button colorPalette="brand" size="md">
                                    <HStack gap={2}>
                                        <FiPackage />
                                        <Text>Gerenciar Catálogo</Text>
                                    </HStack>
                                </Button>
                            </NextLink>

                            <Button variant="outline" colorPalette="red" size="md" onClick={handleLogout}>
                                <HStack gap={2}>
                                    <FiLogOut />
                                    <Text>Sair</Text>
                                </HStack>
                            </Button>
                        </HStack>
                    </Flex>
                </Box>

                {/* Avaliações */}
                <Box bg="white" p={6} borderRadius="xl" shadow="sm" borderWidth="1px" borderColor="gray.200">
                    <Heading size="md" mb={2}>Avaliações do Vendedor</Heading>
                    <Text fontSize="sm" color="gray.600" mb={6}>Nota média: <b>{media} / 5</b></Text>

                    <VStack align="stretch" gap={4}>
                        {avaliacoes.map((item, idx) => (
                            <AvaliacaoCard key={idx} avaliacao={item} />
                        ))}
                    </VStack>
                </Box>
            </Container>
        </Box>
    );
}