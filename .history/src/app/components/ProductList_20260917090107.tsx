"use client";

import { SimpleGrid, Spinner, Center, Text, VStack } from "@chakra-ui/react";
import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";

interface ProductListProps {
  products: Product[];
  isLoading: boolean;
  error: string | null;
}

export function ProductList({ products, isLoading, error }: ProductListProps) {
  if (isLoading) {
    return (
      <Center py={20}>
        <Spinner size="xl" color="brand.500" borderWidth="3px" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center py={20}>
        <VStack>
          <Text color="red.500" fontWeight="bold">
            Erro ao carregar produtos
          </Text>
          <Text color="gray.500" fontSize="sm">
            {error}
          </Text>
        </VStack>
      </Center>
    );
  }

  if (products.length === 0) {
    return (
      <Center py={20}>
        <Text color="gray.400">Nenhum produto encontrado.</Text>
      </Center>
    );
  }

  return (
    <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={6}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </SimpleGrid>
  );
}