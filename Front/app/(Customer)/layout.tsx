'use client';
import '../globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import NavBar from './NavBar'
import { usePathname } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import userContext from '../contexts/userContext';
import useUserCheckToken from './users/hooks/useCheckToken';
import SecondLayout from './SecondLayout';
import localFont from 'next/font/local'
import Footer from './Footer';

const inter = Inter({ subsets: ['latin'] })
const pimaryFont = localFont({
  src: '../assets/fonts/Estedad-Regular.ttf',
  // display: 'swap',
})
const queryClient = new QueryClient();
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  
  return (
    <html lang="en" dir='rtl' data-theme = "light">
      <body className={pimaryFont.className}>
        <QueryClientProvider client={queryClient}>
          <SecondLayout children={children}/>
        </QueryClientProvider>
         
      </body>
      
    </html>
  )
}
