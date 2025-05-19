import type React from "react"
import Head from "next/head"
import { generateSchemaMarkup } from "@/lib/seo-utils"

interface SEOHeadProps {
  title: string
  description: string
  keywords?: string[]
  type?: "website" | "article" | "video" | "learning_resource"
  publishedTime?: string
  modifiedTime?: string
  imageUrl?: string
  canonicalUrl?: string
  videoUrl?: string
  videoDuration?: string
  videoViews?: string
  children?: React.ReactNode
}

export function SEOHead({
  title,
  description,
  keywords = [],
  type = "website",
  publishedTime,
  modifiedTime,
  imageUrl = "https://keytake.ai/images/og-image.jpg",
  canonicalUrl,
  videoUrl,
  videoDuration,
  videoViews,
  children,
}: SEOHeadProps) {
  // Default keywords for the platform
  const defaultKeywords = [
    "video notes",
    "AI notes",
    "educational content",
    "learning resources",
    "study notes",
    "video summaries",
    "Keytake",
  ]

  // Combine default and custom keywords
  const allKeywords = [...new Set([...defaultKeywords, ...keywords])]

  // Generate structured data based on content type
  const getStructuredData = () => {
    if (type === "article") {
      return generateSchemaMarkup("article", {
        title,
        description,
        image: imageUrl,
        publishedTime,
        modifiedTime: modifiedTime || publishedTime,
        author: "Keytake",
        url: canonicalUrl || `https://keytake.ai`,
      })
    } else if (type === "video") {
      return generateSchemaMarkup("video", {
        title,
        description,
        thumbnail: imageUrl,
        uploadDate: publishedTime || new Date().toISOString(),
        duration: videoDuration || "PT0M0S",
        embedUrl: videoUrl,
        views: videoViews || "0",
      })
    } else if (type === "learning_resource") {
      return generateSchemaMarkup("note", {
        title,
        description,
        keywords: allKeywords.join(", "),
        createdAt: publishedTime || new Date().toISOString(),
        updatedAt: modifiedTime || publishedTime || new Date().toISOString(),
        level: "All",
        videoTitle: title,
        videoDescription: description,
        videoUploadDate: publishedTime || new Date().toISOString(),
        videoThumbnail: imageUrl,
        videoDuration: videoDuration || "PT0M0S",
        videoViews: videoViews || "0",
      })
    } else {
      return generateSchemaMarkup("website", {
        name: "Keytake",
        url: "https://keytake.ai",
        description,
      })
    }
  }

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords.join(", ")} />

      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type === "article" ? "article" : "website"} />
      <meta property="og:url" content={canonicalUrl || "https://keytake.ai"} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl || "https://keytake.ai"} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={imageUrl} />

      {/* Article specific metadata */}
      {type === "article" && publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {type === "article" && modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

      {/* Structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: getStructuredData() }} />

      {children}
    </Head>
  )
}
