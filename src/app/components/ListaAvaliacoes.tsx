import { Box, Text, VStack } from "@chakra-ui/react";
import AvaliacaoCard from "./AvaliacaoCard";

type Avaliacao = {
    nota: number;
    comentario: string;
    data: string;
};

type ListaAvaliacoesProps = {
    avaliacoes: Avaliacao[];
    mostrarMedia?: boolean;
};

export default function ListaAvaliacoes({ avaliacoes, mostrarMedia }: ListaAvaliacoesProps) {
    if (avaliacoes.length === 0) {
        return (
            <Box p={4} textAlign="center">
                <Text color="gray.500">Ainda não há avaliações para esse vendedor.</Text>
            </Box>
        );
    }

    let media = null;
    if (mostrarMedia) {
        const soma = avaliacoes.reduce((total, avaliacao) => total + avaliacao.nota, 0);
        const mediaCalculada = (soma / avaliacoes.length).toFixed(1);
        media = (
            <Text fontSize="lg" fontWeight="bold" color="gray.800" mb={4}>
                Nota média: {mediaCalculada} / 5
            </Text>
        );
    }

    return (
        <VStack align="stretch" gap="{4}" w="full">
            {media}
            {avaliacoes.map((avaliacao, index) => (
                <AvaliacaoCard key={index} avaliacao={avaliacao} />
            ))}
        </VStack>
    );
}
