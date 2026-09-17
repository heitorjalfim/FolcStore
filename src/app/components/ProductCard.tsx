"use client";

import {
  Box,
  Image,
  Text,
  Button,
  VStack,
  Badge,
} from "@chakra-ui/react";
import { Product } from "@/types/product";
import { useCartStore } from "@/store/cartStore";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <Box
      bg="white"
      borderRadius="lg"
      overflow="hidden"
      shadow="md"
      transition="transform 0.2s"
      _hover={{ transform: "translateY(-4px)", shadow: "lg" }}
    >
      <Image
        src={product.imagem}
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
          onClick={() => addItem(product)}
        >
          Adicionar ao carrinho
        </Button>
      </VStack>
    </Box>
  );
}