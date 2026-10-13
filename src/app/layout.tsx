import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Mono, Space_Grotesk } from 'next/font/google';
import './globals.css';

const fontSans = Space_Grotesk({
    subsets: ['latin', 'latin-ext'],
    variable: '--font-space-grotesk',
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

export const viewport: Viewport = {
    themeColor: '#F7F7F5',
    viewportFit: 'cover',
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
