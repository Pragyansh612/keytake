"use client"

import { usePathname, useSearchParams } from "next/navigation"
import Script from "next/script"
import { useEffect } from "react"

// Extend Window interface to include gtag
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void
  }
}

export function Analytics() {
  const pathname = usePathname()
  
  // Use try-catch or conditional rendering to handle useSearchParams
  let searchParams
  try {
    searchParams = useSearchParams()
  } catch (error) {
    // Handle the case where useSearchParams is not available during SSR
    searchParams = new URLSearchParams()
  }

  useEffect(() => {
    // Track page views when route changes
    if (typeof window !== 'undefined' && window.gtag) {
      const searchString = searchParams ? searchParams.toString() : ''
      const fullPath = pathname + (searchString ? `?${searchString}` : '')
      
      window.gtag("config", "G-MEASUREMENT_ID", {
        page_path: fullPath,
      })
    }
  }, [pathname, searchParams])

  return (
    <>
      {/* Google Analytics */}
      <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=G-MEASUREMENT_ID`} />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-MEASUREMENT_ID', {
              page_path: window.location.pathname + window.location.search,
            });
          `,
        }}
      />

      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Keytake",
            url: "https://keytake.com",
            description: "AI-powered platform that generates structured notes from YouTube videos",
            applicationCategory: "EducationalApplication",
            operatingSystem: "Web",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            creator: {
              "@type": "Organization",
              name: "Keytake",
              url: "https://keytake.com",
            },
          }),
        }}
      />
    </>
  )
}