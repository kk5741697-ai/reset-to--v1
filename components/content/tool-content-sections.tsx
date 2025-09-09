"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Star, TrendingUp, Users, Award, Shield, Zap, Globe } from "lucide-react"

interface ToolContentSectionsProps {
  toolName: string
  toolCategory: string
  position: "before-upload" | "after-upload" | "before-canvas" | "after-canvas"
}

export function ToolContentSections({ toolName, toolCategory, position }: ToolContentSectionsProps) {
  const getToolFeatures = (category: string) => {
    switch (category) {
      case "PDF":
        return [
          { icon: Shield, title: "Secure Processing", description: "All PDF processing happens locally in your browser for complete privacy" },
          { icon: Zap, title: "Fast Performance", description: "Optimized algorithms for quick PDF manipulation and conversion" },
          { icon: Globe, title: "Universal Compatibility", description: "Works with all PDF versions and maintains document integrity" },
          { icon: Award, title: "Professional Quality", description: "Enterprise-grade PDF tools trusted by businesses worldwide" }
        ]
      case "IMAGE":
        return [
          { icon: Star, title: "High Quality Output", description: "Advanced algorithms preserve image quality during processing" },
          { icon: Zap, title: "Batch Processing", description: "Process multiple images simultaneously for maximum efficiency" },
          { icon: Shield, title: "Format Support", description: "Support for all major image formats with intelligent conversion" },
          { icon: Users, title: "Professional Tools", description: "Used by photographers, designers, and content creators globally" }
        ]
      case "QR":
        return [
          { icon: Award, title: "Custom Styling", description: "Create branded QR codes with logos, colors, and custom designs" },
          { icon: Globe, title: "Universal Scanning", description: "Compatible with all QR scanners and smartphone cameras" },
          { icon: Zap, title: "Bulk Generation", description: "Generate hundreds of QR codes from CSV data or text lists" },
          { icon: Shield, title: "Error Correction", description: "Built-in error correction ensures reliable scanning" }
        ]
      case "CODE":
        return [
          { icon: Zap, title: "Syntax Highlighting", description: "Beautiful syntax highlighting for all major programming languages" },
          { icon: Award, title: "Validation & Formatting", description: "Real-time validation with detailed error reporting" },
          { icon: Globe, title: "Multiple Formats", description: "Support for JSON, XML, HTML, CSS, JavaScript, and more" },
          { icon: Users, title: "Developer Focused", description: "Built by developers for developers with productivity in mind" }
        ]
      default:
        return [
          { icon: Star, title: "Professional Grade", description: "Enterprise-quality tools for all your productivity needs" },
          { icon: Zap, title: "Lightning Fast", description: "Optimized performance for instant results" },
          { icon: Shield, title: "Secure & Private", description: "All processing happens locally in your browser" },
          { icon: Globe, title: "Always Available", description: "Access from any device with a web browser" }
        ]
    }
  }

  const getUseCases = (category: string) => {
    switch (category) {
      case "PDF":
        return [
          "Document Management: Merge reports, split large files, and organize document workflows",
          "Business Operations: Compress files for email, protect sensitive documents with passwords",
          "Legal & Compliance: Maintain document integrity while optimizing for storage and sharing",
          "Education: Combine lecture notes, extract specific pages, and create study materials",
          "Publishing: Prepare documents for print, web distribution, and digital archives"
        ]
      case "IMAGE":
        return [
          "E-commerce: Optimize product images for web, create consistent sizing across catalogs",
          "Social Media: Resize images for different platforms, compress for faster loading",
          "Web Development: Optimize images for websites, convert to modern formats like WebP",
          "Photography: Batch process photos, apply filters, and prepare for client delivery",
          "Marketing: Create branded visuals, add watermarks, and optimize for campaigns"
        ]
      case "QR":
        return [
          "Marketing Campaigns: Track engagement, bridge offline to online experiences",
          "Event Management: Contactless check-ins, digital programs, and networking",
          "Restaurant Industry: Digital menus, contactless ordering, and table service",
          "Retail Operations: Inventory tracking, product information, and customer engagement",
          "Education: Resource sharing, assignment distribution, and interactive learning"
        ]
      case "CODE":
        return [
          "Software Development: Format code for readability, validate JSON APIs, debug issues",
          "Web Development: Minify CSS/JS for production, format HTML for maintenance",
          "Data Processing: Validate and format JSON data, convert between formats",
          "API Development: Test and format API responses, validate data structures",
          "Documentation: Create readable code examples, format configuration files"
        ]
      default:
        return [
          "Business Productivity: Streamline daily tasks and improve workflow efficiency",
          "Content Creation: Generate text, convert formats, and optimize content",
          "Data Management: Process, convert, and validate various data formats",
          "Security: Generate secure passwords, create hashes, and protect information",
          "Development: Format code, validate data, and optimize web resources"
        ]
    }
  }

  const getBestPractices = (category: string) => {
    switch (category) {
      case "PDF":
        return [
          "Always keep backup copies of original documents before processing",
          "Use appropriate compression levels based on document type and intended use",
          "Test password-protected PDFs to ensure they open correctly on target devices",
          "Consider file size limits when sharing via email or uploading to platforms",
          "Maintain document metadata and bookmarks for better organization"
        ]
      case "IMAGE":
        return [
          "Choose the right format: JPEG for photos, PNG for graphics with transparency, WebP for web",
          "Optimize images for their intended use: web display, print, or social media",
          "Maintain aspect ratios to prevent distortion unless specifically needed",
          "Use appropriate compression levels to balance file size and visual quality",
          "Consider batch processing for consistent results across multiple images"
        ]
      case "QR":
        return [
          "Test QR codes on multiple devices and apps before deploying",
          "Use appropriate error correction levels based on usage environment",
          "Maintain sufficient contrast between foreground and background colors",
          "Size QR codes appropriately for viewing distance and scanning conditions",
          "Include clear instructions or call-to-action text near QR codes"
        ]
      case "CODE":
        return [
          "Validate code before formatting to catch syntax errors early",
          "Use consistent indentation and formatting standards across projects",
          "Minify code for production while keeping readable versions for development",
          "Test formatted code to ensure functionality is preserved",
          "Use appropriate encoding (UTF-8) for international character support"
        ]
      default:
        return [
          "Always verify results before using in production environments",
          "Keep backups of original data before processing or conversion",
          "Test tools with sample data to understand output formats and options",
          "Use appropriate settings for your specific use case and requirements",
          "Consider security implications when processing sensitive information"
        ]
    }
  }

  const getIndustryApplications = (category: string) => {
    switch (category) {
      case "PDF":
        return [
          { industry: "Legal", application: "Contract management, document review, and compliance reporting" },
          { industry: "Healthcare", application: "Patient records, medical reports, and regulatory documentation" },
          { industry: "Finance", application: "Financial statements, audit reports, and regulatory filings" },
          { industry: "Education", application: "Course materials, research papers, and administrative documents" },
          { industry: "Government", application: "Public records, policy documents, and citizen services" }
        ]
      case "IMAGE":
        return [
          { industry: "E-commerce", application: "Product photography, catalog management, and marketing visuals" },
          { industry: "Real Estate", application: "Property photos, virtual tours, and marketing materials" },
          { industry: "Media & Publishing", application: "Editorial images, web graphics, and print materials" },
          { industry: "Healthcare", application: "Medical imaging, patient documentation, and research visuals" },
          { industry: "Manufacturing", application: "Product documentation, quality control, and technical manuals" }
        ]
      case "QR":
        return [
          { industry: "Retail", application: "Product information, inventory tracking, and customer engagement" },
          { industry: "Hospitality", application: "Contactless menus, check-in processes, and guest services" },
          { industry: "Events", application: "Ticketing, networking, and information distribution" },
          { industry: "Transportation", application: "Ticketing systems, route information, and passenger services" },
          { industry: "Marketing", application: "Campaign tracking, lead generation, and customer acquisition" }
        ]
      case "CODE":
        return [
          { industry: "Software Development", application: "Code formatting, API testing, and data validation" },
          { industry: "Web Development", application: "Frontend optimization, backend configuration, and debugging" },
          { industry: "Data Science", application: "Data preprocessing, format conversion, and analysis preparation" },
          { industry: "DevOps", application: "Configuration management, deployment scripts, and monitoring" },
          { industry: "Cybersecurity", application: "Hash generation, data encoding, and security testing" }
        ]
      default:
        return [
          { industry: "Business", application: "Productivity tools, data processing, and workflow optimization" },
          { industry: "Education", application: "Content creation, research tools, and learning resources" },
          { industry: "Technology", application: "Development tools, testing utilities, and system administration" },
          { industry: "Creative", application: "Content generation, format conversion, and design tools" },
          { industry: "Research", application: "Data analysis, format conversion, and documentation tools" }
        ]
    }
  }

  const features = getToolFeatures(toolCategory)
  const useCases = getUseCases(toolCategory)
  const bestPractices = getBestPractices(toolCategory)
  const industryApplications = getIndustryApplications(toolCategory)

  if (position === "before-upload") {
    return (
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
              Why Choose {toolName}?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Professional-grade {toolCategory.toLowerCase()} processing with advanced features, 
              enterprise security, and optimized performance for all your business needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index}>
                  <CardHeader className="text-center pb-4">
                    <Icon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Professional Use Cases
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {useCases.map((useCase, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">{useCase}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (position === "after-upload") {
    return (
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
              Industry Applications
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover how {toolName} is transforming workflows across industries with 
              professional-grade {toolCategory.toLowerCase()} processing capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {industryApplications.map((app, index) => (
              <Card key={index}>
                <CardHeader>
                  <Badge variant="outline" className="w-fit mb-2">{app.industry}</Badge>
                  <CardTitle className="text-lg">{app.industry} Solutions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{app.application}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-8 border">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Best Practices & Guidelines
            </h3>
            <div className="space-y-4">
              {bestPractices.map((practice, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600">{index + 1}</span>
                  </div>
                  <p className="text-gray-700">{practice}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return null
}