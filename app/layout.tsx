import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
// import { AnimatedBackground } from "@/components/animated-background"
import { Analytics } from "@/components/analytics"
import { Suspense } from "react"
import Script from "next/script"
import { AuthProvider } from "@/context/AuthContext"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://keytake.ai"),
  title: {
    default: "Keytake - AI-Powered Video Notes | Transform YouTube Videos into Structured Notes",
    template: "%s | Keytake",
  },
  description:
    "Transform YouTube videos into comprehensive, structured notes with Keytake's AI-powered platform. Save time and enhance learning with intelligent video analysis and note generation.",
  keywords: [
    "video notes",
    "YouTube notes",
    "AI notes",
    "study tool",
    "learning platform",
    "video summarizer",
    "educational technology",
    "productivity tool",
    "AI-powered learning",
    "note-taking app",
    "video analysis",
    "structured notes",
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
        type: "image/jpeg",
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
    site: "@keytake",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: "cover",
  },
  category: "education technology",
  applicationName: "Keytake",
  verification: {
    google: "YOUR_VERIFICATION_CODE",
    yandex: "YOUR_YANDEX_VERIFICATION",
    yahoo: "YOUR_YAHOO_VERIFICATION",
  },
  generator: 'v0.dev',
  referrer: 'origin-when-cross-origin',
}

