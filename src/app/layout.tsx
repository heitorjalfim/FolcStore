import { Provider } from "./provider";
import { HeaderCarrinho } from "@/app/components/HeaderCarrinho";
import { Footer } from "@/app/components/Footer"; // Ajuste o caminho caso tenha criado em outra subpasta (ex: src/app/components/layout/Footer)

export const metadata = {
    title: "FolcStore - Marketplace de Artesanato de Pernambuco",
    description: "Plataforma dedicada à valorização cultural e comercialização sustentável do artesanato autêntico pernambucano.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR">
            <body suppressHydrationWarning={true} style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', margin: 0 }}>
                <Provider>
                    {/* Cabeçalho Global */}
                    <HeaderCarrinho />

                    {/* Conteúdo Dinâmico da Rota */}
                    <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        {children}
                    </main>

                    {/* Rodapé Global */}
                    <Footer />
                </Provider>
            </body>
        </html>
    );
}