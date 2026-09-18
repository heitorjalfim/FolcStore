'use client';

import { Box, Container, Heading, Text, Button, VStack, HStack, Card, Spinner, Flex, Stack, Separator, Input } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { sessionStore } from '@/store/sessionStore';
import NextLink from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

export default function CustomerSecurityPage() {
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [customerData, setCustomerData] = useState<any>(null);
    
    // Estados para controlar qual campo está em modo de edição
    const [editingField, setEditingField] = useState<string | null>(null);
    const [tempValue, setTempValue] = useState('');

    const router = useRouter();
    const isCustomerLogged = sessionStore((state) => state.isCustomerLogged);
    const customerSession = sessionStore((state) => state.customer);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (mounted && !isCustomerLogged()) {
            router.push('/customer/login');
            return;
        }

        if (mounted && isCustomerLogged()) {
            setCustomerData(customerSession);
            setIsLoading(false);
        }
    }, [mounted, isCustomerLogged, customerSession, router]);

    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return null; // Evita renderizar HTML divergente entre servidor e cliente
    }

    if (!isCustomerLogged()) {
        router.push('/customer/login');
        return null;
    }

    const handleEditClick = (field: string, currentValue: string) => {
        setEditingField(field);
        setTempValue(currentValue);
    };

    const handleSave = (field: string) => {
        // Atualiza o estado local do cliente (pode ser integrado com a API futuramente)
        const updated = { ...customerData, [field]: tempValue };
        setCustomerData(updated);
        // Atualiza também na sessionStore se necessário
        sessionStore.setState({ customer: updated });
        setEditingField(null);
    };

    return (
        <Box minH="100vh" bg="gray.50" py={8}>
            <Container maxW="900px">
             
                <HStack color="gray.600" fontSize="sm" mb={4} gap={2}>
                    <NextLink href="/customer/minha-conta">
                        <Text _hover={{ textDecoration: 'underline' }} color="brand.600">Sua conta</Text>
                    </NextLink>
                    <Text>&rsaquo;</Text>
                    <Text color="gray.800" fontWeight="semibold">Acesso e Segurança</Text>
                </HStack>

                <Heading size="xl" mb={6}>Acesso e Segurança</Heading>

             
                <Card.Root borderWidth="1px" borderRadius="lg" bg="white" shadow="sm" overflow="hidden">
                    <Stack gap={0}>
                        
                        {/* Nome */}
                        <Box p={5}>
                            <Flex justify="space-between" align="center">
                                <VStack align="start" gap={1} w="70%">
                                    <Text fontWeight="bold" fontSize="sm" color="gray.800">Nome:</Text>
                                    {editingField === 'nome' ? (
                                        <HStack w="full" mt={1}>
                                            <Input size="sm" value={tempValue} onChange={(e) => setTempValue(e.target.value)} />
                                            <Button size="sm" colorPalette="brand" onClick={() => handleSave('nome')}>Salvar</Button>
                                            <Button size="sm" variant="ghost" onClick={() => setEditingField(null)}>Cancelar</Button>
                                        </HStack>
                                    ) : (
                                        <Text fontSize="md" color="gray.700">{customerData?.nome || 'Não informado'}</Text>
                                    )}
                                </VStack>
                                {editingField !== 'nome' && (
                                    <Button variant="outline" size="sm" borderRadius="full" px={6} onClick={() => handleEditClick('nome', customerData?.nome)}>
                                        Editar
                                    </Button>
                                )}
                            </Flex>
                        </Box>

                        <Separator />

                        <Box p={5}>
                            <Flex justify="space-between" align="center">
                                <VStack align="start" gap={1} w="70%">
                                    <Text fontWeight="bold" fontSize="sm" color="gray.800">E-mail:</Text>
                                    {editingField === 'email' ? (
                                        <HStack w="full" mt={1}>
                                            <Input size="sm" value={tempValue} onChange={(e) => setTempValue(e.target.value)} />
                                            <Button size="sm" colorPalette="brand" onClick={() => handleSave('email')}>Salvar</Button>
                                            <Button size="sm" variant="ghost" onClick={() => setEditingField(null)}>Cancelar</Button>
                                        </HStack>
                                    ) : (
                                        <Text fontSize="md" color="gray.700">{customerData?.email || 'Não informado'}</Text>
                                    )}
                                </VStack>
                                {editingField !== 'email' && (
                                    <Button variant="outline" size="sm" borderRadius="full" px={6} onClick={() => handleEditClick('email', customerData?.email)}>
                                        Editar
                                    </Button>
                                )}
                            </Flex>
                        </Box>

                        <Separator />

                        
                        <Box p={5}>
                            <Flex justify="space-between" align="center">
                                <VStack align="start" gap={1} maxW="70%">
                                    <Text fontWeight="bold" fontSize="sm" color="gray.800">Número de celular principal:</Text>
                                    {editingField === 'telefone' ? (
                                        <HStack w="full" mt={1}>
                                            <Input size="sm" value={tempValue} onChange={(e) => setTempValue(e.target.value)} />
                                            <Button size="sm" colorPalette="brand" onClick={() => handleSave('telefone')}>Salvar</Button>
                                            <Button size="sm" variant="ghost" onClick={() => setEditingField(null)}>Cancelar</Button>
                                        </HStack>
                                    ) : (
                                        <>
                                            <Text fontSize="md" color="gray.700">{customerData?.telefone || 'Não informado'}</Text>
                                            <Text fontSize="xs" color="gray.500">
                                                Faça login rapidamente, recupere senhas com facilidade e receba notificações de segurança com esse número de celular.
                                            </Text>
                                        </>
                                    )}
                                </VStack>
                                {editingField !== 'telefone' && (
                                    <Button variant="outline" size="sm" borderRadius="full" px={6} onClick={() => handleEditClick('telefone', customerData?.telefone)}>
                                        Editar
                                    </Button>
                                )}
                            </Flex>
                        </Box>

                        <Separator />

                        <Box p={5}>
                            <Flex justify="space-between" align="center">
                                <VStack align="start" gap={1} w="70%">
                                    <Text fontWeight="bold" fontSize="sm" color="gray.800">Senha:</Text>
                                    {editingField === 'senha' ? (
                                        <VStack w="full" mt={1} align="stretch" gap={2}>
                                            <Input size="sm" type="password" placeholder="Nova senha" value={tempValue} onChange={(e) => setTempValue(e.target.value)} />
                                            <HStack>
                                                <Button size="sm" colorPalette="brand" onClick={() => handleSave('senha')}>Salvar</Button>
                                                <Button size="sm" variant="ghost" onClick={() => setEditingField(null)}>Cancelar</Button>
                                            </HStack>
                                        </VStack>
                                    ) : (
                                        <Text fontSize="md" color="gray.700" letterSpacing="widest">********</Text>
                                    )}
                                </VStack>
                                {editingField !== 'senha' && (
                                    <Button variant="outline" size="sm" borderRadius="full" px={6} onClick={() => handleEditClick('senha', '')}>
                                        Editar
                                    </Button>
                                )}
                            </Flex>
                        </Box>

                        <Separator />

                       
                        <Box p={5}>
                            <Flex justify="space-between" align="center">
                                <VStack align="start" gap={1}>
                                    <Text fontWeight="bold" fontSize="sm" color="gray.800">CPF:</Text>
                                    <Text fontSize="md" color="gray.700" letterSpacing="widest">***.***.***-**</Text>
                                </VStack>
                                <Button variant="outline" size="sm" borderRadius="full" px={4} colorPalette="gray">
                                    Confirme as Informações pessoais
                                </Button>
                            </Flex>
                        </Box>

                    </Stack>
                </Card.Root>

                {/* Botão inferior para voltar */}
                <Box mt={6}>
                    <NextLink href="/customer/minha-conta">
                        <Button variant="ghost" size="sm">
                            <HStack gap={2}>
                                <FiArrowLeft />
                                <Text>Voltar para Sua Conta</Text>
                            </HStack>
                        </Button>
                    </NextLink>
                </Box>
            </Container>
        </Box>
    );
}