import type { Metadata } from 'next';
import { IBM_Plex_Mono, Inter } from 'next/font/google';
import './globals.css';

const fontSans = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
});

const fontMono = IBM_Plex_Mono({
    subsets: ['latin'],
    weight: ['400', '500', '600'],
    variable: '--font-plex-mono',
});

export const metadata: Metadata = {
    title: 'Nordwell — Investment Tracker',
    description: 'A minimal, premium portfolio tracker.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
    return (
        <html
            lang='en'
            className={`${fontSans.variable} ${fontMono.variable} h-full antialiased`}>
            <body className='min-h-full flex flex-col'>{children}</body>
        </html>
    );
}
