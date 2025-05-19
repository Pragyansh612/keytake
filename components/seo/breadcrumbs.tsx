"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { generateBreadcrumbSchema } from "@/lib/seo-utils"

interface BreadcrumbsProps {
  className?: string
  homeLabel?: string
  separator?: React.ReactNode
  containerClassName?: string
  customItems?: { label: string; href: string }[]
}

export function Breadcrumbs({
  className,
  homeLabel = "Home",
  separator = <ChevronRight className="h-4 w-4 mx-1 text-foreground/40" />,
  containerClassName,
  customItems,
}: BreadcrumbsProps) {
  const pathname = usePathname()

  // Skip rendering breadcrumbs on homepage
  if (pathname === "/") return null

  // Generate breadcrumb items from pathname or use custom items
  const breadcrumbItems = customItems || generateBreadcrumbsFromPath(pathname, homeLabel)

  // Generate structured data for SEO
  const structuredData = generateBreadcrumbSchema(
    breadcrumbItems.map((item) => ({
      name: item.label,
      url: item.href,
    })),
  )

  return (
    <nav aria-label="Breadcrumbs" className={cn("py-2 text-sm", containerClassName)}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />

      <ol className={cn("flex items-center flex-wrap", className)}>
        {breadcrumbItems.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index === breadcrumbItems.length - 1 ? (
              <span className="font-medium text-foreground">{item.label}</span>
            ) : (
              <>
                <Link href={item.href} className="text-foreground/60 hover:text-foreground transition-colors">
                  {item.label}
                </Link>
                {separator}
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

// Helper function to generate breadcrumbs from path
function generateBreadcrumbsFromPath(pathname: string, homeLabel: string) {
  const pathSegments = pathname.split("/").filter((segment) => segment !== "")

  // Start with home
  const breadcrumbs = [
    {
      label: homeLabel,
      href: "/",
    },
  ]

  // Add each path segment
  pathSegments.forEach((segment, index) => {
    const href = `/${pathSegments.slice(0, index + 1).join("/")}`
    const label = formatBreadcrumbLabel(segment)

    breadcrumbs.push({
      href,
      label,
    })
  })

  return breadcrumbs
}

// Helper function to format breadcrumb labels
function formatBreadcrumbLabel(segment: string): string {
  // Handle special cases
  if (segment === "blog") return "Blog"
  if (segment === "notes") return "Notes"

  // Handle dynamic routes with IDs
  if (segment.match(/^[a-f0-9]{24}$/) || segment.match(/^\d+$/)) {
    return "Details"
  }

  // Format slug-case to Title Case
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}
