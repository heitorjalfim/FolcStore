"use client";

import {
    Box,
    Image,
    Text,
    Button,
    VStack,
    Badge,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { Product } from "@/types/product";
import { useCartStore } from "@/store/cartStore";

// Helper function to create a clean URL string from the title
function createSlug(titulo: string) {
    return titulo
        .toLowerCase()
        .normalize("NFD") // Removes accents
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-") // Replaces spaces and special chars with hyphens
        .replace(/(^-|-$)+/g, ""); // Removes leading or trailing hyphens
}

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const addItem = useCartStore((state) => state.addItem);
    const imageSrc = product.linkImagens?.[0] ?? "/placeholder-product.png";

    // Combine the slugified title and the ID
    const productUrl = `/product/${createSlug(product.titulo)}-${product.id}`;

    return (
        <Box
            as={NextLink}
            href={productUrl}
            display="block"
            bg="white"
            borderRadius="lg"
            overflow="hidden"
            shadow="md"
            transition="transform 0.2s"
            _hover={{ transform: "translateY(-4px)", shadow: "lg" }}
        >
            <Image
                src={imageSrc}
                alt={product.titulo}
                w="100%"
                h="200px"
                objectFit="cover"
            />
            <VStack p={4} align="stretch" gap={2}>
                <Badge colorScheme="purple" alignSelf="flex-start" fontSize="xs">
                    {product.categoria}
                </Badge>
                <Text fontWeight="bold" fontSize="md" lineClamp={1}>
                    {product.titulo}
                </Text>
                <Text fontSize="sm" color="gray.500" lineClamp={2}>
                    {product.descricao}
                </Text>
                <Text fontWeight="bold" fontSize="lg" color="brand.600">
                    R$ {product.preco.toFixed(2)}
                </Text>
                <Button
                    colorScheme="blue"
                    size="sm"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addItem(product);
                    }}
                >
                    Adicionar ao carrinho
                </Button>
            </VStack>
        </Box>
    );
}
