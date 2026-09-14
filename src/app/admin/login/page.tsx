'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { sessionStore } from '@/store/sessionStore';
import { userService } from '@/services/userService';
import {
    Box,
    Button,
    Flex,
    Field,
    Heading,
    Input,
    Text,
    VStack,
    Spinner
} from '@chakra-ui/react';

export default function AdminLoginPage() {
    const [mounted, setMounted] = useState(false);
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const salvarAdmin = sessionStore((state) => state.salvarAdmin);
    const isAdminLogged = sessionStore((state) => state.isAdminLogged)

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (isAdminLogged()) {
            router.push('/admin')
        }
    }, []);

    if (!mounted || isAdminLogged()) return (
        <Flex minH="80vh" align="center" justify="center">
            <Spinner size="xl" color="brand.500" />
        </Flex>
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const admin = await userService.loginAdmin(email, senha);

            if (admin) {
                salvarAdmin(admin);
                router.push('/admin');
            } else {
                setError('E-mail ou senha inválidos.');
            }
        } catch (err) {
            setError('Ocorreu um erro ao tentar fazer login.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Flex minH="80vh" align="center" justify="center">
            <Box bg="white" p={8} rounded="lg" shadow="sm" border="1px solid" borderColor="gray.200" w="full" maxW="md">
                <VStack spacing={6} align="stretch">
                    <Heading size="lg" textAlign="center" color="brand.500">
                        Login de Admin
                    </Heading>

                    {error && (
                        <Text color="red.500" fontSize="sm" textAlign="center" fontWeight="500">
                            {error}
                        </Text>
                    )}

                    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                        <VStack spacing={4}>
                            <Field.Root required>
                                <Field.Label>E-mail</Field.Label>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="seunome@email.com"
                                    bg="white"
                                />
                            </Field.Root>

                            <Field.Root required>
                                <Field.Label>Senha</Field.Label>
                                <Input
                                    type="password"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    placeholder="********"
                                    bg="white"
                                />
                            </Field.Root>

                            <Button
                                type="submit"
                                colorPalette="brand"
                                w="full"
                                loading={isLoading}
                                loadingText="Entrando..."
                                mt={2}
                            >
                                Entrar como Admin
                            </Button>
                        </VStack>
                    </form>
                </VStack>
            </Box>
        </Flex>
    )
}
