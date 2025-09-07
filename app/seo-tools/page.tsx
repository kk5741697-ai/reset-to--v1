import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ToolCard } from "@/components/tool-card"
import { TrendingUp, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

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
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">SEO Optimization Strategies</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical SEO</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Optimize meta tags and structured data</li>
                  <li>• Create comprehensive XML sitemaps</li>
                  <li>• Configure robots.txt for proper crawling</li>
                  <li>• Implement schema markup for rich snippets</li>
                  <li>• Monitor page speed and Core Web Vitals</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Optimization</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Analyze keyword density and distribution</li>
                  <li>• Optimize title tags and descriptions</li>
                  <li>• Structure content with proper headings</li>
                  <li>• Create compelling meta descriptions</li>
                  <li>• Implement internal linking strategies</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Monitoring</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Track search engine rankings</li>
                  <li>• Monitor website performance metrics</li>
                  <li>• Analyze competitor SEO strategies</li>
                  <li>• Measure organic traffic growth</li>
                  <li>• Identify optimization opportunities</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-muted-foreground mb-4">Continuously expanding our SEO toolkit with latest best practices</p>
              <p className="text-sm text-muted-foreground">
                Need a specific SEO tool?{" "}
                <Link href="/contact" className="text-accent hover:underline">
                  Request it here
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
