import type React from "react"
import Link from "next/link"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div className="mb-6">
        <nav className="bg-secondary p-4 rounded-lg">
          <ul className="flex space-x-4">
            <li>
              <Link href="/admin" className="hover:underline font-medium">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:underline font-medium">
                Main Site
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      {children}
    </>
  )
}