// Loading component for better UX
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
    </div>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        {/* Favicons and app icons */}
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="color-scheme" content="light dark" />

        {/* Preconnect to important domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" />
        
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Structured data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Keytake",
              url: "https://keytake.ai",
              logo: {
                "@type": "ImageObject",
                url: "https://keytake.ai/logo.png",
                width: 512,
                height: 512,
              },
              description: "AI-powered video notes platform that transforms YouTube videos into structured notes",
              foundingDate: "2024",
              sameAs: [
                "https://twitter.com/keytake",
                "https://www.linkedin.com/company/keytake",
                "https://www.facebook.com/keytakeapp",
                "https://github.com/keytake",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+1-555-123-4567",
                contactType: "customer service",
                email: "support@keytake.ai",
                availableLanguage: ["English"],
                areaServed: "Worldwide",
              },
              address: {
                "@type": "PostalAddress",
                addressCountry: "US",
                addressRegion: "CA",
                addressLocality: "San Francisco",
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
              description: "Transform YouTube videos into structured notes with AI-powered analysis",
              applicationCategory: "EducationalApplication",
              applicationSubCategory: "Note-taking",
              operatingSystem: "Web, Chrome, Safari, Firefox, Edge",
              url: "https://keytake.ai",
              downloadUrl: "https://keytake.ai/download",
              screenshot: "https://keytake.ai/screenshot.jpg",
              softwareVersion: "2.0",
              datePublished: "2024-01-01",
              publisher: {
                "@type": "Organization",
                name: "Keytake",
              },
              offers: [
                {
                  "@type": "Offer",
                  price: "0",
                  priceCurrency: "USD",
                  description: "Free plan with basic features",
                  category: "Free",
                },
                {
                  "@type": "Offer",
                  price: "9.99",
                  priceCurrency: "USD",
                  description: "Pro plan with advanced features",
                  category: "Subscription",
                  priceSpecification: {
                    "@type": "UnitPriceSpecification",
                    price: "9.99",
                    priceCurrency: "USD",
                    unitCode: "MON",
                  },
                },
              ],
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                ratingCount: "1250",
                bestRating: "5",
                worstRating: "1",
              },
              featureList: [
                "AI-powered video analysis",
                "Structured note generation",
                "YouTube integration",
                "Export to multiple formats",
                "Collaboration tools",
                "Chrome extension",
              ],
            }),
          }}
        />

        {/* Structured data for WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Keytake",
              url: "https://keytake.ai",
              description: "Transform YouTube videos into structured notes with AI",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://keytake.ai/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
              publisher: {
                "@type": "Organization",
                name: "Keytake",
              },
            }),
          }}
        />

        {/* Structured data for BreadcrumbList */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://keytake.ai",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Dashboard",
                  item: "https://keytake.ai/dashboard",
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: "Explore",
                  item: "https://keytake.ai/explore",
                },
              ],
            }),
          }}
        />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col antialiased selection:bg-foreground/10`}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem
          disableTransitionOnChange={false}
        >
          {/* Skip to content link for accessibility */}
          <a 
            href="#main-content" 
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-foreground text-background px-4 py-2 rounded-md z-[100] focus:outline-none focus:ring-2 focus:ring-foreground/20"
          >
            Skip to main content
          </a>

          {/* Optional animated background */}
          {/* <AnimatedBackground type="particles" intensity="medium" /> */}
          
          <AuthProvider>
            <Header />
            
            <Suspense fallback={<LoadingSpinner />}>
              <main id="main-content" className="flex-grow relative">
                {children}
              </main>
            </Suspense>
            
            <Footer />
          </AuthProvider>
          
          <Analytics />
          
          {/* Scroll to top indicator */}
          <div id="scroll-top-anchor" className="absolute top-0 left-0 w-1 h-1 pointer-events-none" />
        </ThemeProvider>

        {/* Performance monitoring and error tracking */}
        <Script
          id="performance-observer"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Basic performance monitoring
              if ('PerformanceObserver' in window) {
                const observer = new PerformanceObserver((list) => {
                  const entries = list.getEntries();
                  entries.forEach((entry) => {
                    // Log performance metrics for monitoring
                    if (entry.entryType === 'navigation') {
                      console.log('Navigation timing:', entry.duration);
                    }
                    if (entry.entryType === 'largest-contentful-paint') {
                      console.log('LCP:', entry.startTime);
                    }
                    if (entry.entryType === 'first-input') {
                      console.log('FID:', entry.processingStart - entry.startTime);
                    }
                    if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
                      console.log('CLS:', entry.value);
                    }
                  });
                });
                
                try {
                  observer.observe({ entryTypes: ['navigation', 'largest-contentful-paint', 'first-input', 'layout-shift'] });
                } catch (e) {
                  // Fallback for browsers that don't support all entry types
                  observer.observe({ entryTypes: ['navigation'] });
                }
              }
            `,
          }}
        />

        {/* Google Analytics */}
        <Script 
          src="https://www.googletagmanager.com/gtag/js?id=G-MEASUREMENT_ID" 
          strategy="afterInteractive" 
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-MEASUREMENT_ID', {
                page_title: document.title,
                page_location: window.location.href,
                anonymize_ip: true,
                allow_google_signals: false,
                allow_ad_personalization_signals: false
              });
            `,
          }}
        />

        {/* Service Worker registration for PWA functionality */}
        <Script
          id="service-worker"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />

        {/* Accessibility enhancements */}
        <Script
          id="accessibility-enhancements"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Add focus-visible polyfill behavior
              document.addEventListener('DOMContentLoaded', function() {
                // Handle keyboard navigation indicators
                let isKeyboardUser = false;
                
                document.addEventListener('keydown', function(e) {
                  if (e.key === 'Tab') {
                    isKeyboardUser = true;
                    document.body.classList.add('keyboard-user');
                  }
                });
                
                document.addEventListener('mousedown', function() {
                  isKeyboardUser = false;
                  document.body.classList.remove('keyboard-user');
                });
                
                // Improve mobile tap targets
                if ('ontouchstart' in window) {
                  document.body.classList.add('touch-device');
                }
                
                // Handle reduced motion preferences
                const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
                if (prefersReducedMotion.matches) {
                  document.body.classList.add('reduce-motion');
                }
                
                prefersReducedMotion.addEventListener('change', function() {
                  if (prefersReducedMotion.matches) {
                    document.body.classList.add('reduce-motion');
                  } else {
                    document.body.classList.remove('reduce-motion');
                  }
                });
              });
            `,
          }}
        />
      </body>
    </html>
  )
}