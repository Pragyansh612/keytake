"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  label: string
  href: string
  isLast?: boolean
}

interface BreadcrumbsProps {
  className?: string
  homeLabel?: string
  separator?: React.ReactNode
  containerClassName?: string
  items?: BreadcrumbItem[]
}

export function Breadcrumbs({
  className,
  homeLabel = "Home",
  separator = <ChevronRight className="h-4 w-4" />,
  containerClassName,
  items: providedItems,
}: BreadcrumbsProps) {
  const pathname = usePathname()
  
  // Skip rendering breadcrumbs on homepage
  if (pathname === "/" && !providedItems) return null
  
  // Use provided items if available, otherwise generate from pathname
  const breadcrumbItems = providedItems || generateBreadcrumbItems(pathname, homeLabel);
  
  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: homeLabel,
        item: `${typeof window !== "undefined" ? window.location.origin : ""}/`,
      },
      ...breadcrumbItems.map((item, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: item.label,
        item: `${typeof window !== "undefined" ? window.location.origin : ""}${item.href}`,
      })),
    ],
  }
  
  return (
    <div className={cn("flex flex-wrap items-center gap-1 text-sm", containerClassName)}>
      {/* Add JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Home link */}
      <Link
        href="/"
        className={cn(
          "flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground",
          className
        )}
      >
        <Home className="h-4 w-4" />
        <span className="sr-only sm:not-sr-only">{homeLabel}</span>
      </Link>
      
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={item.href}>
          {separator}
          {item.isLast ? (
            <span className={cn("font-medium text-foreground", className)}>
              {item.label}
            </span>
          ) : (
            <Link
              href={item.href}
              className={cn(
                "text-muted-foreground transition-colors hover:text-foreground",
                className
              )}
            >
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

// Helper function to generate breadcrumb items from pathname
function generateBreadcrumbItems(pathname: string, homeLabel: string): BreadcrumbItem[] {
  if (pathname === "/") return [];
  
  // Generate breadcrumb items from pathname
  const pathSegments = pathname.split("/").filter((segment) => segment !== "")
  
  // Create breadcrumb items with proper labels and links
  return pathSegments.map((segment, index) => {
    const href = `/${pathSegments.slice(0, index + 1).join("/")}`
    const label = segment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
    
    const isLast = index === pathSegments.length - 1
    
    // Handle special case for blog post slugs
    const isBlogPost = pathSegments[0] === "blog" && index === 1
    
    return {
      href,
      label: isBlogPost ? "Post" : label,
      isLast,
    }
  })
}