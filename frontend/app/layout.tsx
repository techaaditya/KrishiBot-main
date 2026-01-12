import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Roboto, Libre_Baskerville, Alex_Brush, Oswald } from "next/font/google"
import SmoothScroll from "@/components/smooth-scroll"
{/* <Preloader /> */ }
import "./globals.css"

const roboto = Roboto({
  weight: ["300", "400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
})

const alexBrush = Alex_Brush({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-alex-brush",
  display: "swap",
})

const libreBaskerville = Libre_Baskerville({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-libre-baskerville",
  display: "swap",
})

const oswald = Oswald({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "KrishiBot",
    template: "%s | KrishiBot",
  },
  description: "Transform Nepal's agriculture with AI-powered crop recommendations, weather insights, and sustainable farming practices.",
  generator: "KrishiBot",
  icons: {
    icon: [{ url: "/images/krishibot-main-logo.png", type: "image/png" }],
    shortcut: [{ url: "/images/krishibot-main-logo.png", type: "image/png" }],
    apple: [{ url: "/images/krishibot-main-logo.png", type: "image/png" }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`font-sans antialiased ${roboto.variable} ${libreBaskerville.variable} ${alexBrush.variable} ${oswald.variable}`}
      >
        {/* <Preloader /> */}
        <SmoothScroll>{children}</SmoothScroll>
        <Analytics />
      </body>
    </html>
  )
}
