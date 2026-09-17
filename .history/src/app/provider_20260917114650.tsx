"use client";

import { ChakraProvider } from "@chakra-ui/react";

import { system } from "../";

interface ProviderProps {
  children: React.ReactNode;
}

export function Provider({ children }: ProviderProps) {
  return <ChakraProvider value={system}>{children}</ChakraProvider>;
}