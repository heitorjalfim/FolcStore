"use client";

import {
  Drawer,
  Portal,
  VStack,
  HStack,
  Text,
  Button,
  IconButton,
  Image,
  Separator,
  Box,
} from "@chakra-ui/react";
import { FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";
import { useCartStore } from "@/store/cartStore";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } =
    useCartStore();

  return (
    <Drawer.Root
      open={open}
      onOpenChange={(e) => !e.open && onClose()}
      placement="end"
      size="md"
    >
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.CloseTrigger />
            <Drawer.Header borderBottomWidth="1px">Seu Carrinho</Drawer.Header>

            <Drawer.Body>
              {items.length === 0 ? (
                <VStack py={10} gap={3}>
                  <Text fontSize="lg" color="gray.400">
                    Carrinho vazio
                  </Text>
                  <Text fontSize="sm" color="gray.400">
                    Adicione produtos para começar.
                  </Text>
                </VStack>
              ) : (
                <VStack gap={4} py={4} align="stretch">
                  {items.map((item) => (
                    <Box key={item.product.id}>
                      <HStack gap={4}>
                        <Image
                          src={item.product.imagem}
                          alt={item.product.titulo}
                          boxSize="60px"
                          objectFit="cover"
                          borderRadius="md"
                        />
                        <VStack align="start" flex={1} gap={1}>
                          <Text fontWeight="semibold" fontSize="sm" lineClamp={1}>
                            {item.product.titulo}
                          </Text>
                          <Text fontSize="sm" color="brand.600" fontWeight="bold">
                            R$ {(item.product.preco * item.quantity).toFixed(2)}
                          </Text>
                          <HStack>
                            <IconButton
                              aria-label="Diminuir"
                              size="xs"
                              onClick={() =>
                                updateQuantity(item.product.id, item.quantity - 1)
                              }
                            >
                              <FiMinus />
                            </IconButton>
                            <Text fontSize="sm" fontWeight="medium" minW="20px" textAlign="center">
                              {item.quantity}
                            </Text>
                            <IconButton
                              aria-label="Aumentar"
                              size="xs"
                              onClick={() =>
                                updateQuantity(item.product.id, item.quantity + 1)
                              }
                            >
                              <FiPlus />
                            </IconButton>
                            <IconButton
                              aria-label="Remover"
                              size="xs"
                              colorPalette="red"
                              variant="ghost"
                              onClick={() => removeItem(item.product.id)}
                            >
                              <FiTrash2 />
                            </IconButton>
                          </HStack>
                        </VStack>
                      </HStack>
                      <Separator mt={4} />
                    </Box>
                  ))}
                </VStack>
              )}
            </Drawer.Body>

            {items.length > 0 && (
              <Drawer.Footer borderTopWidth="1px" flexDir="column" gap={3}>
                <HStack w="100%" justify="space-between">
                  <Text fontWeight="bold" fontSize="lg">
                    Total:
                  </Text>
                  <Text fontWeight="bold" fontSize="lg" color="brand.600">
                    R$ {totalPrice().toFixed(2)}
                  </Text>
                </HStack>
                <Button w="100%" colorPalette="brand">
                  Finalizar Compra
                </Button>
                <Button w="100%" variant="ghost" colorPalette="red" size="sm" onClick={clearCart}>
                  Limpar Carrinho
                </Button>
              </Drawer.Footer>
            )}
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}