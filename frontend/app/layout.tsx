'use client';

import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import Link from "next/link"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/lib/auth.tsx'
import { Button } from "@/components/ui/button"
import { LockKeyhole } from "lucide-react"
import { usePathname } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const isAdminSection = pathname?.startsWith('/admin');

  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <AuthProvider>
          {!isAdminSection && (
            <header className="border-b">
              <div className="container mx-auto px-4 py-4 flex justify-end">
                <Link href="/admin/login">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <LockKeyhole className="h-4 w-4" />
                    Admin
                  </Button>
                </Link>
              </div>
            </header>
          )}
          <main className="flex-1 flex flex-col">{children}</main>
          <footer className="bg-muted">
            <div className="container mx-auto px-4 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-sm text-muted-foreground">
                  <p>&copy; {new Date().getFullYear()} Sri Lanka Bus Fare Finder. All rights reserved.</p>
                </div>
                <div className="flex gap-6 justify-start md:justify-end text-sm">
                  <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                  <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                  <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </footer>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}



import './globals.css'