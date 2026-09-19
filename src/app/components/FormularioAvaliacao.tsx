"use client";

import { useState } from "react";
import { Box, Button, Text, VStack } from "@chakra-ui/react";

type FormularioAvaliacaoProps = {
    onEnviar: (avaliacao: { nota: number; comentario: string; data: string }) => void;
};

const pedidoSimulado = {
    status: "Entregue",
    jaAvaliado: false,
};

export default function FormularioAvaliacao({ onEnviar }: FormularioAvaliacaoProps) {
    const [comentario, setComentario] = useState("");
    const [nota, setNota] = useState(5);
    const [erro, setErro] = useState("");

    function enviarAvaliacao() {
        if (pedidoSimulado.status !== "Entregue") {
            setErro("Você só pode avaliar pedidos que já foram entregues.");
            return;
        }

        if (pedidoSimulado.jaAvaliado) {
            setErro("Esse pedido já foi avaliado.");
            return;
        }

        setErro("");

        const novaAvaliacao = {
            nota: nota,
            comentario: comentario,
            data: new Date().toLocaleDateString("pt-BR"),
        };
        onEnviar(novaAvaliacao);
        setComentario("");
        setNota(5);
    }

    return (
        <Box
            borderWidth="1px"
            borderRadius="lg"
            p={6}
            maxW="md"
            bg="white"
            boxShadow="sm"
        >
            <VStack align="stretch" gap="{4}">
                {erro && (
                    <Text color="red.500" fontSize="sm" fontWeight="medium">
                        {erro}
                    </Text>
                )}

                <Box>
                    <Text mb={2} fontSize="sm" fontWeight="semibold" color="gray.700">
                        Nota
                    </Text>
                    {/* Usando select nativo para evitar erros de objeto do Chakra */}
                    <select
                        value={nota}
                        onChange={(e) => setNota(Number(e.target.value))}
                        style={{
                            width: "100%",
                            padding: "8px 12px",
                            borderRadius: "6px",
                            border: "1px solid #E2E8F0",
                            backgroundColor: "white",
                            fontSize: "14px",
                            outline: "none"
                        }}
                    >
                        <option value={1}>1 - Muito Ruim</option>
                        <option value={2}>2 - Ruim</option>
                        <option value={3}>3 - Regular</option>
                        <option value={4}>4 - Bom</option>
                        <option value={5}>5 - Excelente</option>
                    </select>
                </Box>

                <Box>
                    <Text mb={2} fontSize="sm" fontWeight="semibold" color="gray.700">
                        Comentário
                    </Text>
                    {/* Usando textarea nativo estilizado */}
                    <textarea
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                        placeholder="Escreva sua avaliação..."
                        rows={4}
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
                    colorScheme="blue"
                    onClick={enviarAvaliacao}
                    w="full"
                >
                    Enviar Avaliação
                </Button>
            </VStack>
        </Box>
    );
}
