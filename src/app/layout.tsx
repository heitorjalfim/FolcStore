import { Provider } from "./provider";

export const metadata = {
    title: "Mini Loja",
    description: "Uma mini loja de produtos artesanais.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR">
            <body suppressHydrationWarning={true}>
                <Provider>{children}</Provider>
            </body>
        </html>
    );
}
