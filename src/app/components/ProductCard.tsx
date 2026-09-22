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

function createSlug(titulo: string) {
    return titulo
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
}

export interface ProductCardProps {
    product: Product;
    onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
    const addItem = useCartStore((state) => state.addItem);
    const imageSrc = product.linkImagens?.[0] ?? product.imagem ?? "/placeholder-product.png";
    const productUrl = `/product/${createSlug(product.titulo)}--${product.id}`;

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onAddToCart) {
            onAddToCart(product);
        } else {
            addItem(product);
        }
    };

    return (
        <NextLink href={productUrl} style={{ textDecoration: 'none', display: 'block' }}>
            <Box
                bg="bg"
                borderRadius="lg"
                overflow="hidden"
                shadow="md"
                borderWidth="1px"
                borderColor="border"
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
                    <Badge colorPalette="brand" alignSelf="flex-start" fontSize="xs">
                        {product.categoria}
                    </Badge>
                    <Text fontWeight="bold" fontSize="md" lineClamp={1} color="fg">
                        {product.titulo}
                    </Text>
                    <Text fontSize="sm" color="fg.muted" lineClamp={2}>
                        {product.descricao}
                    </Text>
                    <Text fontWeight="bold" fontSize="lg" color="brand.600">
                        R$ {Number(product.preco).toFixed(2)}
                    </Text>
                    <Button
                        colorPalette="brand"
                        size="sm"
                        onClick={handleAdd}
                    >
                        Adicionar ao carrinho
                    </Button>
                </VStack>
            </Box>
        </NextLink>
    );
}
