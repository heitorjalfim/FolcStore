"use client";

import { HStack, Button } from "@chakra-ui/react";

interface CategoryFilterProps {
  categories: string[];
  selected: string | null;
  onSelect: (category: string | null) => void;
}

export function CategoryFilter({
  categories,
  selected,
  onSelect,
}: CategoryFilterProps) {
  return (
    <HStack gap={3} wrap="wrap" py={4}>
      <Button
        size="sm"
        variant={selected === null ? "solid" : "outline"}
        colorScheme="blue"
        onClick={() => onSelect(null)}
      >
        Todos
      </Button>
      {categories.map((cat) => (
        <Button
          key={cat}
          size="sm"
          variant={selected === cat ? "solid" : "outline"}
          colorPalette="brand"
          onClick={() => onSelect(cat)}
        >
          {cat}
        </Button>
      ))}
    </HStack>
  );
}