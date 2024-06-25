import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Footer from './components/Common/Footer';
import { UserProvider } from './context/UserContext';

const inter = Inter({ subsets: ['latin'] });
require('dotenv').config();

const TITLE = process.env.NEXT_PUBLIC_TITLE;

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
        <UserProvider>{children}</UserProvider>
        <Footer />
      </body>
    </html>
  );
}
