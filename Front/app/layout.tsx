'use client';
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import NavBar from './NavBar'
import { SessionProvider } from 'next-auth/react'
import localFont from 'next/font/local'
import Footer from './Footer';

const inter = Inter({ subsets: ['latin'] })
const pimaryFont = localFont({
  src: './assets/fonts/Estedad-Regular.ttf',
  // display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir='rtl'>
      <body className={pimaryFont.className}>
         <SessionProvider>
         <NavBar/>
          <main className=''>
            {children}
          </main>
         <Footer/>
         </SessionProvider>
         
      </body>
      
    </html>
  )
}
