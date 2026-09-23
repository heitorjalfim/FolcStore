"use client";

import { useEffect, useState, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';
import { sessionStore } from '@/store/sessionStore';
import { userService } from '@/services/userService';
import { Box, Button, Container, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { FiArrowLeft } from 'react-icons/fi';

const emptySubscribe = () => () => { };

export default function EditarPerfilArtesao() {
    const router = useRouter();
    const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

    const artesao = sessionStore((state) => state.artesao);
    const isArtesaoLogged = sessionStore((state) => state.isArtesaoLogged);
    const salvarArtesao = sessionStore((state) => state.salvarArtesao);

    const [biografia, setBiografia] = useState(artesao?.biografia ?? '');
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState(false);
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        if (!mounted) return;
        if (!artesao) {
            router.push('/artesao/login');
        }
    }, [mounted, artesao, router]);

    if (!mounted || !isArtesaoLogged() || !artesao) return null;

    async function handleSalvar(e: React.FormEvent) {
        e.preventDefault();

        if (!artesao) return;

        if (biografia.trim() === '') {
            setErro('A biografia é obrigatória.');
            setSucesso(false);
            return;
        }

        setErro('');
        setSalvando(true);
        try {
            const artesaoAtualizado = await userService.atualizarArtesao(artesao.id, { biografia });
            salvarArtesao(artesaoAtualizado);
            setSucesso(true);
        } catch (error) {
            console.error('Erro ao atualizar perfil do artesão:', error);
            setErro('Não foi possível salvar sua biografia. Tente novamente.');
            setSucesso(false);
        } finally {
            setSalvando(false);
        }
    }

    return (
        <Box minH="100vh" bg="gray.50" py={8}>
            <Container maxW="600px">
                <HStack mb={4}>
                    <NextLink href="/artesao">
                        <Button variant="ghost" size="sm">
                            <HStack gap={2}><FiArrowLeft /><Text>Voltar</Text></HStack>
                        </Button>
                    </NextLink>
                </HStack>

                <Box bg="white" p={6} borderRadius="xl" shadow="sm" borderWidth="1px" borderColor="gray.200">
                    <Heading size="lg" color="brand.500" mb={6}>
                        Editar Perfil
                    </Heading>

                    <form onSubmit={handleSalvar}>
                        <VStack align="stretch" gap={4}>
                            {erro && (
                                <Text color="red.500" fontSize="sm" fontWeight="medium">
                                    {erro}
                                </Text>
                            )}
                            {sucesso && (
                                <Text color="green.600" fontSize="sm" fontWeight="medium">
                                    Biografia atualizada com sucesso!
                                </Text>
                            )}

                            <Box>
                                <Text mb={2} fontSize="sm" fontWeight="semibold" color="gray.700">
                                    Biografia
                                </Text>
                                {/* Usando textarea nativo estilizado (Chakra dá problema com esse elemento no projeto) */}
                                <textarea
                                    value={biografia}
                                    onChange={(e) => {
                                        setBiografia(e.target.value);
                                        setSucesso(false);
                                    }}
                                    placeholder="Conte um pouco sobre você e o seu trabalho..."
                                    rows={6}
                                    style={{
                                        width: "100%",
                                        padding: "8px 12px",
                                        borderRadius: "6px",
                                        border: "1px solid #E2E8F0",
                                        backgroundColor: "white",
                                        fontSize: "14px",
                                        outline: "none",
                                        resize: "vertical"
                                    }}
                                />
                            </Box>

                            <Button
                                type="submit"
                                colorPalette="brand"
                                size="md"
                                loading={salvando}
                                w="full"
                            >
                                Salvar Alterações
                            </Button>
                        </VStack>
                    </form>
                </Box>
            </Container>
        </Box>
    );
}
