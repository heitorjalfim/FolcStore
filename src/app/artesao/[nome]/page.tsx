import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import { userService } from "@/services/userService";

type PageProps = {
    params: Promise<{
        nome: string;
    }>;
};

export default async function ArtesaoPerfilPage({ params }: PageProps) {
    const resolvedParams = await params;
    const nomeSlug = decodeURIComponent(resolvedParams.nome);
    const nomeFormatado = nomeSlug.replace(/-/g, " ");

    // Opcional: Buscar dados reais do artesão pelo nome na API/JSON-Server
    // const artesao = await userService.getArtesaoByNome(nomeFormatado);

    return (
        <Box maxW="7xl" mx="auto" py={8} px={4}>
            <VStack spacing={6} align="start" w="full">
                <Heading as="h1" size="xl" color="gray.800" textTransform="capitalize">
                    {nomeFormatado}
                </Heading>

                <Box bg="white" p={6} borderWidth="1px" borderRadius="lg" w="full" boxShadow="sm">
                    <Text fontSize="lg" fontWeight="semibold" color="gray.700" mb={2}>
                        Sobre o Artesão
                    </Text>
                    <Text color="gray.600" mb={4}>
                        Aqui você encontrará a biografia, as regiões de produção e todos os produtos criados por este artesão.
                    </Text>
                </Box>
            </VStack>
        </Box>
    );
}
