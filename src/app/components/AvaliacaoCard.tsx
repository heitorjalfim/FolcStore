import { Box, Text } from '@chakra-ui/react';

type Avaliacao = {
    nota: number;
    comentario: string;
    data: string;
};

export default function AvaliacaoCard({ avaliacao }: { avaliacao: Avaliacao }) {
    return (
        <Box
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            p={5}
            maxW="sm"
            bg="white"
            boxShadow="sm"
        >
            <Text fontWeight="bold" fontSize="lg" mb={2}>
                Nota: {avaliacao.nota} / 5
            </Text>
            <Text color="gray.700" mb={4}>
                {avaliacao.comentario}
            </Text>
            <Text fontSize="sm" color="gray.500">
                {avaliacao.data}
            </Text>
        </Box>
    );
}
