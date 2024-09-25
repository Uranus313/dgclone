'use client';
import '../../globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { usePathname } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import userContext from '../../contexts/userContext';
import SecondLayout from './SecondLayout';
import localFont from 'next/font/local'

const inter = Inter({ subsets: ['latin'] })
const pimaryFont = localFont({
  src: '../../assets/fonts/Estedad-Regular.ttf',
  // display: 'swap',
})
const queryClient = new QueryClient();
export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en" dir='rtl' data-theme="light">
      <body className={pimaryFont.className}>
        <QueryClientProvider client={queryClient}>
          <SecondLayout children={children} />
        </QueryClientProvider>
      </body>
    </html>
  )
}
