import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ToolCard } from "@/components/tool-card"
import { TrendingUp, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AdBanner } from "@/components/ads"

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    themeColor: '#3b82f6',
  }
}

const seoTools = [
  {
    title: "SEO Meta Generator",
    description: "Generate optimized meta tags, Open Graph, and Twitter Card tags for better SEO.",
    href: "/seo-meta-generator",
    icon: TrendingUp,
    category: "SEO Tools",
  },
  {
    title: "Sitemap Generator",
    description: "Generate XML sitemaps for better search engine indexing and crawling.",
    href: "/sitemap-generator",
    icon: TrendingUp,
    category: "SEO Tools",
  },
  {
    title: "Keyword Density Checker",
    description: "Analyze keyword density and frequency in your content for SEO optimization.",
    href: "/keyword-density-checker",
    icon: TrendingUp,
    category: "SEO Tools",
  },
  {
    title: "Robots.txt Generator",
    description: "Create and validate robots.txt files to control search engine crawling.",
    href: "/robots-txt-generator",
    icon: TrendingUp,
    category: "SEO Tools",
  },
  {
    title: "Sitemap Generator",
    description: "Generate XML sitemaps for better search engine indexing and crawling.",
    href: "/sitemap-generator",
    icon: TrendingUp,
    category: "SEO Tools",
  },
  {
    title: "Schema Markup Generator",
    description: "Create structured data markup for rich snippets and better search visibility.",
    href: "/schema-markup-generator",
    icon: TrendingUp,
    category: "SEO Tools",
  },
  {
    title: "Page Speed Analyzer",
    description: "Analyze website performance and get recommendations for speed optimization.",
    href: "/page-speed-analyzer",
    icon: TrendingUp,
    category: "SEO Tools",
  },
]

export default function SEOToolsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          <div className="bg-gradient-to-br from-orange-50 via-white to-cyan-50 rounded-2xl p-8 mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 rounded-lg bg-orange-500/10">
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
              <div>
                <h1 className="text-3xl font-heading font-bold text-foreground">Professional SEO Tools</h1>
                <p className="text-muted-foreground text-lg">
                  38 advanced tools for search engine optimization and website analysis
                </p>
              </div>
            </div>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              Optimize your website's search engine performance with our comprehensive SEO toolkit. 
              From meta tag generation to sitemap creation, keyword analysis to performance monitoring - 
              our tools help digital marketers, web developers, and business owners improve their online visibility 
              and search rankings through data-driven optimization strategies.
            </p>
            
            {/* Content Area Ad */}
            <div className="mb-6">
              <AdBanner
                adSlot="seo-tools-content"
                adFormat="auto"
                className="max-w-3xl mx-auto"
                mobileOptimized={true}
              />
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {seoTools.map((tool) => (
            <ToolCard key={tool.title} {...tool} />
          ))}
        </div>

        {/* SEO Education Content */}
        <div className="mt-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Advanced SEO Strategies for Digital Marketing Success</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical SEO Excellence</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Advanced meta tag optimization with Open Graph and Twitter Card integration for social media visibility</li>
                  <li>• Comprehensive XML sitemap generation with priority weighting and change frequency optimization</li>
                  <li>• Strategic robots.txt configuration for search engine crawler guidance and indexing control</li>
                  <li>• Schema.org structured data implementation for enhanced rich snippets and search features</li>
                  <li>• Core Web Vitals monitoring and performance optimization for Google ranking factors</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Strategy & Optimization</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Keyword density analysis and semantic keyword distribution for natural content optimization</li>
                  <li>• Title tag and meta description optimization with character limits and click-through rate improvement</li>
                  <li>• Hierarchical content structure with H1-H6 heading optimization for better readability and SEO</li>
                  <li>• Compelling meta description creation with action-oriented language and keyword integration</li>
                  <li>• Strategic internal linking architecture for improved page authority distribution and user navigation</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics & Performance Tracking</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• SERP ranking tracking across multiple search engines with position monitoring and trend analysis</li>
                  <li>• Website performance metrics including page load speed, mobile usability, and user experience signals</li>
                  <li>• Competitive SEO analysis with backlink profiling, keyword gap analysis, and market positioning</li>
                  <li>• Organic traffic growth measurement with conversion tracking and ROI attribution modeling</li>
                  <li>• SEO opportunity identification through technical audits, content gaps, and optimization recommendations</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-muted-foreground mb-4">Our SEO toolkit evolves with search engine algorithm updates and industry best practices</p>
              <p className="text-sm text-muted-foreground">
                Need enterprise SEO solutions or custom tool development?{" "}
                <Link href="/contact" className="text-accent hover:underline">
                  Contact our SEO specialists
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
