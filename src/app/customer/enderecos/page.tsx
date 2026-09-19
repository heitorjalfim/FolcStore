'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';
import { Box, Button, Container, Flex, HStack, Spinner, Text } from '@chakra-ui/react';
import { FiArrowLeft } from 'react-icons/fi';
import { sessionStore } from '@/store/sessionStore';
import EnderecoManager from '../../components/EnderecoManager';

export default function CustomerEnderecosPage() {
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const isCustomerLogged = sessionStore((state) => state.isCustomerLogged);

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
        <Box minH="100vh" bg="gray.50" py={8}>
            <Container maxW="800px">
                <NextLink href="/customer/minha-conta">
                    <Button variant="ghost" size="sm" mb={6}>
                        <HStack gap={2}>
                            <FiArrowLeft />
                            <Text>Voltar para Sua Conta</Text>
                        </HStack>
                    </Button>
                </NextLink>

                <Box bg="white" p={6} rounded="lg" shadow="sm" border="1px solid" borderColor="gray.200">
                    <EnderecoManager />
                </Box>
            </Container>
        </Box>
    );
}