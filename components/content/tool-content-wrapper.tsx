"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Star, TrendingUp, Users, Award, Shield, Zap, Globe, Target, Lightbulb } from "lucide-react"

interface ToolContentWrapperProps {
  toolName: string
  toolCategory: string
  children: React.ReactNode
  showContentAfterUpload?: boolean
}

export function ToolContentWrapper({ 
  toolName, 
  toolCategory, 
  children, 
  showContentAfterUpload = true 
}: ToolContentWrapperProps) {
  const getToolFeatures = (category: string) => {
    switch (category) {
      case "PDF":
        return [
          { icon: Shield, title: "Secure Processing", description: "All PDF processing happens locally in your browser for complete privacy and security" },
          { icon: Zap, title: "Fast Performance", description: "Optimized algorithms for quick PDF manipulation, merging, splitting, and conversion" },
          { icon: Globe, title: "Universal Compatibility", description: "Works with all PDF versions and maintains document integrity across platforms" },
          { icon: Award, title: "Professional Quality", description: "Enterprise-grade PDF tools trusted by businesses and professionals worldwide" }
        ]
      case "IMAGE":
        return [
          { icon: Star, title: "High Quality Output", description: "Advanced algorithms preserve image quality during processing, compression, and conversion" },
          { icon: Zap, title: "Batch Processing", description: "Process multiple images simultaneously for maximum efficiency and time savings" },
          { icon: Shield, title: "Format Support", description: "Support for all major image formats with intelligent conversion and optimization" },
          { icon: Users, title: "Professional Tools", description: "Used by photographers, designers, and content creators globally for professional workflows" }
        ]
      case "QR":
        return [
          { icon: Award, title: "Custom Styling", description: "Create branded QR codes with logos, colors, custom designs, and professional styling options" },
          { icon: Globe, title: "Universal Scanning", description: "Compatible with all QR scanners and smartphone cameras for reliable scanning experience" },
          { icon: Zap, title: "Bulk Generation", description: "Generate hundreds of QR codes from CSV data or text lists with batch export capabilities" },
          { icon: Shield, title: "Error Correction", description: "Built-in error correction ensures reliable scanning even with damaged or partially obscured codes" }
        ]
      case "CODE":
        return [
          { icon: Zap, title: "Syntax Highlighting", description: "Beautiful syntax highlighting for all major programming languages and markup formats" },
          { icon: Award, title: "Validation & Formatting", description: "Real-time validation with detailed error reporting and intelligent code formatting" },
          { icon: Globe, title: "Multiple Formats", description: "Support for JSON, XML, HTML, CSS, JavaScript, and dozens of other code formats" },
          { icon: Users, title: "Developer Focused", description: "Built by developers for developers with productivity and workflow optimization in mind" }
        ]
      case "SEO":
        return [
          { icon: TrendingUp, title: "Search Optimization", description: "Comprehensive SEO analysis and optimization tools for better search engine rankings" },
          { icon: Target, title: "Keyword Analysis", description: "Advanced keyword research, density analysis, and content optimization recommendations" },
          { icon: Globe, title: "Technical SEO", description: "Meta tags, sitemaps, robots.txt, and structured data generation for technical SEO excellence" },
          { icon: Award, title: "Performance Insights", description: "Page speed analysis, mobile optimization, and Core Web Vitals monitoring and improvement" }
        ]
      default:
        return [
          { icon: Star, title: "Professional Grade", description: "Enterprise-quality tools for all your productivity and business needs" },
          { icon: Zap, title: "Lightning Fast", description: "Optimized performance for instant results and seamless user experience" },
          { icon: Shield, title: "Secure & Private", description: "All processing happens locally in your browser with complete data privacy" },
          { icon: Globe, title: "Always Available", description: "Access from any device with a web browser, no downloads or installations required" }
        ]
    }
  }

  const getUseCases = (category: string) => {
    switch (category) {
      case "PDF":
        return [
          "Document Management: Merge reports, split large files, organize document workflows, and maintain version control",
          "Business Operations: Compress files for email distribution, protect sensitive documents with password encryption",
          "Legal & Compliance: Maintain document integrity while optimizing for storage, sharing, and regulatory requirements",
          "Education: Combine lecture notes, extract specific pages, create study materials, and organize academic resources",
          "Publishing: Prepare documents for print, web distribution, digital archives, and multi-format publishing workflows"
        ]
      case "IMAGE":
        return [
          "E-commerce: Optimize product images for web, create consistent sizing across catalogs, enhance visual appeal",
          "Social Media: Resize images for different platforms, compress for faster loading, maintain quality across formats",
          "Web Development: Optimize images for websites, convert to modern formats like WebP, improve page load speeds",
          "Photography: Batch process photos, apply professional filters, prepare images for client delivery and portfolios",
          "Marketing: Create branded visuals, add watermarks for copyright protection, optimize for digital campaigns"
        ]
      case "QR":
        return [
          "Marketing Campaigns: Track engagement metrics, bridge offline to online experiences, measure campaign effectiveness",
          "Event Management: Contactless check-ins, digital programs, networking facilitation, and attendee engagement",
          "Restaurant Industry: Digital menus, contactless ordering systems, table service optimization, and customer engagement",
          "Retail Operations: Inventory tracking, product information access, customer engagement, and point-of-sale integration",
          "Education: Resource sharing, assignment distribution, interactive learning experiences, and digital classroom management"
        ]
      case "CODE":
        return [
          "Software Development: Format code for readability, validate JSON APIs, debug configuration files, optimize workflows",
          "Web Development: Minify CSS/JS for production, format HTML for maintenance, optimize web resource delivery",
          "Data Processing: Validate and format JSON data, convert between formats, ensure data integrity and structure",
          "API Development: Test and format API responses, validate data structures, debug integration issues",
          "Documentation: Create readable code examples, format configuration files, maintain coding standards"
        ]
      case "SEO":
        return [
          "Website Optimization: Generate meta tags, create sitemaps, optimize content for search engines and user experience",
          "Content Strategy: Analyze keyword density, optimize content structure, improve search visibility and rankings",
          "Technical SEO: Generate structured data, create robots.txt files, optimize technical elements for crawlers",
          "Performance Analysis: Monitor page speed, analyze Core Web Vitals, optimize loading times and user experience",
          "Competitive Analysis: Research competitor strategies, analyze market trends, identify optimization opportunities"
        ]
      default:
        return [
          "Business Productivity: Streamline daily tasks, improve workflow efficiency, automate repetitive processes",
          "Content Creation: Generate text, convert formats, optimize content for various platforms and audiences",
          "Data Management: Process, convert, and validate various data formats with accuracy and reliability",
          "Security: Generate secure passwords, create hashes, protect sensitive information and maintain privacy",
          "Development: Format code, validate data, optimize web resources, and improve development workflows"
        ]
    }
  }

  const getBestPractices = (category: string) => {
    switch (category) {
      case "PDF":
        return [
          "Always maintain backup copies of original documents before processing to prevent data loss",
          "Use appropriate compression levels based on document type and intended use case for optimal results",
          "Test password-protected PDFs to ensure they open correctly on target devices and applications",
          "Consider file size limits when sharing via email or uploading to various platforms and services",
          "Maintain document metadata and bookmarks for better organization and professional presentation"
        ]
      case "IMAGE":
        return [
          "Choose the right format: JPEG for photos, PNG for graphics with transparency, WebP for web optimization",
          "Optimize images for their intended use: web display, print quality, or social media platform requirements",
          "Maintain aspect ratios to prevent distortion unless specifically needed for design purposes",
          "Use appropriate compression levels to balance file size and visual quality for your specific needs",
          "Consider batch processing for consistent results across multiple images and efficient workflow management"
        ]
      case "QR":
        return [
          "Test QR codes on multiple devices and scanning apps before deploying in production environments",
          "Use appropriate error correction levels based on usage environment and potential damage or obstruction",
          "Maintain sufficient contrast between foreground and background colors for reliable scanning",
          "Size QR codes appropriately for viewing distance and scanning conditions in your specific use case",
          "Include clear instructions or call-to-action text near QR codes to guide users and improve scan rates"
        ]
      case "CODE":
        return [
          "Validate code syntax before formatting to catch errors early in the development process",
          "Use consistent indentation and formatting standards across projects for better maintainability",
          "Minify code for production while keeping readable versions for development and debugging",
          "Test formatted code to ensure functionality is preserved after processing and optimization",
          "Use appropriate encoding (UTF-8) for international character support and cross-platform compatibility"
        ]
      case "SEO":
        return [
          "Focus on creating high-quality, valuable content that serves user intent and search queries",
          "Use keyword research tools to identify relevant terms and optimize content naturally without stuffing",
          "Ensure technical SEO elements like meta tags, sitemaps, and structured data are properly implemented",
          "Monitor Core Web Vitals and page speed metrics to maintain good user experience and search rankings",
          "Regularly audit and update SEO strategies based on algorithm changes and performance data"
        ]
      default:
        return [
          "Always verify results before using in production environments to ensure accuracy and reliability",
          "Keep backups of original data before processing or conversion to prevent accidental data loss",
          "Test tools with sample data to understand output formats and available options thoroughly",
          "Use appropriate settings for your specific use case and requirements to achieve optimal results",
          "Consider security implications when processing sensitive information and maintain data privacy"
        ]
    }
  }

  const getIndustryApplications = (category: string) => {
    switch (category) {
      case "PDF":
        return [
          { industry: "Legal", application: "Contract management, document review, compliance reporting, and legal document processing" },
          { industry: "Healthcare", application: "Patient records management, medical reports, regulatory documentation, and HIPAA compliance" },
          { industry: "Finance", application: "Financial statements, audit reports, regulatory filings, and secure document distribution" },
          { industry: "Education", application: "Course materials, research papers, administrative documents, and academic publishing" },
          { industry: "Government", application: "Public records, policy documents, citizen services, and official documentation management" }
        ]
      case "IMAGE":
        return [
          { industry: "E-commerce", application: "Product photography optimization, catalog management, and marketing visual creation" },
          { industry: "Real Estate", application: "Property photos, virtual tours, marketing materials, and listing optimization" },
          { industry: "Media & Publishing", application: "Editorial images, web graphics, print materials, and digital content creation" },
          { industry: "Healthcare", application: "Medical imaging, patient documentation, research visuals, and clinical photography" },
          { industry: "Manufacturing", application: "Product documentation, quality control imaging, technical manuals, and process documentation" }
        ]
      case "QR":
        return [
          { industry: "Retail", application: "Product information access, inventory tracking, customer engagement, and point-of-sale integration" },
          { industry: "Hospitality", application: "Contactless menus, check-in processes, guest services, and customer experience enhancement" },
          { industry: "Events", application: "Ticketing systems, networking facilitation, information distribution, and attendee engagement" },
          { industry: "Transportation", application: "Ticketing systems, route information, passenger services, and logistics management" },
          { industry: "Marketing", application: "Campaign tracking, lead generation, customer acquisition, and engagement measurement" }
        ]
      case "CODE":
        return [
          { industry: "Software Development", application: "Code formatting, API testing, data validation, and development workflow optimization" },
          { industry: "Web Development", application: "Frontend optimization, backend configuration, debugging, and performance enhancement" },
          { industry: "Data Science", application: "Data preprocessing, format conversion, analysis preparation, and data pipeline management" },
          { industry: "DevOps", application: "Configuration management, deployment scripts, monitoring, and infrastructure automation" },
          { industry: "Cybersecurity", application: "Hash generation, data encoding, security testing, and vulnerability assessment" }
        ]
      case "SEO":
        return [
          { industry: "Digital Marketing", application: "SEO strategy, content optimization, keyword research, and performance tracking" },
          { industry: "E-commerce", application: "Product page optimization, category structure, search visibility, and conversion optimization" },
          { industry: "Publishing", application: "Content SEO, article optimization, search visibility, and audience growth" },
          { industry: "SaaS", application: "Landing page optimization, feature page SEO, user acquisition, and organic growth" },
          { industry: "Local Business", application: "Local SEO, Google My Business optimization, local search visibility, and customer acquisition" }
        ]
      default:
        return [
          { industry: "Business", application: "Productivity tools, data processing, workflow optimization, and operational efficiency" },
          { industry: "Education", application: "Content creation, research tools, learning resources, and academic productivity" },
          { industry: "Technology", application: "Development tools, testing utilities, system administration, and technical workflows" },
          { industry: "Creative", application: "Content generation, format conversion, design tools, and creative workflow optimization" },
          { industry: "Research", application: "Data analysis, format conversion, documentation tools, and research productivity" }
        ]
    }
  }

  const features = getToolFeatures(toolCategory)
  const useCases = getUseCases(toolCategory)
  const bestPractices = getBestPractices(toolCategory)
  const industryApplications = getIndustryApplications(toolCategory)

  return (
    <div className="min-h-screen bg-background">
      {children}
      
      {/* Rich Content Section - Only shown after upload/tool usage */}
      {showContentAfterUpload && (
        <>
          {/* Key Features Section */}
          <section className="py-16 px-4 bg-white">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
                  Why Choose {toolName}?
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Professional-grade {toolCategory.toLowerCase()} processing with advanced features, 
                  enterprise security, and optimized performance for all your business and personal needs.
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
                  Professional Use Cases & Applications
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

          {/* Industry Applications Section */}
          <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
                  Industry Applications & Solutions
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Discover how {toolName} is transforming workflows across industries with 
                  professional-grade {toolCategory.toLowerCase()} processing capabilities and enterprise-level reliability.
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
                  Best Practices & Professional Guidelines
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

          {/* Advanced Features Section */}
          <section className="py-16 px-4 bg-white">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
                  Advanced Features & Capabilities
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Explore the advanced features that make {toolName} the preferred choice for professionals 
                  and businesses requiring reliable, high-quality {toolCategory.toLowerCase()} processing solutions.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card>
                  <CardHeader>
                    <Target className="h-8 w-8 text-blue-600 mb-3" />
                    <CardTitle>Precision & Accuracy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Advanced algorithms ensure pixel-perfect accuracy and maintain data integrity 
                      throughout the processing pipeline for professional-quality results.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                        <span>Lossless processing options</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                        <span>Quality preservation algorithms</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                        <span>Metadata preservation</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Lightbulb className="h-8 w-8 text-green-600 mb-3" />
                    <CardTitle>Smart Automation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Intelligent automation features reduce manual work and optimize processing 
                      parameters automatically based on content analysis and best practices.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                        <span>Auto-optimization settings</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                        <span>Batch processing capabilities</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                        <span>Intelligent format detection</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Award className="h-8 w-8 text-purple-600 mb-3" />
                    <CardTitle>Enterprise Ready</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Built for enterprise use with scalable architecture, security compliance, 
                      and integration capabilities for business workflows and systems.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                        <span>API integration support</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                        <span>Compliance standards</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                        <span>Scalable processing</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
                  Frequently Asked Questions
                </h2>
                <p className="text-lg text-gray-600">
                  Common questions about {toolName} and {toolCategory.toLowerCase()} processing
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">How does {toolName} ensure quality?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Our {toolName} uses advanced algorithms and industry-standard processing techniques 
                      to maintain the highest quality output while optimizing for your specific needs. 
                      All processing includes quality validation and error checking.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Is my data secure and private?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Yes, absolutely. All {toolCategory.toLowerCase()} processing happens locally in your browser 
                      or on secure servers with encryption. We never store your files permanently, 
                      and all data is automatically deleted after processing.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">What file formats are supported?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      {toolName} supports all major {toolCategory.toLowerCase()} formats including industry standards 
                      and modern formats. Our intelligent format detection ensures compatibility 
                      and optimal processing for your specific file types.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Can I process multiple files at once?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Yes, {toolName} supports batch processing for multiple files simultaneously. 
                      This feature saves time and ensures consistent processing across all your files 
                      with the same settings and quality standards.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Statistics Section */}
          <section className="py-16 px-4 bg-white">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
                  Trusted by Professionals Worldwide
                </h2>
                <p className="text-lg text-gray-600">
                  Join millions of users who trust our platform for their daily productivity needs
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">2M+</div>
                  <div className="text-sm font-medium text-gray-900 mb-1">Monthly Users</div>
                  <div className="text-xs text-gray-500">Active worldwide</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">50M+</div>
                  <div className="text-sm font-medium text-gray-900 mb-1">Files Processed</div>
                  <div className="text-xs text-gray-500">Since 2020</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">99.9%</div>
                  <div className="text-sm font-medium text-gray-900 mb-1">Success Rate</div>
                  <div className="text-xs text-gray-500">Processing accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
                  <div className="text-sm font-medium text-gray-900 mb-1">Availability</div>
                  <div className="text-xs text-gray-500">Always accessible</div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  )
}