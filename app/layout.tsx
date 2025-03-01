import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Navigation from "../components/Navigation"
import Footer from "../components/Footer"
import { headers } from 'next/headers'
import { ThemeProvider } from "../components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NaviGo - Your Navigation Assistant",
  description: "Smart navigation and route planning made simple",
  generator: 'Next.js'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = headers()
  const pathname = headersList.get('x-invoke-path') || ''
  const isAdminRoute = pathname.startsWith('/admin')

  if (isAdminRoute) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} bg-white transition-colors duration-300`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    )
  }

  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={`${inter.className} bg-white dark:bg-gray-900 h-full transition-colors duration-300`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          {/* Background decorative elements */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-float"></div>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-float" style={{ animationDelay: "2s" }}></div>
          </div>

          {/* Main content */}
          <div className="relative z-10 min-h-screen flex flex-col">
            <Navigation />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}