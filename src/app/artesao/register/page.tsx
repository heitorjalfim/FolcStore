'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { userService } from '@/services/userService';
import { sessionStore } from '@/store/sessionStore';
import { Artesao } from '@/types';
import {
    Box,
    Button,
    Flex,
    Field,
    Heading,
    Input,
    Text,
    VStack,
    Grid,
    GridItem,
    Textarea
} from '@chakra-ui/react';

export default function ArtesaoRegisterPage() {
    const router = useRouter();

    const [formData, setFormData] = useState<Omit<Artesao, 'id'>>({
        nome: '',
        cpf: '',
        email: '',
        senha: '',
        regiaoProducao: '',
        telefone: '',
        biografia: ''
    });

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Função genérica para atualizar os campos do formulário
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const salvarArtesao = sessionStore((state) => state.salvarArtesao);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const novoArtesao = await userService.registerArtesao(formData);

            // Login imediato e redirecionamento
            salvarArtesao(novoArtesao);
            router.push('/artesao');

        } catch (err: any) {
            // Tratamos os erros personalizados aqui no catch
            if (err.message === 'EMAIL_EXISTS') {
                setError('Este e-mail já está cadastrado.');
            } else if (err.message === 'CPF_EXISTS') {
                setError('Este CPF já está cadastrado.');
            } else {
                setError('Ocorreu um erro ao tentar registrar. Verifique os dados e tente novamente.');
                console.error(err);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Flex minH="80vh" align="center" justify="center" py={8}>
            <Box bg="white" p={8} rounded="lg" shadow="sm" border="1px solid" borderColor="gray.200" w="full" maxW="2xl">
                <VStack align="stretch" gap="{6}">
                    <Heading size="lg" textAlign="center" color="brand.500">
                        Registro de Artesão
                    </Heading>

                    <Text textAlign="center" color="gray.600" fontSize="sm">
                        Crie sua conta para começar a vender seus produtos artesanais.
                    </Text>

                    {error && (
                        <Text color="red.500" fontSize="sm" textAlign="center" fontWeight="500">
                            {error}
                        </Text>
                    )}

                    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
                            {/* Nome (Ocupa 2 colunas no desktop) */}
                            <GridItem colSpan={{ base: 1, md: 2 }}>
                                <Field.Root required>
                                    <Field.Label>Nome Completo</Field.Label>
                                    <Input
                                        name="nome"
                                        value={formData.nome}
                                        onChange={handleChange}
                                        placeholder="Seu nome completo"
                                    />
                                </Field.Root>
                            </GridItem>

                            {/* CPF */}
                            <GridItem colSpan={1}>
                                <Field.Root required>
                                    <Field.Label>CPF</Field.Label>
                                    <Input
                                        name="cpf"
                                        value={formData.cpf}
                                        onChange={handleChange}
                                        placeholder="000.000.000-00"
                                    />
                                </Field.Root>
                            </GridItem>

                            {/* Telefone */}
                            <GridItem colSpan={1}>
                                <Field.Root required>
                                    <Field.Label>Telefone</Field.Label>
                                    <Input
                                        name="telefone"
                                        value={formData.telefone}
                                        onChange={handleChange}
                                        placeholder="(00) 00000-0000"
                                    />
                                </Field.Root>
                            </GridItem>

                            {/* E-mail */}
                            <GridItem colSpan={1}>
                                <Field.Root required>
                                    <Field.Label>E-mail</Field.Label>
                                    <Input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="artesao@email.com"
                                    />
                                </Field.Root>
                            </GridItem>

                            {/* Senha */}
                            <GridItem colSpan={1}>
                                <Field.Root required>
                                    <Field.Label>Senha</Field.Label>
                                    <Input
                                        type="password"
                                        name="senha"
                                        value={formData.senha}
                                        onChange={handleChange}
                                        placeholder="********"
                                    />
                                </Field.Root>
                            </GridItem>

                            {/* Região de Produção (Ocupa 2 colunas) */}
                            <GridItem colSpan={{ base: 1, md: 2 }}>
                                <Field.Root required>
                                    <Field.Label>Região de Produção</Field.Label>
                                    <Input
                                        name="regiaoProducao"
                                        value={formData.regiaoProducao}
                                        onChange={handleChange}
                                        placeholder="Ex: Vale do Jequitinhonha, MG"
                                    />
                                </Field.Root>
                            </GridItem>

                            {/* Biografia (Ocupa 2 colunas) */}
                            <GridItem colSpan={{ base: 1, md: 2 }}>
                                <Field.Root required>
                                    <Field.Label>Biografia</Field.Label>
                                    <Textarea
                                        name="biografia"
                                        value={formData.biografia}
                                        onChange={handleChange}
                                        placeholder="Conte um pouco sobre sua história e sua arte..."
                                        rows={4}
                                        resize="vertical"
                                    />
                                </Field.Root>
                            </GridItem>

                            {/* Botões (Ocupa 2 colunas) */}
                            <GridItem colSpan={{ base: 1, md: 2 }}>
                                <VStack gap="{3}" mt="{4}">
                                    <Button
                                        type="submit"
                                        colorPalette="brand"
                                        w="full"
                                        loading={isLoading}
                                        loadingText="Registrando..."
                                    >
                                        Criar conta de Artesão
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        colorPalette="brand"
                                        w="full"
                                        onClick={() => router.push('/artesao/login')}
                                    >
                                        Já tem uma conta? Faça login
                                    </Button>
                                </VStack>
                            </GridItem>
                        </Grid>
                    </form>
                </VStack>
            </Box>
        </Flex>
    );
}
