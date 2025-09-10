"use client"

import { useState, useEffect, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Search, Clock, Star, ArrowRight, Zap, FileText, ImageIcon, QrCode, Code, TrendingUp, Calculator } from "lucide-react"
import Link from "next/link"

interface SearchResult {
  title: string
  description: string
  href: string
  category: string
  icon: any
  score: number
  keywords: string[]
  popularity: number
}

interface EnhancedSearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const toolsDatabase: SearchResult[] = [
  // PDF Tools
  {
    title: "PDF Merge",
    description: "Combine multiple PDF files into one document with custom page ordering and bookmarks",
    href: "/pdf-merge",
    category: "PDF",
    icon: FileText,
    score: 0,
    keywords: ["merge", "combine", "join", "unite", "pdf", "documents", "concatenate"],
    popularity: 95,
  },
  {
    title: "PDF Split",
    description: "Split large PDF files into smaller documents by page ranges or extract specific pages",
    href: "/pdf-split",
    category: "PDF",
    icon: FileText,
    score: 0,
    keywords: ["split", "divide", "separate", "extract", "pages", "pdf", "break"],
    popularity: 88,
  },
  {
    title: "PDF Compress",
    description: "Reduce PDF file size while maintaining quality using advanced compression algorithms",
    href: "/pdf-compress",
    category: "PDF",
    icon: FileText,
    score: 0,
    keywords: ["compress", "reduce", "optimize", "shrink", "size", "pdf", "smaller"],
    popularity: 92,
  },
  {
    title: "PDF to Image",
    description: "Convert PDF pages to high-quality JPG, PNG, or WebP images with custom DPI settings",
    href: "/pdf-to-image",
    category: "PDF",
    icon: FileText,
    score: 0,
    keywords: ["convert", "pdf", "image", "jpg", "png", "webp", "export", "pages"],
    popularity: 85,
  },
  
  // Image Tools
  {
    title: "Image Compress",
    description: "Compress JPG, PNG, WebP, and GIF images while preserving quality and reducing file size",
    href: "/image-compress",
    category: "Image",
    icon: ImageIcon,
    score: 0,
    keywords: ["compress", "optimize", "reduce", "image", "jpg", "png", "webp", "size"],
    popularity: 96,
  },
  {
    title: "Image Resize",
    description: "Resize images with presets, custom dimensions, and maintain aspect ratios",
    href: "/image-resize",
    category: "Image",
    icon: ImageIcon,
    score: 0,
    keywords: ["resize", "scale", "dimensions", "width", "height", "image", "pixels"],
    popularity: 94,
  },
  {
    title: "Image Crop",
    description: "Crop images with precision using visual editor, aspect ratio presets, and grid guides",
    href: "/image-crop",
    category: "Image",
    icon: ImageIcon,
    score: 0,
    keywords: ["crop", "cut", "trim", "select", "area", "image", "rectangle"],
    popularity: 89,
  },
  {
    title: "Image Convert",
    description: "Convert between JPG, PNG, WebP, GIF, and other formats with quality control",
    href: "/image-convert",
    category: "Image",
    icon: ImageIcon,
    score: 0,
    keywords: ["convert", "format", "jpg", "png", "webp", "gif", "image", "change"],
    popularity: 91,
  },
  
  // QR Tools
  {
    title: "QR Code Generator",
    description: "Create custom QR codes with logos, colors, multiple data types, and advanced styling",
    href: "/qr-code-generator",
    category: "QR",
    icon: QrCode,
    score: 0,
    keywords: ["qr", "code", "generate", "create", "barcode", "scan", "url", "text"],
    popularity: 93,
  },
  {
    title: "WiFi QR Generator",
    description: "Generate QR codes for WiFi networks with automatic connection support",
    href: "/wifi-qr-generator",
    category: "QR",
    icon: QrCode,
    score: 0,
    keywords: ["wifi", "qr", "network", "password", "connect", "wireless"],
    popularity: 87,
  },
  
  // Code Tools
  {
    title: "JSON Formatter",
    description: "Format, validate, and beautify JSON data with syntax highlighting and error detection",
    href: "/json-formatter",
    category: "Code",
    icon: Code,
    score: 0,
    keywords: ["json", "format", "validate", "beautify", "pretty", "syntax", "code"],
    popularity: 87,
  },
  
  // SEO Tools
  {
    title: "SEO Meta Generator",
    description: "Generate optimized meta tags, Open Graph, and Twitter Card tags for better SEO",
    href: "/seo-meta-generator",
    category: "SEO",
    icon: TrendingUp,
    score: 0,
    keywords: ["seo", "meta", "tags", "opengraph", "twitter", "social", "optimization"],
    popularity: 83,
  },
  
  // Utilities
  {
    title: "Password Generator",
    description: "Generate secure passwords with customizable length, characters, and complexity options",
    href: "/password-generator",
    category: "Utilities",
    icon: Calculator,
    score: 0,
    keywords: ["password", "generate", "secure", "random", "strong", "characters"],
    popularity: 90,
  },
]

