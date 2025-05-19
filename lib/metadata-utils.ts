import type { Metadata } from "next"

type MetadataProps = {
  title?: string
  description?: string
  keywords?: string[]
  url?: string
  ogImage?: string
  type?: "website" | "article" | "video.other" | "learning_resource"
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
  section?: string
  tags?: string[]
  videoUrl?: string
  videoDuration?: string
  videoViews?: string
}

export function generateNoteMetadata({
  title = "Keytake Notes | AI-Generated Video Notes",
  description = "Transform YouTube videos into comprehensive, searchable notes with AI. Save time, improve learning, and organize knowledge efficiently.",
  keywords = [],
  url = "",
  ogImage = "/images/keytake-og.png",
  type = "learning_resource",
  publishedTime,
  modifiedTime,
  authors = ["Keytake AI"],
  section = "Notes",
  tags = [],
  videoUrl = "",
  videoDuration = "",
  videoViews = "",
}: MetadataProps): Metadata {
  // Default keywords for notes if none provided
  const defaultKeywords = [
    "video notes",
    "AI notes",
    "YouTube notes",
    "educational notes",
    "learning tool",
    "video summary",
    "lecture notes",
    "study aid",
    "knowledge management",
    "educational technology",
  ]

  const allKeywords = [...new Set([...defaultKeywords, ...keywords])]

  const metadata: Metadata = {
    title,
    description,
    keywords: allKeywords.join(", "),
    authors: authors.map((name) => ({ name })),
    openGraph: {
      title,
      description,
      url: url || undefined,
      siteName: "Keytake",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
      type,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
      creator: "@keytake_ai",
    },
  }

  // Add article specific metadata if type is article
  if (type === "article" && (publishedTime || modifiedTime || authors.length > 0 || section || tags.length > 0)) {
    metadata.openGraph = {
      ...metadata.openGraph,
      publishedTime,
      modifiedTime,
      authors,
      section,
      tags,
    }
  }

  return metadata
}

export function generateSchemaMarkup(type: "note" | "video" | "article" | "faq" | "product", data: any): string {
  let schema

  switch (type) {
    case "note":
      schema = {
        "@context": "https://schema.org",
        "@type": "LearningResource",
        name: data.title,
        description: data.description,
        learningResourceType: "Notes",
        educationalLevel: data.level || "All",
        keywords: data.keywords,
        dateCreated: data.createdAt,
        dateModified: data.updatedAt || data.createdAt,
        author: {
          "@type": "Organization",
          name: "Keytake AI",
          url: "https://keytake.ai",
        },
        provider: {
          "@type": "Organization",
          name: "Keytake AI",
          url: "https://keytake.ai",
        },
        about: {
          "@type": "VideoObject",
          name: data.videoTitle,
          description: data.videoDescription,
          uploadDate: data.videoUploadDate,
          thumbnailUrl: data.videoThumbnail,
          duration: data.videoDuration,
          interactionStatistic: {
            "@type": "InteractionCounter",
            interactionType: "https://schema.org/WatchAction",
            userInteractionCount: data.videoViews,
          },
        },
      }
      break
    case "video":
      schema = {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: data.title,
        description: data.description,
        thumbnailUrl: data.thumbnail,
        uploadDate: data.uploadDate,
        duration: data.duration,
        contentUrl: data.url,
        embedUrl: data.embedUrl,
        interactionStatistic: {
          "@type": "InteractionCounter",
          interactionType: "https://schema.org/WatchAction",
          userInteractionCount: data.views,
        },
      }
      break
    case "article":
      schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: data.title,
        description: data.description,
        image: data.image,
        datePublished: data.publishedTime,
        dateModified: data.modifiedTime || data.publishedTime,
        author: {
          "@type": "Person",
          name: data.author,
        },
        publisher: {
          "@type": "Organization",
          name: "Keytake",
          logo: {
            "@type": "ImageObject",
            url: "https://keytake.ai/logo.png",
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": data.url,
        },
      }
      break
    case "faq":
      schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: data.questions.map((q: any) => ({
          "@type": "Question",
          name: q.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: q.answer,
          },
        })),
      }
      break
    case "product":
      schema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: data.name || "Keytake",
        applicationCategory: "EducationalApplication",
        operatingSystem: "Web, Chrome",
        offers: {
          "@type": "Offer",
          price: data.price || "0",
          priceCurrency: data.currency || "USD",
        },
        description: data.description || "Transform YouTube videos into comprehensive, searchable notes with AI.",
        aggregateRating: data.rating
          ? {
              "@type": "AggregateRating",
              ratingValue: data.rating.value,
              ratingCount: data.rating.count,
            }
          : undefined,
      }
      break
    default:
      schema = {}
  }

  return JSON.stringify(schema)
}

export function generateBreadcrumbSchema(breadcrumbs: { name: string; url: string }[]): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: breadcrumb.name,
      item: `https://keytake.ai${breadcrumb.url}`,
    })),
  }

  return JSON.stringify(schema)
}

export function generateVideoSchema(videoData: {
  title: string
  description: string
  thumbnailUrl: string
  uploadDate: string
  duration: string
  embedUrl?: string
  contentUrl?: string
  views?: string
}): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: videoData.title,
    description: videoData.description,
    thumbnailUrl: videoData.thumbnailUrl,
    uploadDate: videoData.uploadDate,
    duration: videoData.duration,
    contentUrl: videoData.contentUrl,
    embedUrl: videoData.embedUrl,
    interactionStatistic: videoData.views
      ? {
          "@type": "InteractionCounter",
          interactionType: "https://schema.org/WatchAction",
          userInteractionCount: videoData.views,
        }
      : undefined,
  }

  return JSON.stringify(schema)
}
