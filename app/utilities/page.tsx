import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ToolCard } from "@/components/tool-card"
import { Wrench, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    themeColor: '#3b82f6',
  }
}

const utilityTools = [
  {
    title: "Password Generator",
    description: "Create secure passwords with customizable length, characters, and complexity options.",
    href: "/password-generator",
    icon: Wrench,
    category: "Utilities",
  },
  {
    title: "Lorem Ipsum Generator",
    description: "Generate placeholder text in various formats and lengths for design and development.",
    href: "/lorem-ipsum-generator",
    icon: Wrench,
    category: "Utilities",
  },
  {
    title: "UUID Generator",
    description: "Generate unique identifiers (UUIDs) in various formats for applications and databases.",
    href: "/uuid-generator",
    icon: Wrench,
    category: "Utilities",
  },
  {
    title: "Random Number Generator",
    description: "Generate random numbers with customizable ranges and distribution options.",
    href: "/random-number-generator",
    icon: Wrench,
    category: "Utilities",
  },
  {
    title: "Text Diff Checker",
    description: "Compare two texts and highlight differences with side-by-side or inline view.",
    href: "/text-diff-checker",
    icon: Wrench,
    category: "Utilities",
  },
  {
    title: "Word Counter",
    description: "Count words, characters, paragraphs, and reading time for any text content.",
    href: "/word-counter",
    icon: Wrench,
    category: "Utilities",
  },
]

export default function UtilitiesPage() {
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

          <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-2xl p-8 mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 rounded-lg bg-indigo-500/10">
                <Wrench className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-3xl font-heading font-bold text-foreground">Professional Utility Tools</h1>
                <p className="text-muted-foreground text-lg">
                  63 specialized tools for everyday productivity and professional workflows
                </p>
              </div>
            </div>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              Our comprehensive utility collection includes password generators, unit converters, text analyzers, 
              random number generators, and specialized calculators. These tools are designed for developers, 
              researchers, students, and professionals who need reliable utilities for their daily work.
            </p>
            
            {/* Content Area Ad */}
            <div className="mb-6">
              <AdBanner 
                adSlot="utilities-content"
                adFormat="auto"
                className="max-w-3xl mx-auto"
                mobileOptimized={true}
              />
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {utilityTools.map((tool) => (
            <ToolCard key={tool.title} {...tool} />
          ))}
        </div>

        {/* Educational Content */}
        <div className="mt-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Utility Tools for Every Profession</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Development & IT</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Generate secure passwords for system administration</li>
                  <li>• Create UUIDs for database records and API keys</li>
                  <li>• Convert units for server specifications and calculations</li>
                  <li>• Generate random test data for application testing</li>
                  <li>• Compare text files and configuration changes</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Business & Research</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Analyze document word counts and reading time</li>
                  <li>• Generate placeholder text for design mockups</li>
                  <li>• Convert currencies for international business</li>
                  <li>• Create random samples for statistical analysis</li>
                  <li>• Compare document versions and track changes</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-muted-foreground mb-4">Expanding our utility collection based on user feedback</p>
              <p className="text-sm text-muted-foreground">
                Have a suggestion for a new utility tool?{" "}
                <Link href="/contact" className="text-accent hover:underline">
                  Let us know
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