export function EnhancedSearchDialog({ open, onOpenChange }: EnhancedSearchDialogProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [popularTools, setPopularTools] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load initial data
  useEffect(() => {
    if (open) {
      setRecentSearches(getRecentSearches())
      setPopularTools(getPopularTools())
    }
  }, [open])

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([])
        setIsLoading(false)
        return
      }

      const searchResults = searchTools(searchQuery)
      setResults(searchResults)
      setIsLoading(false)
    }, 300),
    [],
  )

  useEffect(() => {
    if (query.trim()) {
      setIsLoading(true)
      debouncedSearch(query)
    } else {
      setResults([])
      setIsLoading(false)
    }
  }, [query, debouncedSearch])

  const handleSelect = (href: string, title: string) => {
    addToRecentSearches(query || title)
    onOpenChange(false)
    setQuery("")
  }

  const handleRecentSearch = (searchTerm: string) => {
    setQuery(searchTerm)
  }

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
    const parts = text.split(regex)

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-yellow-900 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      ),
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[80vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Search Tools</span>
            {query && (
              <Badge variant="secondary" className="ml-2">
                {results.length} results
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search 300+ professional tools..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
              autoFocus
            />
            {isLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>
        </div>

        <ScrollArea className="max-h-96 px-6 pb-6">
          {/* Search Results */}
          {results.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-muted-foreground">Search Results</h3>
                <Badge variant="outline" className="text-xs">
                  {results.length} found
                </Badge>
              </div>
              {results.map((result, index) => {
                const Icon = result.icon
                return (
                  <Link
                    key={`${result.href}-${index}`}
                    href={result.href}
                    onClick={() => handleSelect(result.href, result.title)}
                    className="block p-4 rounded-lg border hover:bg-muted/50 transition-all duration-200 group"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {highlightMatch(result.title, query)}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="text-xs">
                              {result.category}
                            </Badge>
                            {result.popularity > 80 && (
                              <Badge className="bg-orange-100 text-orange-800 text-xs">
                                <Star className="h-3 w-3 mr-1" />
                                Popular
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {highlightMatch(result.description, query)}
                        </p>
                        {result.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {result.keywords.slice(0, 3).map((keyword, keywordIndex) => (
                              <Badge key={keywordIndex} variant="outline" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" />
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

          {/* No Results */}
          {query && results.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium text-foreground mb-2">No tools found</h3>
              <p className="text-muted-foreground mb-4">We couldn't find any tools matching "{query}"</p>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Try searching for:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {["PDF", "Image", "QR Code", "JSON", "Compress", "Convert"].map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant="outline"
                      size="sm"
                      onClick={() => setQuery(suggestion)}
                      className="text-xs"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Recent Searches & Popular Tools */}
          {!query && (
            <div className="space-y-6">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium text-muted-foreground">Recent Searches</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.slice(0, 6).map((search, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleRecentSearch(search)}
                        className="text-sm h-8"
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        {search}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Popular Tools */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Zap className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-medium text-muted-foreground">Popular Tools</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {popularTools.slice(0, 6).map((tool, index) => {
                    const Icon = tool.icon
                    return (
                      <Link
                        key={`popular-${tool.href}-${index}`}
                        href={tool.href}
                        onClick={() => handleSelect(tool.href, tool.title)}
                        className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-all duration-200 group"
                      >
                        <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors truncate">
                            {tool.title}
                          </h4>
                          <p className="text-xs text-muted-foreground truncate">{tool.description}</p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {tool.category}
                        </Badge>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="px-6 py-3 border-t bg-muted/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-4">
              <span>
                Press <kbd className="bg-background px-1.5 py-0.5 rounded border">↑↓</kbd> to navigate
              </span>
              <span>
                Press <kbd className="bg-background px-1.5 py-0.5 rounded border">Enter</kbd> to select
              </span>
            </div>
            <span>300+ tools available</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Search functionality
function searchTools(query: string, limit = 20): SearchResult[] {
  if (!query.trim()) return []

  const searchTerms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((term) => term.length > 0)

  const results = toolsDatabase.map((tool) => {
    let score = 0
    const titleLower = tool.title.toLowerCase()
    const descriptionLower = tool.description.toLowerCase()
    const categoryLower = tool.category.toLowerCase()
    const keywordsLower = tool.keywords.map((k) => k.toLowerCase())

    // Exact title match (highest score)
    if (titleLower === query.toLowerCase()) {
      score += 1000
    }

    // Title starts with query
    if (titleLower.startsWith(query.toLowerCase())) {
      score += 500
    }

    // Title contains query
    if (titleLower.includes(query.toLowerCase())) {
      score += 300
    }

    // Category exact match
    if (categoryLower === query.toLowerCase()) {
      score += 200
    }

    // Keyword exact matches
    keywordsLower.forEach((keyword) => {
      if (keyword === query.toLowerCase()) {
        score += 150
      } else if (keyword.includes(query.toLowerCase())) {
        score += 75
      }
    })

    // Description contains query
    if (descriptionLower.includes(query.toLowerCase())) {
      score += 50
    }

    // Multi-term search scoring
    searchTerms.forEach((term) => {
      if (titleLower.includes(term)) score += 100
      if (descriptionLower.includes(term)) score += 25
      if (categoryLower.includes(term)) score += 75
      keywordsLower.forEach((keyword) => {
        if (keyword.includes(term)) score += 50
      })
    })

    // Popularity boost
    score += Math.floor(tool.popularity / 10)

    return { ...tool, score }
  })

  return results
    .filter((tool) => tool.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

function getPopularTools(limit = 12): SearchResult[] {
  return toolsDatabase.sort((a, b) => b.popularity - a.popularity).slice(0, limit)
}

function getRecentSearches(): string[] {
  if (typeof window === "undefined") return []

  try {
    const recent = localStorage.getItem("pixora-recent-searches")
    return recent ? JSON.parse(recent) : []
  } catch {
    return []
  }
}

function addToRecentSearches(query: string): void {
  if (typeof window === "undefined" || !query.trim()) return

  try {
    const recent = getRecentSearches()
    const filtered = recent.filter((item) => item.toLowerCase() !== query.toLowerCase())
    const updated = [query, ...filtered].slice(0, 10)

    localStorage.setItem("pixora-recent-searches", JSON.stringify(updated))
  } catch {
    // Ignore localStorage errors
  }
}

function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout
  return ((...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }) as T
}