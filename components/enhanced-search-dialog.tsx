"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { 
  Search, 
  Clock, 
  Star, 
  ArrowRight, 
  Zap, 
  FileText, 
  ImageIcon, 
  QrCode, 
  Code, 
  TrendingUp, 
  Calculator,
  Scissors,
  Archive,
  RefreshCw,
  Lock,
  Palette,
  Maximize,
  Crop,
  Eye,
  Grid,
  Hash,
  Link,
  Type,
  Shield,
  Bot,
  Map,
  Wifi,
  User,
  Mail,
  Phone,
  Globe,
  Braces,
  FileCode,
  Droplets,
  RotateCw,
  FlipHorizontal,
  TrendingUp as TrendingUpIcon
} from "lucide-react"
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
  isNew?: boolean
  isPremium?: boolean
}

interface EnhancedSearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const toolsDatabase: SearchResult[] = [
  // PDF Tools
  {
    title: "PDF Merger",
    description: "Combine multiple PDF files into one document with custom page ordering and bookmarks",
    href: "/pdf-merger",
    category: "PDF",
    icon: FileText,
    score: 0,
    keywords: ["merge", "combine", "join", "unite", "concatenate", "pdf", "documents"],
    popularity: 95,
  },
  {
    title: "PDF Splitter",
    description: "Split large PDF files into smaller documents by page ranges, bookmarks, or selections",
    href: "/pdf-splitter",
    category: "PDF",
    icon: Scissors,
    score: 0,
    keywords: ["split", "divide", "separate", "extract", "pages", "pdf", "break"],
    popularity: 88,
  },
  {
    title: "PDF Compressor",
    description: "Reduce PDF file size while maintaining quality using advanced compression algorithms",
    href: "/pdf-compressor",
    category: "PDF",
    icon: Archive,
    score: 0,
    keywords: ["compress", "reduce", "optimize", "shrink", "size", "pdf", "smaller"],
    popularity: 92,
  },
  {
    title: "PDF to Image",
    description: "Convert PDF pages to high-quality JPG, PNG, or WebP images with custom DPI settings",
    href: "/pdf-to-image",
    category: "PDF",
    icon: ImageIcon,
    score: 0,
    keywords: ["convert", "pdf", "image", "jpg", "png", "webp", "export", "pages"],
    popularity: 85,
  },
  {
    title: "PDF Password Protector",
    description: "Add password protection and encryption to PDF files for enhanced security",
    href: "/pdf-password-protector",
    category: "PDF",
    icon: Lock,
    score: 0,
    keywords: ["password", "protect", "encrypt", "secure", "lock", "pdf", "security"],
    popularity: 78,
  },
  {
    title: "PDF Unlock",
    description: "Remove password protection and restrictions from encrypted PDF files",
    href: "/pdf-unlock",
    category: "PDF",
    icon: Lock,
    score: 0,
    keywords: ["unlock", "remove", "password", "decrypt", "pdf", "restrictions"],
    popularity: 72,
  },
  {
    title: "PDF Watermark",
    description: "Add text watermarks to PDF documents for branding and copyright protection",
    href: "/pdf-watermark",
    category: "PDF",
    icon: Droplets,
    score: 0,
    keywords: ["watermark", "text", "brand", "copyright", "pdf", "overlay"],
    popularity: 69,
  },
  {
    title: "PDF Organizer",
    description: "Reorder, sort, and organize PDF pages with drag-and-drop interface",
    href: "/pdf-organizer",
    category: "PDF",
    icon: RefreshCw,
    score: 0,
    keywords: ["organize", "reorder", "sort", "arrange", "pdf", "pages"],
    popularity: 65,
  },
  {
    title: "PDF to Word",
    description: "Convert PDF files to editable Word documents with OCR support",
    href: "/pdf-to-word",
    category: "PDF",
    icon: FileText,
    score: 0,
    keywords: ["convert", "pdf", "word", "docx", "editable", "ocr"],
    popularity: 81,
    isPremium: true,
  },

  // Image Tools
  {
    title: "Image Compressor",
    description: "Compress JPG, PNG, WebP, and GIF images while preserving quality and reducing file size",
    href: "/image-compressor",
    category: "Image",
    icon: Archive,
    score: 0,
    keywords: ["compress", "optimize", "reduce", "image", "jpg", "png", "webp", "size"],
    popularity: 96,
  },
  {
    title: "Image Resizer",
    description: "Resize images with presets, custom dimensions, and maintain aspect ratios",
    href: "/image-resizer",
    category: "Image",
    icon: Maximize,
    score: 0,
    keywords: ["resize", "scale", "dimensions", "width", "height", "image", "pixels"],
    popularity: 94,
  },
  {
    title: "Image Cropper",
    description: "Crop images with precision using visual editor, aspect ratio presets, and grid guides",
    href: "/image-cropper",
    category: "Image",
    icon: Crop,
    score: 0,
    keywords: ["crop", "cut", "trim", "select", "area", "image", "rectangle"],
    popularity: 89,
  },
  {
    title: "Image Converter",
    description: "Convert between JPG, PNG, WebP, GIF, and other formats with quality control",
    href: "/image-converter",
    category: "Image",
    icon: RefreshCw,
    score: 0,
    keywords: ["convert", "format", "jpg", "png", "webp", "gif", "image", "change"],
    popularity: 91,
  },
  {
    title: "Background Remover",
    description: "Remove image backgrounds automatically with AI-powered object detection",
    href: "/background-remover",
    category: "Image",
    icon: Scissors,
    score: 0,
    keywords: ["background", "remove", "transparent", "cutout", "ai", "automatic"],
    popularity: 87,
    isNew: true,
  },
  {
    title: "Image Rotator",
    description: "Rotate images by 90°, 180°, 270°, or any custom angle with batch processing",
    href: "/image-rotator",
    category: "Image",
    icon: RotateCw,
    score: 0,
    keywords: ["rotate", "turn", "angle", "orientation", "image", "flip"],
    popularity: 73,
  },
  {
    title: "Image Flipper",
    description: "Flip images horizontally, vertically, or both directions with batch processing",
    href: "/image-flipper",
    category: "Image",
    icon: FlipHorizontal,
    score: 0,
    keywords: ["flip", "mirror", "horizontal", "vertical", "image", "reverse"],
    popularity: 68,
  },
  {
    title: "Image Filters",
    description: "Apply professional filters and adjustments: brightness, contrast, saturation, effects",
    href: "/image-filters",
    category: "Image",
    icon: Palette,
    score: 0,
    keywords: ["filter", "effect", "brightness", "contrast", "saturation", "image"],
    popularity: 79,
  },
  {
    title: "Image Upscaler",
    description: "Enlarge images with AI-enhanced quality while preserving details",
    href: "/image-upscaler",
    category: "Image",
    icon: TrendingUpIcon,
    score: 0,
    keywords: ["upscale", "enlarge", "enhance", "ai", "quality", "resolution"],
    popularity: 84,
    isNew: true,
  },
  {
    title: "Image Watermark",
    description: "Add text or logo watermarks to images with opacity, position, and style controls",
    href: "/image-watermark",
    category: "Image",
    icon: Droplets,
    score: 0,
    keywords: ["watermark", "logo", "text", "overlay", "brand", "image", "copyright"],
    popularity: 76,
  },
  {
    title: "Image to PDF",
    description: "Convert multiple images into a single PDF document with custom layouts",
    href: "/image-to-pdf",
    category: "Image",
    icon: FileText,
    score: 0,
    keywords: ["convert", "image", "pdf", "combine", "layout", "document"],
    popularity: 77,
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
    isNew: true,
  },
  {
    title: "QR Scanner",
    description: "Scan and decode QR codes from uploaded images with batch processing support",
    href: "/qr-scanner",
    category: "QR",
    icon: Eye,
    score: 0,
    keywords: ["scan", "read", "decode", "qr", "code", "barcode", "image", "detect"],
    popularity: 82,
  },
  {
    title: "Bulk QR Generator",
    description: "Generate multiple QR codes at once from CSV data or text lists with batch export",
    href: "/bulk-qr-generator",
    category: "QR",
    icon: Grid,
    score: 0,
    keywords: ["bulk", "batch", "multiple", "qr", "generate", "csv", "list", "mass"],
    popularity: 71,
  },
  {
    title: "WiFi QR Generator",
    description: "Create QR codes for WiFi networks with automatic connection support",
    href: "/wifi-qr-generator",
    category: "QR",
    icon: Wifi,
    score: 0,
    keywords: ["wifi", "qr", "network", "password", "connect", "wireless"],
    popularity: 87,
  },
  {
    title: "vCard QR Generator",
    description: "Generate QR codes for contact information and business cards",
    href: "/vcard-qr-generator",
    category: "QR",
    icon: User,
    score: 0,
    keywords: ["vcard", "contact", "business", "card", "qr", "phone", "email"],
    popularity: 74,
  },
  {
    title: "Barcode Generator",
    description: "Generate various barcode formats including UPC, EAN, Code 128, and more",
    href: "/barcode-generator",
    category: "QR",
    icon: QrCode,
    score: 0,
    keywords: ["barcode", "upc", "ean", "code128", "generate", "retail"],
    popularity: 66,
  },

  // Text & Code Tools
  {
    title: "JSON Formatter",
    description: "Format, validate, and beautify JSON data with syntax highlighting and error detection",
    href: "/json-formatter",
    category: "Text",
    icon: Braces,
    score: 0,
    keywords: ["json", "format", "validate", "beautify", "pretty", "syntax", "code"],
    popularity: 87,
  },
  {
    title: "Base64 Encoder",
    description: "Encode and decode Base64 data with support for text, images, and files",
    href: "/base64-encoder",
    category: "Text",
    icon: Lock,
    score: 0,
    keywords: ["base64", "encode", "decode", "text", "image", "file", "convert"],
    popularity: 74,
  },
  {
    title: "URL Encoder",
    description: "Encode and decode URL strings and query parameters for web development",
    href: "/url-encoder",
    category: "Text",
    icon: Link,
    score: 0,
    keywords: ["url", "encode", "decode", "query", "parameter", "web", "development"],
    popularity: 71,
  },
  {
    title: "Text Case Converter",
    description: "Convert text between different cases: lowercase, UPPERCASE, camelCase, and more",
    href: "/text-case-converter",
    category: "Text",
    icon: Type,
    score: 0,
    keywords: ["case", "convert", "uppercase", "lowercase", "camel", "snake", "text"],
    popularity: 68,
  },
  {
    title: "Hash Generator",
    description: "Generate MD5, SHA-1, SHA-256, and other cryptographic hashes for text and files",
    href: "/hash-generator",
    category: "Text",
    icon: Shield,
    score: 0,
    keywords: ["hash", "md5", "sha", "checksum", "crypto", "security", "generate"],
    popularity: 69,
  },
  {
    title: "XML Formatter",
    description: "Format, validate, and beautify XML documents with syntax highlighting",
    href: "/xml-formatter",
    category: "Text",
    icon: Code,
    score: 0,
    keywords: ["xml", "format", "validate", "beautify", "syntax", "markup"],
    popularity: 63,
  },
  {
    title: "HTML Formatter",
    description: "Clean up and format HTML code with proper indentation and syntax highlighting",
    href: "/html-formatter",
    category: "Text",
    icon: Code,
    score: 0,
    keywords: ["html", "format", "beautify", "clean", "indent", "markup"],
    popularity: 67,
  },
  {
    title: "CSS Minifier",
    description: "Minify CSS code to reduce file size and improve website loading performance",
    href: "/css-minifier",
    category: "Text",
    icon: Palette,
    score: 0,
    keywords: ["css", "minify", "compress", "optimize", "stylesheet", "web"],
    popularity: 64,
  },
  {
    title: "JavaScript Minifier",
    description: "Compress JavaScript code while preserving functionality to optimize web performance",
    href: "/js-minifier",
    category: "Text",
    icon: FileCode,
    score: 0,
    keywords: ["javascript", "js", "minify", "compress", "optimize", "web"],
    popularity: 66,
  },
  {
    title: "Markdown to HTML",
    description: "Convert Markdown text to HTML with syntax highlighting and live preview",
    href: "/markdown-to-html",
    category: "Text",
    icon: FileText,
    score: 0,
    keywords: ["markdown", "html", "convert", "syntax", "preview", "documentation"],
    popularity: 59,
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
  {
    title: "Sitemap Generator",
    description: "Generate XML sitemaps for better search engine indexing and crawling",
    href: "/sitemap-generator",
    category: "SEO",
    icon: Map,
    score: 0,
    keywords: ["sitemap", "xml", "seo", "search", "engine", "indexing"],
    popularity: 75,
  },
  {
    title: "Robots.txt Generator",
    description: "Create and validate robots.txt files to control search engine crawling",
    href: "/robots-txt-generator",
    category: "SEO",
    icon: Bot,
    score: 0,
    keywords: ["robots", "txt", "crawl", "search", "engine", "seo"],
    popularity: 67,
  },
  {
    title: "Schema Markup Generator",
    description: "Create structured data markup for rich snippets and better search visibility",
    href: "/schema-markup-generator",
    category: "SEO",
    icon: Code,
    score: 0,
    keywords: ["schema", "markup", "structured", "data", "rich", "snippets"],
    popularity: 61,
  },
  {
    title: "Keyword Density Checker",
    description: "Analyze keyword density and frequency in your content for SEO optimization",
    href: "/keyword-density-checker",
    category: "SEO",
    icon: Search,
    score: 0,
    keywords: ["keyword", "density", "seo", "content", "analysis", "frequency"],
    popularity: 58,
  },
  {
    title: "Page Speed Analyzer",
    description: "Analyze website performance and get recommendations for speed optimization",
    href: "/page-speed-analyzer",
    category: "SEO",
    icon: Zap,
    score: 0,
    keywords: ["speed", "performance", "analyze", "optimize", "website", "pagespeed"],
    popularity: 72,
  },

  // Utilities
  {
    title: "Password Generator",
    description: "Generate secure passwords with customizable length, characters, and complexity options",
    href: "/password-generator",
    category: "Utilities",
    icon: Lock,
    score: 0,
    keywords: ["password", "generate", "secure", "random", "strong", "characters"],
    popularity: 90,
  },
  {
    title: "Lorem Ipsum Generator",
    description: "Generate placeholder text in various formats and lengths for design projects",
    href: "/lorem-ipsum-generator",
    category: "Utilities",
    icon: FileText,
    score: 0,
    keywords: ["lorem", "ipsum", "placeholder", "text", "dummy", "content"],
    popularity: 62,
  },
  {
    title: "UUID Generator",
    description: "Generate unique identifiers (UUIDs) in various formats for applications",
    href: "/uuid-generator",
    category: "Utilities",
    icon: Hash,
    score: 0,
    keywords: ["uuid", "guid", "unique", "identifier", "generate", "random"],
    popularity: 56,
  },
  {
    title: "Random Number Generator",
    description: "Generate random numbers with customizable ranges and distribution options",
    href: "/random-number-generator",
    category: "Utilities",
    icon: Calculator,
    score: 0,
    keywords: ["random", "number", "generate", "range", "distribution", "math"],
    popularity: 54,
  },
  {
    title: "Text Diff Checker",
    description: "Compare two texts and highlight differences with side-by-side view",
    href: "/text-diff-checker",
    category: "Utilities",
    icon: Eye,
    score: 0,
    keywords: ["diff", "compare", "text", "difference", "highlight", "check"],
    popularity: 52,
  },
  {
    title: "Word Counter",
    description: "Count words, characters, paragraphs, and reading time for any text content",
    href: "/word-counter",
    category: "Utilities",
    icon: FileText,
    score: 0,
    keywords: ["word", "count", "character", "paragraph", "reading", "time"],
    popularity: 58,
  },

  // Converters
  {
    title: "Unit Converter",
    description: "Convert between different units: length, weight, temperature, area, volume, speed",
    href: "/unit-converter",
    category: "Converters",
    icon: Calculator,
    score: 0,
    keywords: ["unit", "convert", "length", "weight", "temperature", "measurement"],
    popularity: 76,
  },
  {
    title: "Currency Converter",
    description: "Convert between world currencies with real-time exchange rates",
    href: "/currency-converter",
    category: "Converters",
    icon: Calculator,
    score: 0,
    keywords: ["currency", "convert", "exchange", "rate", "money", "forex"],
    popularity: 73,
  },
  {
    title: "Color Converter",
    description: "Convert colors between HEX, RGB, HSL, CMYK formats with live preview",
    href: "/color-converter",
    category: "Converters",
    icon: Palette,
    score: 0,
    keywords: ["color", "convert", "hex", "rgb", "hsl", "cmyk", "palette"],
    popularity: 65,
  },
  {
    title: "Number Base Converter",
    description: "Convert numbers between binary, decimal, hexadecimal, and octal bases",
    href: "/number-base-converter",
    category: "Converters",
    icon: Hash,
    score: 0,
    keywords: ["number", "base", "binary", "decimal", "hex", "octal", "convert"],
    popularity: 51,
  },
  {
    title: "Timestamp Converter",
    description: "Convert between Unix timestamps and human-readable dates with timezone support",
    href: "/timestamp-converter",
    category: "Converters",
    icon: Clock,
    score: 0,
    keywords: ["timestamp", "unix", "date", "time", "convert", "timezone"],
    popularity: 57,
  },
]

export function EnhancedSearchDialog({ open, onOpenChange }: EnhancedSearchDialogProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [popularTools, setPopularTools] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load initial data
  useEffect(() => {
    if (open) {
      setRecentSearches(getRecentSearches())
      setPopularTools(getPopularTools())
      setSelectedIndex(-1)
      // Focus input when dialog opens
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => Math.min(prev + 1, results.length - 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => Math.max(prev - 1, -1))
          break
        case 'Enter':
          e.preventDefault()
          if (selectedIndex >= 0 && results[selectedIndex]) {
            handleSelect(results[selectedIndex].href, results[selectedIndex].title)
          }
          break
        case 'Escape':
          onOpenChange(false)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, results, selectedIndex, onOpenChange])

  // Global keyboard shortcut
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        onOpenChange(true)
      }
    }

    document.addEventListener('keydown', handleGlobalKeyDown)
    return () => document.removeEventListener('keydown', handleGlobalKeyDown)
  }, [onOpenChange])

  // Debounced search with fuzzy matching
  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([])
        setIsLoading(false)
        setSelectedIndex(-1)
        return
      }

      const searchResults = searchToolsAdvanced(searchQuery)
      setResults(searchResults)
      setIsLoading(false)
      setSelectedIndex(-1)
      
      // Track search analytics
      trackSearch(searchQuery, searchResults.length)
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
      setSelectedIndex(-1)
    }
  }, [query, debouncedSearch])

  const handleSelect = (href: string, title: string) => {
    addToRecentSearches(query || title)
    onOpenChange(false)
    setQuery("")
    setSelectedIndex(-1)
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
      <DialogContent className="sm:max-w-4xl max-h-[85vh] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-blue-600" />
            <span>Search Professional Tools</span>
            {query && (
              <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800">
                {results.length} results
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4 border-b bg-gray-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              ref={inputRef}
              placeholder="Search 300+ professional tools... (⌘K)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-12 h-12 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl"
              autoFocus
            />
            {isLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>
        </div>

        <ScrollArea className="max-h-[50vh]">
          <div className="px-6 py-4">
            {/* Search Results */}
            {results.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Search Results</h3>
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                    {results.length} found
                  </Badge>
                </div>
                {results.map((result, index) => {
                  const Icon = result.icon
                  const isSelected = index === selectedIndex
                  
                  return (
                    <Link
                      key={`${result.href}-${index}`}
                      href={result.href}
                      onClick={() => handleSelect(result.href, result.title)}
                      className={`block p-4 rounded-xl border transition-all duration-200 group ${
                        isSelected 
                          ? 'bg-blue-50 border-blue-200 shadow-md' 
                          : 'hover:bg-gray-50 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg transition-colors ${
                          isSelected 
                            ? 'bg-blue-100' 
                            : 'bg-gray-100 group-hover:bg-blue-100'
                        }`}>
                          <Icon className={`h-6 w-6 ${
                            isSelected 
                              ? 'text-blue-600' 
                              : 'text-gray-600 group-hover:text-blue-600'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className={`font-semibold transition-colors ${
                              isSelected 
                                ? 'text-blue-700' 
                                : 'text-gray-900 group-hover:text-blue-700'
                            }`}>
                              {highlightMatch(result.title, query)}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <Badge 
                                variant="secondary" 
                                className="text-xs bg-gray-100 text-gray-700"
                              >
                                {result.category}
                              </Badge>
                              {result.isNew && (
                                <Badge className="bg-green-100 text-green-800 text-xs">
                                  New
                                </Badge>
                              )}
                              {result.isPremium && (
                                <Badge className="bg-purple-100 text-purple-800 text-xs">
                                  Pro
                                </Badge>
                              )}
                              {result.popularity > 85 && (
                                <Badge className="bg-orange-100 text-orange-800 text-xs">
                                  <Star className="h-3 w-3 mr-1" />
                                  Popular
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                            {highlightMatch(result.description, query)}
                          </p>
                          {result.keywords.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {result.keywords.slice(0, 4).map((keyword, keywordIndex) => (
                                <Badge 
                                  key={keywordIndex} 
                                  variant="outline" 
                                  className="text-xs bg-white border-gray-200 text-gray-600"
                                >
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <ArrowRight className={`h-5 w-5 transition-all ${
                          isSelected 
                            ? 'text-blue-600 translate-x-1' 
                            : 'text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1'
                        }`} />
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}

            {/* No Results */}
            {query && results.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <Search className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tools found</h3>
                <p className="text-gray-600 mb-6">We couldn't find any tools matching "{query}"</p>
                <div className="space-y-3">
                  <p className="text-sm text-gray-500">Try searching for:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {["PDF", "Image", "QR Code", "JSON", "Compress", "Convert", "SEO", "Password"].map((suggestion) => (
                      <Button
                        key={suggestion}
                        variant="outline"
                        size="sm"
                        onClick={() => setQuery(suggestion)}
                        className="text-xs hover:bg-blue-50 hover:border-blue-200"
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
              <div className="space-y-8">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Recent Searches</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.slice(0, 8).map((search, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleRecentSearch(search)}
                          className="text-sm h-9 bg-white hover:bg-gray-50 border-gray-200"
                        >
                          <Clock className="h-3 w-3 mr-2" />
                          {search}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Popular Tools */}
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <Zap className="h-4 w-4 text-blue-600" />
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Popular Tools</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {popularTools.slice(0, 8).map((tool, index) => {
                      const Icon = tool.icon
                      return (
                        <Link
                          key={`popular-${tool.href}-${index}`}
                          href={tool.href}
                          onClick={() => handleSelect(tool.href, tool.title)}
                          className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 group"
                        >
                          <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-100 transition-colors">
                            <Icon className="h-5 w-5 text-gray-600 group-hover:text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm text-gray-900 group-hover:text-blue-700 transition-colors truncate">
                              {tool.title}
                            </h4>
                            <p className="text-xs text-gray-500 truncate">{tool.description}</p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                              {tool.category}
                            </Badge>
                            {tool.isNew && (
                              <Badge className="bg-green-100 text-green-800 text-xs">
                                New
                              </Badge>
                            )}
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>

                {/* Tool Categories */}
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <Globe className="h-4 w-4 text-purple-600" />
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Browse Categories</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { name: "PDF Tools", href: "/pdf-tools", icon: FileText, color: "text-red-600", count: 9 },
                      { name: "Image Tools", href: "/image-tools", icon: ImageIcon, color: "text-blue-600", count: 12 },
                      { name: "QR Tools", href: "/qr-tools", icon: QrCode, color: "text-green-600", count: 6 },
                      { name: "Text Tools", href: "/text-tools", icon: Code, color: "text-yellow-600", count: 10 },
                      { name: "SEO Tools", href: "/seo-tools", icon: TrendingUp, color: "text-cyan-600", count: 6 },
                      { name: "Utilities", href: "/utilities", icon: Calculator, color: "text-purple-600", count: 8 }
                    ].map((category) => {
                      const Icon = category.icon
                      return (
                        <Link
                          key={category.name}
                          href={category.href}
                          onClick={() => onOpenChange(false)}
                          className="flex items-center space-x-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 group"
                        >
                          <Icon className={`h-4 w-4 ${category.color}`} />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-gray-900 group-hover:text-blue-700">
                              {category.name}
                            </div>
                            <div className="text-xs text-gray-500">{category.count} tools</div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="px-6 py-3 border-t bg-gray-50">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <span>
                Press <kbd className="bg-white px-2 py-1 rounded border border-gray-300 font-mono">↑↓</kbd> to navigate
              </span>
              <span>
                Press <kbd className="bg-white px-2 py-1 rounded border border-gray-300 font-mono">Enter</kbd> to select
              </span>
              <span>
                Press <kbd className="bg-white px-2 py-1 rounded border border-gray-300 font-mono">Esc</kbd> to close
              </span>
            </div>
            <span className="font-medium">300+ tools available</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Advanced search algorithm with fuzzy matching and intelligent scoring
function searchToolsAdvanced(query: string, limit = 20): SearchResult[] {
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

    // Exact matches (highest priority)
    if (titleLower === query.toLowerCase()) {
      score += 2000
    }

    // Title starts with query
    if (titleLower.startsWith(query.toLowerCase())) {
      score += 1000
    }

    // Title contains query
    if (titleLower.includes(query.toLowerCase())) {
      score += 500
    }

    // Category exact match
    if (categoryLower === query.toLowerCase()) {
      score += 400
    }

    // Keyword exact matches
    keywordsLower.forEach((keyword) => {
      if (keyword === query.toLowerCase()) {
        score += 300
      } else if (keyword.includes(query.toLowerCase())) {
        score += 150
      }
    })

    // Description contains query
    if (descriptionLower.includes(query.toLowerCase())) {
      score += 100
    }

    // Multi-term search scoring
    searchTerms.forEach((term) => {
      if (titleLower.includes(term)) score += 200
      if (descriptionLower.includes(term)) score += 50
      if (categoryLower.includes(term)) score += 150
      keywordsLower.forEach((keyword) => {
        if (keyword.includes(term)) score += 100
      })
    })

    // Fuzzy matching for typos
    searchTerms.forEach((term) => {
      if (term.length >= 3) {
        keywordsLower.forEach((keyword) => {
          if (keyword.length >= 3) {
            const similarity = calculateSimilarity(term, keyword)
            if (similarity > 0.7) {
              score += Math.floor(similarity * 80)
            }
          }
        })
        
        // Fuzzy match title
        const titleSimilarity = calculateSimilarity(term, titleLower)
        if (titleSimilarity > 0.8) {
          score += Math.floor(titleSimilarity * 120)
        }
      }
    })

    // Popularity boost (weighted by engagement)
    score += Math.floor(tool.popularity / 5)

    // Boost for new tools
    if (tool.isNew) {
      score += 50
    }

    return { ...tool, score }
  })

  return results
    .filter((tool) => tool.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

// Enhanced similarity calculation with better fuzzy matching
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2
  const shorter = str1.length > str2.length ? str2 : str1

  if (longer.length === 0) return 1.0

  // Use Jaro-Winkler distance for better fuzzy matching
  const jaroSimilarity = calculateJaroSimilarity(str1, str2)
  
  // Apply Winkler bonus for common prefixes
  let prefixLength = 0
  for (let i = 0; i < Math.min(str1.length, str2.length, 4); i++) {
    if (str1[i] === str2[i]) {
      prefixLength++
    } else {
      break
    }
  }
  
  return jaroSimilarity + (0.1 * prefixLength * (1 - jaroSimilarity))
}

function calculateJaroSimilarity(str1: string, str2: string): number {
  if (str1 === str2) return 1.0
  if (str1.length === 0 || str2.length === 0) return 0.0

  const matchWindow = Math.floor(Math.max(str1.length, str2.length) / 2) - 1
  const str1Matches = new Array(str1.length).fill(false)
  const str2Matches = new Array(str2.length).fill(false)

  let matches = 0
  let transpositions = 0

  // Find matches
  for (let i = 0; i < str1.length; i++) {
    const start = Math.max(0, i - matchWindow)
    const end = Math.min(i + matchWindow + 1, str2.length)

    for (let j = start; j < end; j++) {
      if (str2Matches[j] || str1[i] !== str2[j]) continue
      str1Matches[i] = true
      str2Matches[j] = true
      matches++
      break
    }
  }

  if (matches === 0) return 0.0

  // Find transpositions
  let k = 0
  for (let i = 0; i < str1.length; i++) {
    if (!str1Matches[i]) continue
    while (!str2Matches[k]) k++
    if (str1[i] !== str2[k]) transpositions++
    k++
  }

  return (matches / str1.length + matches / str2.length + (matches - transpositions / 2) / matches) / 3
}

function getPopularTools(limit = 12): SearchResult[] {
  return toolsDatabase
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit)
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

function trackSearch(query: string, resultCount: number): void {
  // Track search analytics
  if (typeof window !== "undefined" && typeof (window as any).gtag === 'function') {
    (window as any).gtag('event', 'search', {
      'search_term': query,
      'result_count': resultCount,
      'search_type': 'tool_search'
    })
  }
}

function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout
  return ((...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }) as T
}