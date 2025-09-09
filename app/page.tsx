"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SearchDialog } from "@/components/search/search-dialog"
import { APP_CONFIG } from "@/lib/config"
import { 
  Maximize, Crop, FileImage, ArrowUpDown, Edit3, Zap, ImageIcon, Download, Palette, Upload, Archive,
  FileType, QrCode, Code, TrendingUp, Wrench, Globe, Scissors, Lock, RefreshCw, Search
} from "lucide-react"
import Link from "next/link"

import { PersistentAdBanner } from "@/components/ads"

const featuredTools = [
  {
    title: "Compress Image",
    description: "Compress JPG, PNG, WebP, and GIFs while saving space and maintaining quality.",
    href: "/image-compressor",
    icon: Archive,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    title: "Resize Image",
    description: "Define your dimensions by percent or pixel, and resize your images with presets.",
    href: "/image-resizer",
    icon: Maximize,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    title: "Crop Image",
    description: "Crop images with precision using our visual editor and aspect ratio presets.",
    href: "/image-cropper",
    icon: Crop,
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-600",
  },
  {
    title: "Merge PDF",
    description: "Combine multiple PDF files into one document with custom page ordering.",
    href: "/pdf-merger",
    icon: FileType,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
  },
  {
    title: "Convert Image",
    description: "Convert between JPG, PNG, WebP, and other formats with quality control.",
    href: "/image-converter",
    icon: RefreshCw,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    title: "QR Code Generator",
    description: "Create custom QR codes with logos, colors, and multiple data types.",
    href: "/qr-code-generator",
    icon: QrCode,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    isNew: true,
  },
  {
    title: "JSON Formatter",
    description: "Beautify, validate, and minify JSON data with syntax highlighting.",
    href: "/json-formatter",
    icon: Code,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    title: "Split PDF",
    description: "Split large PDF files into smaller documents by page ranges or selections.",
    href: "/pdf-splitter",
    icon: Scissors,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
  },
  {
    title: "Password Generator",
    description: "Generate secure passwords with customizable length and character options.",
    href: "/password-generator",
    icon: Lock,
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
  },
  {
    title: "Remove background",
    description: "Remove image backgrounds automatically with AI-powered edge detection.",
    href: "/background-remover",
    icon: ImageIcon,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    isNew: true,
  },
  {
    title: "SEO Meta Generator",
    description: "Generate optimized meta tags, Open Graph, and Twitter Card tags for better SEO.",
    href: "/seo-meta-generator",
    icon: TrendingUp,
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-600",
  },
  {
    title: "Image Watermark",
    description: "Add text or logo watermarks to your images with opacity and position controls.",
    href: "/image-watermark",
    icon: Edit3,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
]

const toolCategories = [
  { name: "All Tools", href: "/", active: true },
  { name: "PDF Tools", href: "/pdf-tools", active: false },
  { name: "Image Tools", href: "/image-tools", active: false },
  { name: "QR Tools", href: "/qr-tools", active: false },
  { name: "Text Tools", href: "/text-tools", active: false },
  { name: "SEO Tools", href: "/seo-tools", active: false },
  { name: "Utilities", href: "/utilities", active: false },
]

export default function HomePage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <>
      <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-24 px-4 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-purple-500 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-green-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-2 border border-gray-200 shadow-lg mb-6">
              <Wrench className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-semibold text-gray-700">2000+ Professional Tools</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-gray-900 mb-6 leading-tight">
            Every Tool You Could Want
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              To Edit Images in Bulk
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-16 max-w-4xl mx-auto leading-relaxed">
            Your online photo editor is here and forever free! Compress, resize, crop, convert images and more with 300+ professional tools.
            <span className="font-semibold text-gray-800">Fast, secure, and completely free.</span>
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-16">
            <div 
              className="relative cursor-pointer"
              onClick={() => setIsSearchOpen(true)}
            >
              <div className="flex items-center space-x-3 bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg px-6 py-4 hover:shadow-xl transition-all duration-300">
                <Search className="h-6 w-6 text-gray-400" />
                <span className="text-gray-500 text-lg flex-1 text-left">Search 300+ tools...</span>
                <kbd className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-sm font-medium">⌘K</kbd>
              </div>
            </div>
          </div>

          {/* Tool Categories */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {toolCategories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
              >
                <Button
                  variant={category.active ? "default" : "outline"}
                  className={`px-8 py-3 rounded-full transition-all duration-300 font-semibold text-base ${
                    category.active
                      ? "bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:from-gray-800 hover:to-gray-700 shadow-xl scale-105"
                      : "bg-white/80 backdrop-blur-sm text-gray-700 border-gray-300 hover:bg-white hover:shadow-lg hover:scale-105 hover:border-gray-400"
                  }`}
                >
                  {category.name}
                </Button>
              </Link>
            ))}
          </div>

          {/* Featured Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {featuredTools.map((tool) => {
              const Icon = tool.icon
              return (
                <Link
                  key={tool.title}
                  href={tool.href}
                  className="block bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group hover:border-gray-300"
                  data-tool-action="navigate"
                >
                  {tool.isNew && (
                    <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-semibold px-3 py-1 shadow-lg">
                      New!
                    </Badge>
                  )}
                  <div className={`inline-flex p-4 rounded-2xl ${tool.iconBg} mb-6 group-hover:scale-125 transition-transform duration-300 shadow-lg group-hover:shadow-xl`}>
                    <Icon className={`h-8 w-8 ${tool.iconColor}`} />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-gray-900 mb-3 text-left group-hover:text-blue-600 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-base text-gray-600 text-left leading-relaxed">
                    {tool.description}
                  </p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Quality Content with Ad Integration */}
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-6">
              Why Choose PixoraTools for Your Professional Workflow?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Our comprehensive suite of online tools is designed for professionals, developers, and businesses 
              who need reliable, fast, and secure file processing capabilities. With over 300 specialized tools, 
              we provide enterprise-grade functionality accessible from any web browser.
            </p>
          </div>
          
          {/* Educational Content */}
          <div className="max-w-5xl mx-auto mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Code className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Professional File Processing</h3>
                <p className="text-sm text-gray-600">
                  Advanced algorithms for PDF manipulation, image optimization, and document conversion with enterprise-grade reliability.
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Lock className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Privacy & Security First</h3>
                <p className="text-sm text-gray-600">
                  All processing happens locally in your browser. Your files never leave your device, ensuring complete privacy and GDPR compliance.
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Lightning Fast Performance</h3>
                <p className="text-sm text-gray-600">
                  Optimized processing engines deliver results in seconds. No waiting for uploads or server processing delays.
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Universal Compatibility</h3>
                <p className="text-sm text-gray-600">
                  Works on any device with a modern browser. No software installation or account registration required.
                </p>
              </div>
            </div>
            
            {/* Content Area Ad */}
            <div className="mb-8">
              <PersistentAdBanner 
                adSlot="homepage-main"
                adFormat="auto"
                className="max-w-3xl mx-auto"
                mobileOptimized={true}
                persistAcrossPages={true}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Lightning Fast Processing</h3>
              <p className="text-gray-600 leading-relaxed">
                Our optimized algorithms process files instantly using client-side technology. 
                No waiting for uploads or downloads - get results in seconds, not minutes.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Lock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Enterprise-Grade Security</h3>
              <p className="text-gray-600 leading-relaxed">
                All file processing happens locally in your browser with zero server uploads. 
                Your sensitive documents never leave your device, ensuring complete privacy and compliance.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Globe className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Universal Accessibility</h3>
              <p className="text-gray-600 leading-relaxed">
                Access 300+ professional tools from any device with a modern web browser. 
                No software installation required - work from anywhere, anytime.
              </p>
            </div>
          </div>
          
          {/* Professional Use Cases */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Trusted by Professionals Worldwide</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">2M+</div>
                <p className="text-sm text-gray-600">Monthly Active Users</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">50M+</div>
                <p className="text-sm text-gray-600">Files Processed</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-2">300+</div>
                <p className="text-sm text-gray-600">Professional Tools</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 mb-2">99.9%</div>
                <p className="text-sm text-gray-600">Uptime Reliability</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tool Categories Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
              Comprehensive Tool Categories for Every Professional Need
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our specialized tool categories are designed for specific professional workflows, from document management 
              to digital marketing, ensuring you have the right tools for every task.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/pdf-tools" className="group">
              <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="bg-red-100 p-3 rounded-xl w-12 h-12 mb-4 group-hover:scale-110 transition-transform">
                  <FileType className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                  PDF Tools
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  34 professional PDF tools for merging, splitting, compression, conversion, and security
                </p>
                <Badge variant="secondary" className="text-xs">
                  pixorapdf.com
                </Badge>
              </div>
            </Link>
            
            <Link href="/image-tools" className="group">
              <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="bg-blue-100 p-3 rounded-xl w-12 h-12 mb-4 group-hover:scale-110 transition-transform">
                  <ImageIcon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  Image Tools
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  41 advanced image editing tools for resizing, compression, conversion, and enhancement
                </p>
                <Badge variant="secondary" className="text-xs">
                  pixoraimg.com
                </Badge>
              </div>
            </Link>
            
            <Link href="/qr-tools" className="group">
              <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="bg-green-100 p-3 rounded-xl w-12 h-12 mb-4 group-hover:scale-110 transition-transform">
                  <QrCode className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                  QR & Barcode
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  23 QR code and barcode generation tools with custom styling and bulk processing
                </p>
                <Badge variant="secondary" className="text-xs">
                  pixoraqrcode.com
                </Badge>
              </div>
            </Link>
            
            <Link href="/text-tools" className="group">
              <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="bg-yellow-100 p-3 rounded-xl w-12 h-12 mb-4 group-hover:scale-110 transition-transform">
                  <Code className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors">
                  Code Tools
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  52 developer tools for code formatting, validation, minification, and conversion
                </p>
                <Badge variant="secondary" className="text-xs">
                  pixoracode.com
                </Badge>
              </div>
            </Link>
          </div>
          
          {/* Additional Educational Content */}
          <div className="mt-12 bg-white rounded-2xl p-8 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Why Professionals Choose PixoraTools</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Enterprise Features</h4>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Batch processing capabilities for handling multiple files simultaneously</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Advanced compression algorithms that maintain quality while reducing file sizes</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Professional-grade PDF manipulation with bookmark and metadata preservation</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>AI-powered background removal and image enhancement technologies</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Developer Productivity</h4>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Code formatting and validation tools for JSON, XML, HTML, CSS, and JavaScript</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>SEO optimization tools including meta tag generation and sitemap creation</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>QR code generation with custom branding and multiple data format support</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Text processing utilities for encoding, hashing, and case conversion</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-heading font-bold text-white mb-4">
            Transform Your Workflow with Professional Tools
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join over 2 million professionals who rely on PixoraTools for efficient file processing, 
            document management, and digital content creation. Start optimizing your workflow today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8">
              <Zap className="h-5 w-5 mr-2" />
              Start Using Tools Free
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
              <Globe className="h-5 w-5 mr-2" />
              Explore All 300+ Tools
            </Button>
          </div>
        </div>
      </section>

      {/* Industry Applications */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
              Trusted Across Industries
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From startups to Fortune 500 companies, professionals across industries rely on our tools 
              for mission-critical document processing and content optimization.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FileType className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Legal & Finance</h3>
              <p className="text-gray-600 leading-relaxed">
                Law firms and financial institutions use our PDF tools for document preparation, 
                contract management, and secure file processing with encryption and watermarking capabilities.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Marketing & Design</h3>
              <p className="text-gray-600 leading-relaxed">
                Marketing agencies and design studios leverage our image optimization tools for web performance, 
                social media content creation, and brand asset management across multiple platforms.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Code className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Software Development</h3>
              <p className="text-gray-600 leading-relaxed">
                Development teams utilize our code formatting, validation, and conversion tools for maintaining 
                code quality, API testing, and deployment optimization in CI/CD pipelines.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>

      <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </>
  )
}