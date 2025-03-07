'use client';

import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import Link from "next/link"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/lib/auth.tsx'

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <AuthProvider>
          <header className="bg-primary text-primary-foreground">
            <nav className="container mx-auto px-4 py-6">
              <ul className="flex space-x-4">
                <li>
                  <Link href="/" className="hover:underline">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:underline">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:underline">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:underline">
                    Contact
                  </Link>
                </li>
                <li className="ml-auto">
                  <Link href="/admin/login" className="hover:underline">
                    Admin Login
                  </Link>
                </li>
              </ul>
            </nav>
          </header>
          <main className="container mx-auto px-4 py-8 flex-grow">{children}</main>
          <footer className="bg-muted mt-auto">
            <div className="container mx-auto px-4 py-6 text-center">
              <p>&copy; {new Date().getFullYear()} Sri Lanka Bus Fare Finder. All rights reserved.</p>
            </div>
          </footer>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}



import './globals.css'