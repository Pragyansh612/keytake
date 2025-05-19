/**
 * Generates structured data markup for different content types
 */
export function generateSchemaMarkup(
  type: "website" | "article" | "video" | "note" | "faq" | "product",
  data: any,
): string {
  let schema

  switch (type) {
    case "website":
      schema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: data.name || "Keytake",
        url: data.url || "https://keytake.ai",
        description: data.description || "Transform YouTube videos into comprehensive, searchable notes with AI.",
        potentialAction: {
          "@type": "SearchAction",
          target: `${data.url || "https://keytake.ai"}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
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
          name: data.author || "Keytake",
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
          "@id": data.url || "https://keytake.ai",
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
        contentUrl: data.contentUrl,
        embedUrl: data.embedUrl,
        interactionStatistic: data.views
          ? {
              "@type": "InteractionCounter",
              interactionType: "https://schema.org/WatchAction",
              userInteractionCount: data.views,
            }
          : undefined,
      }
      break
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
          name: "Keytake",
          url: "https://keytake.ai",
        },
        provider: {
          "@type": "Organization",
          name: "Keytake",
          url: "https://keytake.ai",
        },
        about: data.videoTitle
          ? {
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
            }
          : undefined,
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

/**
 * Generates breadcrumb schema markup
 */
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

/**
 * Generates SEO-friendly slugs from titles
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
}

/**
 * Extracts keywords from content
 */
export function extractKeywords(content: string, maxKeywords = 10): string[] {
  // This is a simplified implementation
  // In a real app, you would use NLP or AI to extract relevant keywords
  const words = content.toLowerCase().split(/\W+/)
  const stopWords = ["the", "and", "a", "an", "in", "on", "at", "to", "for", "with", "by", "of", "is", "are"]

  const wordFrequency: Record<string, number> = {}

  words.forEach((word) => {
    if (word.length > 3 && !stopWords.includes(word)) {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1
    }
  })

  return Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords)
    .map((entry) => entry[0])
}

/**
 * Generates meta description from content
 */
export function generateMetaDescription(content: string, maxLength = 160): string {
  // Remove HTML tags if present
  const plainText = content.replace(/<[^>]*>/g, "")

  // Truncate to maxLength and ensure it doesn't cut words
  if (plainText.length <= maxLength) return plainText

  const truncated = plainText.substring(0, maxLength)
  const lastSpaceIndex = truncated.lastIndexOf(" ")

  return truncated.substring(0, lastSpaceIndex) + "..."
}
