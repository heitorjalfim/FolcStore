import Link from 'next/link';

export const metadata = {
    title: 'Origem',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body style={{ fontFamily: 'sans-serif', margin: '20px' }}>
                <nav style={{ marginBottom: '20px', display: 'flex', gap: '15px' }}>
                    <Link href="/">Home</Link>
                    <Link href="/customer">Página Cliente</Link>
                    <Link href="/artesao">Página Artesão</Link>
                    <Link href="/debug">debug();</Link>
                </nav>
                {children}
            </body>
        </html>
    );
}
