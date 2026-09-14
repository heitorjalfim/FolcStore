"use client";

// Essa diretiva indica que este arquivo roda no CLIENTE.
// No Next.js App Router, componentes são server por padrão.
// Como Chakra usa contexto e estado, ele precisa rodar no client.

import * as React from "react";

// Importa o Provider do Chakra.
// Ele injeta o sistema de tema e estilos na aplicação.
import { ChakraProvider } from "@chakra-ui/react";

// Biblioteca que permite alternar entre tema claro e escuro.
import { ThemeProvider } from "next-themes";

// Importamos o sistema de tema que criamos no arquivo anterior.
import { system } from "@/theme";


// Esse componente funciona como um "wrapper global" da aplicação.
// Ele envolve toda a aplicação e fornece os contextos necessários.
export function Provider({ children }: { children: React.ReactNode }) {

    return (

        // ThemeProvider controla o tema da aplicação.
        // attribute="class" -> aplica a classe CSS no HTML
        // defaultTheme="system" -> usa o tema do sistema operacional do usuário
        // enableSystem -> permite detectar automaticamente dark/light mode

        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>

            {/* ChakraProvider fornece o sistema de estilos e componentes do Chakra */}

            {/* value={system} passa o tema customizado que criamos */}

            <ChakraProvider value={system}>

                {/* children representa todo o resto da aplicação */}

                {children}

            </ChakraProvider>

        </ThemeProvider>
    );
}
