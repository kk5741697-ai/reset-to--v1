"use client"

import { useEffect } from "react"

interface StructuredDataProps {
  type: "WebApplication" | "SoftwareApplication" | "Tool" | "WebPage" | "Organization"
  name: string
  description: string
  url?: string
  applicationCategory?: string
  operatingSystem?: string
  offers?: {
    price: string
    priceCurrency: string
    availability: string
  }
  aggregateRating?: {
    ratingValue: number
    reviewCount: number
    bestRating?: number
    worstRating?: number
  }
  author?: {
    name: string
    type: "Person" | "Organization"
  }
  publisher?: {
    name: string
    logo?: string
  }
  breadcrumbs?: Array<{ name: string; url: string }>
  faqs?: Array<{ question: string; answer: string }>
}

export function StructuredData({
  type,
  name,
  description,
  url,
  applicationCategory,
  operatingSystem = "Web Browser",
  offers,
  aggregateRating,
  author,
  publisher,
  breadcrumbs,
  faqs
}: StructuredDataProps) {
  useEffect(() => {
    // Generate main structured data
    const structuredData: any = {
      "@context": "https://schema.org",
      "@type": type,
      "name": name,
      "description": description,
      "url": url || (typeof window !== "undefined" ? window.location.href : ""),
      "applicationCategory": applicationCategory || "Productivity",
      "operatingSystem": operatingSystem,
      "browserRequirements": "Requires JavaScript. Requires HTML5.",
      "permissions": "No special permissions required",
      "storageRequirements": "Minimal storage required",
      "memoryRequirements": "Standard browser memory",
      "processorRequirements": "Standard processor",
      "softwareVersion": "2024.1",
      "datePublished": "2024-01-01",
      "dateModified": new Date().toISOString().split('T')[0],
      "inLanguage": "en-US",
      "isAccessibleForFree": true,
      "isFamilyFriendly": true,
      "keywords": [
        "online tools", "web tools", "productivity", "file processing",
        "image editing", "pdf tools", "qr generator", "text formatter"
      ].join(", ")
    }

    // Add offers if provided
    if (offers) {
      structuredData.offers = {
        "@type": "Offer",
        "price": offers.price,
        "priceCurrency": offers.priceCurrency,
        "availability": `https://schema.org/${offers.availability}`
      }
    }

    // Add rating if provided
    if (aggregateRating) {
      structuredData.aggregateRating = {
        "@type": "AggregateRating",
        "ratingValue": aggregateRating.ratingValue,
        "reviewCount": aggregateRating.reviewCount,
        "bestRating": aggregateRating.bestRating || 5,
        "worstRating": aggregateRating.worstRating || 1
      }
    }

    // Add author if provided
    if (author) {
      structuredData.author = {
        "@type": author.type,
        "name": author.name
      }
    }

    // Add publisher if provided
    if (publisher) {
      structuredData.publisher = {
        "@type": "Organization",
        "name": publisher.name,
        "logo": publisher.logo ? {
          "@type": "ImageObject",
          "url": publisher.logo
        } : undefined
      }
    }

    // Add provider information
    structuredData.provider = {
      "@type": "Organization",
      "name": "PixoraTools",
      "url": "https://pixoratools.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://pixoratools.com/logo.png"
      },
      "sameAs": [
        "https://twitter.com/pixoratools",
        "https://github.com/pixoratools"
      ]
    }

    // Create and inject script
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(structuredData, null, 2)
    script.id = 'structured-data-main'
    
    // Remove existing script if present
    const existing = document.getElementById('structured-data-main')
    if (existing) {
      existing.remove()
    }
    
    document.head.appendChild(script)

    // Add breadcrumb structured data if provided
    if (breadcrumbs && breadcrumbs.length > 0) {
      const breadcrumbData = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((crumb, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": crumb.name,
          "item": crumb.url
        }))
      }

      const breadcrumbScript = document.createElement('script')
      breadcrumbScript.type = 'application/ld+json'
      breadcrumbScript.textContent = JSON.stringify(breadcrumbData, null, 2)
      breadcrumbScript.id = 'structured-data-breadcrumb'
      
      const existingBreadcrumb = document.getElementById('structured-data-breadcrumb')
      if (existingBreadcrumb) {
        existingBreadcrumb.remove()
      }
      
      document.head.appendChild(breadcrumbScript)
    }

    // Add FAQ structured data if provided
    if (faqs && faqs.length > 0) {
      const faqData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      }

      const faqScript = document.createElement('script')
      faqScript.type = 'application/ld+json'
      faqScript.textContent = JSON.stringify(faqData, null, 2)
      faqScript.id = 'structured-data-faq'
      
      const existingFaq = document.getElementById('structured-data-faq')
      if (existingFaq) {
        existingFaq.remove()
      }
      
      document.head.appendChild(faqScript)
    }

    // Cleanup on unmount
    return () => {
      const scripts = ['structured-data-main', 'structured-data-breadcrumb', 'structured-data-faq']
      scripts.forEach(id => {
        const script = document.getElementById(id)
        if (script) {
          script.remove()
        }
      })
    }
  }, [type, name, description, url, applicationCategory, offers, aggregateRating, author, publisher, breadcrumbs, faqs])

  return null // This component doesn't render anything
}

export { StructuredData }