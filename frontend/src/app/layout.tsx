import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Footer from './components/Footer';

const inter = Inter({ subsets: ['latin'] });
require('dotenv').config();

const TITLE = process.env.TITLE;

export const metadata: Metadata = {
  title: TITLE ? TITLE : 'EventPass',
  description: TITLE ? TITLE + 'powered by EventPass' : 'EventPass',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Footer />
      </body>      
    </html>
  );
}
