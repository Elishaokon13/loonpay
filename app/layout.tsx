import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { DemoModeToggle } from "@/components/demo-mode-toggle"
import { ExchangeRateDisplay } from "@/components/exchange-rate-display"

// Initialize the Inter font
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
})

// Add viewport meta tag for better mobile experience
export const metadata = {
  title: "Gift Card to USDC Exchange",
  description: "Convert your unused gift cards to USDC quickly and securely",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#10b981" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={inter.className}>
        <div className="fixed top-4 right-4 z-10">
          <DemoModeToggle />
        </div>
        <div className="fixed bottom-0 left-0 right-0 z-10 p-2">
          <ExchangeRateDisplay />
        </div>
        {children}
      </body>
    </html>
  )
}


import './globals.css'