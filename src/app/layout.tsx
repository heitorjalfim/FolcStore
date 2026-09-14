import { Metadata } from 'next';
import { Provider } from "@/app/provider";
import Link from 'next/link';
import { Box, Container, Flex, Text } from '@chakra-ui/react';
import "./globals.css";

export const metadata: Metadata = {
    title: 'Origem',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-BR" suppressHydrationWarning>
            <body suppressHydrationWarning>
                <Provider>
                    <div>
                        <Box
                            as="nav"
                            bg="white"
                            boxShadow="sm"
                            borderBottom="1px solid"
                            borderColor="gray.200"
                            position="sticky"
                            top="0"
                            zIndex="10"
                        >
                            <Container maxW="7xl">
                                <Flex h="16" align="center" justify="space-between">
                                    <Text fontSize="xl" fontWeight="bold" color="brand.500">
                                        Origem
                                    </Text>

                                    <Flex gap={6} align="center" fontWeight="500" color="gray.600">
                                        <Link href="/" style={linkStyle}>Home</Link>
                                        <Link href="/customer" style={linkStyle}>Cliente</Link>
                                        <Link href="/artesao" style={linkStyle}>Artesão</Link>
                                        <Link href="/admin" style={linkStyle}>Admin</Link>
                                        <Link href="/debug" style={linkStyle}>debug();</Link>
                                    </Flex>
                                </Flex>
                            </Container>
                        </Box>

                        <Box as="main" minH="100vh" bg="gray.50" pt={8} pb={12}>
                            <Container maxW="7xl">
                                {children}
                            </Container>
                        </Box>
                    </div>
                </Provider>
            </body>
        </html>
    );
}

const linkStyle = {
    textDecoration: 'none',
    transition: 'color 0.2s ease-in-out',
};
