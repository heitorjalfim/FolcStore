"use client";

import { useEffect, useState } from "react";
import { Box, Container, Heading, HStack, Input, InputGroup, Button, Text, VStack } from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";
import { Product } from "@/types/product";
//import { productService } from "@/services/productService";
import { Header } from "../app/components/Header";
import { CategoryFilter } from "../app/components/CategoryFilter";
import { ProductList } from "../app/components/ProductList";

export default function Home() {
  const [allProducts, setAllProducts] = useState<Product[]>([]); 
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState(""); 

  // Carrega todos os produtos uma vez na inicialização
  useEffect(() => {
    async function loadProducts() {
      try {
        setIsLoading(true);
        setError(null);

       // const data = await productService.getAll();
        setAllProducts(data);
        setDisplayedProducts(data);
      } catch (err) {
        setError("Não foi possível carregar os produtos. Verifique se a API está rodando.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, []);

  // Função centralizada de busca (pode ser chamada de forma imediata)
  async function handleSearch(termOverride?: string) {
    const term = (termOverride !== undefined ? termOverride : searchInput).trim();

   /* try {
      setIsLoading(true);
      setError(null);

      const data = term
        ? await productService.searchByText(term)
        : await productService.getAll();

      setDisplayedProducts(data);
    } catch (err) {
      setError("Não foi possível buscar os produtos. Verifique se a API está rodando.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }*/
  } 

  // Busca automática a cada letra digitada (com debounce de 300ms)
  useEffect(() => {
    if (allProducts.length === 0 && !isLoading) return;

    const delayDebounceFn = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchInput]);

  const categories = Array.from(new Set(allProducts.map((p) => p.categoria))).sort();

  const filteredProducts = selectedCategory
    ? displayedProducts.filter((p) => p.categoria === selectedCategory)
    : displayedProducts;

  return (
    <Box minH="100vh">
      <Header />
      <Container maxW="1200px" py={8}>
        <VStack align="stretch" gap={6}>
          <Box>
            <Heading size="lg" mb={1}>
              Nossos Produtos
            </Heading>
            <Text color="gray.500">
              Encontre o que procura na nossa loja
            </Text>
          </Box>

          <HStack
            gap={0}
            bg="accent.cream"
            borderRadius="full"
            p={1.5}
            maxW="650px"
            borderWidth="1px"
            borderColor="neutral.border"
          >
            <InputGroup startElement={<LuSearch color="var(--chakra-colors-neutral-muted)" />} flex={1}>
              <Input
                placeholder="Search crafts, artisans, city or material"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch(); // Busca imediata ao apertar Enter
                  }
                }}
                variant="subtle"
                bg="transparent"
                border="none"
                _focus={{ boxShadow: "none" }}
              />
            </InputGroup>
            
            {/* Botão funcional que dispara a busca imediatamente ao ser clicado */}
            <Button
              colorPalette="brand"
              borderRadius="full"
              px={8}
              onClick={() => handleSearch()}
              loading={isLoading}
            >
              Search
            </Button>
          </HStack>

          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />

          <ProductList
            products={filteredProducts}
            isLoading={isLoading}
            error={error}
          />
        </VStack>
      </Container>
    </Box>
  );
}