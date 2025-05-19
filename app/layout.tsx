import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AnimatedBackground } from "@/components/animated-background"
import { Analytics } from "@/components/analytics"
import { Suspense } from "react"
import Script from "next/script"
import { AuthProvider } from "@/context/AuthContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://keytake.ai"),
  title: {
    default: "Keytake - AI-Powered Video Notes",
    template: "%s | Keytake",
  },
  description:
    "Transform YouTube videos into comprehensive notes with Keytake's AI-powered platform. Save time and enhance learning.",
  keywords: [
    "video notes",
    "YouTube notes",
    "AI notes",
    "study tool",
    "learning platform",
    "video summarizer",
    "educational technology",
    "productivity tool",
  ],
  authors: [{ name: "Keytake Team" }],
  creator: "Keytake",
  publisher: "Keytake",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "https://keytake.ai",
    },
  },
  openGraph: {
    title: "Keytake - Transform YouTube Videos into Structured Notes with AI",
    description:
      "Save hours of study time with AI-generated notes from any educational video. Keytake converts videos into comprehensive, structured notes instantly.",
    url: "https://keytake.ai",
    siteName: "Keytake",
    images: [
      {
        url: "https://keytake.ai/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Keytake - AI-powered video notes platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Keytake - Transform YouTube Videos into Structured Notes with AI",
    description:
      "Save hours of study time with AI-generated notes from any educational video. Keytake converts videos into comprehensive, structured notes instantly.",
    images: ["https://keytake.ai/twitter-image.jpg"],
    creator: "@keytake",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  category: "education technology",
  applicationName: "Keytake",
  verification: {
    google: "YOUR_VERIFICATION_CODE",
  },
  generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Preconnect to important domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Structured data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Keytake",
              url: "https://keytake.ai",
              logo: "https://keytake.ai/logo.png",
              sameAs: [
                "https://twitter.com/keytake",
                "https://www.linkedin.com/company/keytake",
                "https://www.facebook.com/keytakeapp",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+1-555-123-4567",
                contactType: "customer service",
                email: "support@keytake.ai",
                availableLanguage: "English",
              },
            }),
          }}
        />

        {/* Structured data for SoftwareApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Keytake",
              applicationCategory: "EducationalApplication",
              operatingSystem: "Web, Chrome",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
                description: "Free plan with basic features",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                ratingCount: "1250",
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AnimatedBackground type="particles" intensity="medium" />
          <Header />
          <Suspense>
            <main className="flex-grow"><AuthProvider>
              {children}
            </AuthProvider></main>
          </Suspense>
          <Footer />
          <Analytics />
        </ThemeProvider>

        {/* Deferred loading of non-critical scripts */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-MEASUREMENT_ID" strategy="afterInteractive" />
      </body>
    </html>
  )
}
