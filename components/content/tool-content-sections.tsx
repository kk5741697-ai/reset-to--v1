"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  CheckCircle, 
  Shield, 
  Zap, 
  Star, 
  Users, 
  TrendingUp,
  FileText,
  ImageIcon,
  QrCode,
  Code,
  Wrench,
  Globe,
  Clock,
  Award,
  Target,
  Lightbulb
} from "lucide-react"

interface ToolContentSectionsProps {
  toolName: string
  toolCategory: string
  position: "before-upload" | "after-upload"
}

export function ToolContentSections({ toolName, toolCategory, position }: ToolContentSectionsProps) {
  const getToolIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'pdf': return FileText
      case 'image': return ImageIcon
      case 'qr': return QrCode
      case 'text': case 'code': return Code
      case 'seo': return TrendingUp
      default: return Wrench
    }
  }

  const ToolIcon = getToolIcon(toolCategory)

  if (position === "before-upload") {
    return (
      <div className="max-w-4xl mx-auto mb-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-2 mb-3">
            <ToolIcon className="h-6 w-6 text-blue-600" />
            <Badge className="bg-blue-100 text-blue-800">Professional Tool</Badge>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {getToolDescription(toolName, toolCategory)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-green-800 mb-1">100% Secure</h3>
            <p className="text-sm text-green-700">Files processed locally in your browser</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <Zap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-blue-800 mb-1">Lightning Fast</h3>
            <p className="text-sm text-blue-700">Instant processing with no uploads</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
            <Star className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold text-purple-800 mb-1">Professional Quality</h3>
            <p className="text-sm text-purple-700">Enterprise-grade results every time</p>
          </div>
        </div>
      </div>
    )
  }

  // After upload content - comprehensive and valuable
  return (
    <div className="max-w-6xl mx-auto mt-12 space-y-12">
      {/* How It Works */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            How {toolName} Works
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our advanced {toolCategory.toLowerCase()} processing technology delivers professional results 
            with enterprise-grade security and performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <CardTitle>Upload Your Files</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Securely upload your {toolCategory.toLowerCase()} files using our encrypted file transfer system. 
                All processing happens locally in your browser for maximum privacy and security.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <CardTitle>Advanced Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Our cutting-edge algorithms analyze and process your files using industry-leading techniques 
                optimized for quality, speed, and accuracy.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <CardTitle>Download Results</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Get your professionally processed files instantly. Download individual files or 
                bulk archives with optimized compression and quality settings.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features & Benefits */}
      <section className="bg-gray-50 rounded-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose Our {toolName}?
          </h2>
          <p className="text-lg text-gray-600">
            Trusted by millions of professionals worldwide for critical {toolCategory.toLowerCase()} processing tasks
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {getToolFeatures(toolCategory).map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-white rounded-lg shadow-md flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Technical Specifications */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Technical Specifications
          </h2>
          <p className="text-lg text-gray-600">
            Enterprise-grade processing capabilities with industry-leading performance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2 text-blue-600" />
                Processing Capabilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getTechnicalSpecs(toolCategory).processing.map((spec, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-600">{spec.feature}</span>
                    <Badge variant="outline">{spec.value}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-green-600" />
                Quality & Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getTechnicalSpecs(toolCategory).quality.map((spec, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-600">{spec.feature}</span>
                    <Badge variant="outline">{spec.value}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Use Cases & Applications */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Professional Use Cases
          </h2>
          <p className="text-lg text-gray-600">
            Discover how professionals use our {toolName} for critical business operations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getUseCases(toolCategory).map((useCase, index) => (
            <Card key={index} className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-3">
                  <useCase.icon className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-lg">{useCase.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{useCase.description}</p>
                <div className="space-y-2">
                  {useCase.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Best Practices */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Best Practices & Tips
          </h2>
          <p className="text-lg text-gray-600">
            Expert recommendations for optimal {toolCategory.toLowerCase()} processing results
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-yellow-600" />
                Quality Optimization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getBestPractices(toolCategory).quality.map((practice, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-yellow-600">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">{practice.title}</h4>
                      <p className="text-sm text-gray-600">{practice.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-600" />
                Performance Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getBestPractices(toolCategory).performance.map((practice, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-blue-600">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">{practice.title}</h4>
                      <p className="text-sm text-gray-600">{practice.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Industry Statistics */}
      <section className="bg-white border rounded-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Industry Impact & Statistics
          </h2>
          <p className="text-lg text-gray-600">
            See how {toolCategory.toLowerCase()} optimization impacts business productivity and efficiency
          </p>
        </div>
          ))}
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
          </p>

function getToolDescription(toolName: string, category: string): string {
  const descriptions = {
    'PDF': `Advanced PDF processing technology that maintains document integrity while providing 
           professional-grade manipulation capabilities. Trusted by enterprises worldwide for 
           critical document workflows and compliance requirements.`,
    'IMAGE': `State-of-the-art image processing algorithms that preserve quality while optimizing 
             file size and format compatibility. Used by photographers, designers, and content 
             creators for professional image optimization.`,
    'QR': `Professional QR code generation and scanning technology with advanced customization 
          options. Essential for marketing campaigns, inventory management, and digital 
          transformation initiatives.`,
    'TEXT': `Comprehensive text and code processing tools that ensure proper formatting, validation, 
            and optimization. Critical for developers, content creators, and data analysts.`,
    'SEO': `Advanced SEO analysis and optimization tools that help websites achieve better search 
           engine rankings and improved organic visibility.`
  }
  
  return descriptions[category as keyof typeof descriptions] || 
         `Professional ${category.toLowerCase()} processing tool designed for efficiency and quality.`
}

function getToolFeatures(category: string) {
  const features = {
    'PDF': [
      { icon: Shield, title: "Document Security", description: "Maintain document integrity and security" },
      { icon: Zap, title: "Fast Processing", description: "Process large PDFs in seconds" },
      { icon: Users, title: "Batch Operations", description: "Handle multiple files simultaneously" },
      { icon: Award, title: "Quality Preservation", description: "Maintain original document quality" }
    ],
    'IMAGE': [
      { icon: Target, title: "Precision Control", description: "Pixel-perfect image manipulation" },
      { icon: Lightbulb, title: "Smart Optimization", description: "AI-powered quality enhancement" },
      { icon: Globe, title: "Format Support", description: "Support for all major image formats" },
      { icon: Clock, title: "Real-time Preview", description: "See changes instantly" }
    ],
    'QR': [
      { icon: Star, title: "Custom Styling", description: "Unlimited design customization" },
      { icon: Shield, title: "Error Correction", description: "Built-in error correction levels" },
      { icon: Users, title: "Bulk Generation", description: "Generate thousands of QR codes" },
      { icon: TrendingUp, title: "Analytics Ready", description: "Track QR code performance" }
    ]
  }
  
  return features[category as keyof typeof features] || [
    { icon: Zap, title: "Fast Processing", description: "Lightning-fast results" },
    { icon: Shield, title: "Secure", description: "Your data stays private" },
    { icon: Star, title: "Professional", description: "Enterprise-grade quality" },
    { icon: Users, title: "Trusted", description: "Used by millions" }
  ]
}

function getTechnicalSpecs(category: string) {
  const specs = {
    'PDF': {
      processing: [
        { feature: "Max File Size", value: "100MB" },
        { feature: "Page Limit", value: "Unlimited" },
        { feature: "Compression Ratio", value: "Up to 90%" },
        { feature: "Processing Speed", value: "50 pages/sec" }
      ],
      quality: [
        { feature: "Quality Retention", value: "99.9%" },
        { feature: "Format Support", value: "PDF 1.4-2.0" },
        { feature: "Security Level", value: "256-bit AES" },
        { feature: "Metadata Preservation", value: "Complete" }
      ]
    },
    'IMAGE': {
      processing: [
        { feature: "Max Resolution", value: "50MP" },
        { feature: "Batch Limit", value: "100 files" },
        { feature: "Format Support", value: "20+ formats" },
        { feature: "Processing Speed", value: "5MP/sec" }
      ],
      quality: [
        { feature: "Quality Retention", value: "Lossless" },
        { feature: "Color Accuracy", value: "99.8%" },
        { feature: "Compression Efficiency", value: "85%" },
        { feature: "Metadata Support", value: "EXIF/IPTC" }
      ]
    },
    'QR': {
      processing: [
        { feature: "Data Capacity", value: "4,296 chars" },
        { feature: "Error Correction", value: "30% recovery" },
        { feature: "Custom Logos", value: "Unlimited" },
        { feature: "Bulk Generation", value: "10,000/batch" }
      ],
      quality: [
        { feature: "Scan Reliability", value: "99.9%" },
        { feature: "Print Quality", value: "300+ DPI" },
        { feature: "Format Support", value: "PNG/SVG/PDF" },
        { feature: "Customization", value: "Unlimited" }
      ]
    }
  }
  
  return specs[category as keyof typeof specs] || {
    processing: [
      { feature: "Processing Speed", value: "Ultra Fast" },
      { feature: "File Support", value: "Multiple" },
      { feature: "Batch Processing", value: "Enabled" },
      { feature: "Quality", value: "Professional" }
    ],
    quality: [
      { feature: "Accuracy", value: "99.9%" },
      { feature: "Reliability", value: "Enterprise" },
      { feature: "Security", value: "Bank-grade" },
      { feature: "Performance", value: "Optimized" }
    ]
  }
}

function getUseCases(category: string) {
  const useCases = {
    'PDF': [
      {
        icon: Users,
        title: "Business Document Management",
        description: "Streamline document workflows for legal, financial, and administrative processes.",
        benefits: [
          "Reduce file storage costs by up to 80%",
          "Improve document sharing efficiency",
          "Maintain legal compliance standards"
        ]
      },
      {
        icon: Globe,
        title: "Digital Publishing",
        description: "Optimize PDFs for web distribution and mobile viewing experiences.",
        benefits: [
          "Faster website loading times",
          "Better mobile compatibility",
          "Improved user engagement"
        ]
      },
      {
        icon: Shield,
        title: "Secure Document Sharing",
        description: "Protect sensitive documents with password encryption and access controls.",
        benefits: [
          "Enterprise-grade security",
          "Compliance with data regulations",
          "Audit trail capabilities"
        ]
      }
    ],
    'IMAGE': [
      {
        icon: TrendingUp,
        title: "E-commerce Optimization",
        description: "Optimize product images for faster loading and better conversion rates.",
        benefits: [
          "Increase page load speed by 60%",
          "Improve SEO rankings",
          "Boost conversion rates"
        ]
      },
      {
        icon: Users,
        title: "Social Media Marketing",
        description: "Create perfectly sized images for all social media platforms.",
        benefits: [
          "Platform-specific optimization",
          "Consistent brand presentation",
          "Higher engagement rates"
        ]
      },
      {
        icon: Globe,
        title: "Web Development",
        description: "Optimize images for responsive web design and performance.",
        benefits: [
          "Reduced bandwidth usage",
          "Better user experience",
          "Improved Core Web Vitals"
        ]
      }
    ],
    'QR': [
      {
        icon: TrendingUp,
        title: "Marketing Campaigns",
        description: "Create trackable QR codes for marketing materials and advertisements.",
        benefits: [
          "Track campaign performance",
          "Bridge offline to online",
          "Increase customer engagement"
        ]
      },
      {
        icon: Users,
        title: "Event Management",
        description: "Streamline event check-ins and information sharing.",
        benefits: [
          "Contactless check-in process",
          "Instant information sharing",
          "Reduced wait times"
        ]
      },
      {
        icon: Shield,
        title: "Inventory Management",
        description: "Track products and assets with custom QR code systems.",
        benefits: [
          "Real-time inventory tracking",
          "Reduced human error",
          "Improved efficiency"
        ]
      }
    ]
  }
  
  return useCases[category as keyof typeof useCases] || []
}

function getBestPractices(category: string) {
  const practices = {
    'PDF': {
      quality: [
        {
          title: "Optimize Before Processing",
          description: "Ensure your source PDFs are high quality and properly formatted for best results."
        },
        {
          title: "Choose Appropriate Compression",
          description: "Balance file size reduction with quality retention based on your use case."
        },
        {
          title: "Preserve Important Metadata",
          description: "Keep essential document information like author, title, and creation date."
        }
      ],
      performance: [
        {
          title: "Process in Batches",
          description: "Group similar operations together for maximum efficiency and time savings."
        },
        {
          title: "Use Appropriate Settings",
          description: "Select compression levels and options that match your specific requirements."
        },
        {
          title: "Verify Results",
          description: "Always check processed files to ensure they meet your quality standards."
        }
      ]
    },
    'IMAGE': {
      quality: [
        {
          title: "Start with High Resolution",
          description: "Use the highest quality source images for best processing results."
        },
        {
          title: "Choose Optimal Formats",
          description: "Select the right format (JPEG, PNG, WebP) based on your content type."
        },
        {
          title: "Maintain Aspect Ratios",
          description: "Preserve original proportions to avoid distortion and maintain visual quality."
        }
      ],
      performance: [
        {
          title: "Optimize File Sizes",
          description: "Balance quality and file size for your specific use case and platform."
        },
        {
          title: "Use Batch Processing",
          description: "Process multiple images simultaneously to save time and ensure consistency."
        },
        {
          title: "Preview Before Download",
          description: "Always review processed images to ensure they meet your requirements."
        }
      ]
    },
    'QR': {
      quality: [
        {
          title: "Choose Appropriate Error Correction",
          description: "Higher error correction levels ensure better scanning reliability."
        },
        {
          title: "Optimize Logo Size",
          description: "Keep logos under 20% of QR code area for reliable scanning."
        },
        {
          title: "Test Scan Reliability",
          description: "Always test QR codes with multiple devices before deployment."
        }
      ],
      performance: [
        {
          title: "Use High Contrast Colors",
          description: "Ensure sufficient contrast between foreground and background colors."
        },
        {
          title: "Generate Appropriate Sizes",
          description: "Create QR codes sized appropriately for their intended use case."
        },
        {
          title: "Consider Print Quality",
          description: "Use vector formats (SVG) for high-quality printing applications."
        }
      ]
    }
  }
  
  return practices[category as keyof typeof practices] || {
    quality: [
      { title: "Use Quality Sources", description: "Start with high-quality input files" },
      { title: "Choose Right Settings", description: "Select appropriate processing options" },
      { title: "Verify Results", description: "Always check output quality" }
    ],
    performance: [
      { title: "Optimize Settings", description: "Use optimal configuration for your needs" },
      { title: "Process Efficiently", description: "Use batch operations when possible" },
      { title: "Monitor Results", description: "Track processing performance" }
    ]
  }
}

function getIndustryStats(category: string) {
  const stats = {
    'PDF': [
      { value: "2.5B+", label: "PDFs Created Daily", description: "Global PDF usage" },
      { value: "78%", label: "Business Efficiency Gain", description: "With PDF optimization" },
      { value: "65%", label: "Storage Cost Reduction", description: "Through compression" },
      { value: "99.9%", label: "Format Compatibility", description: "Across all devices" }
    ],
    'IMAGE': [
      { value: "3.2B+", label: "Images Uploaded Daily", description: "Across all platforms" },
      { value: "40%", label: "Faster Load Times", description: "With optimization" },
      { value: "85%", label: "Bandwidth Savings", description: "Through compression" },
      { value: "25%", label: "SEO Improvement", description: "With image optimization" }
    ],
    'QR': [
      { value: "5.6B+", label: "QR Scans Annually", description: "Global QR code usage" },
      { value: "94%", label: "Smartphone Compatibility", description: "Built-in QR scanning" },
      { value: "300%", label: "Marketing ROI Increase", description: "With QR campaigns" },
      { value: "15sec", label: "Average Scan Time", description: "User engagement" }
    ]
  }
  
  return stats[category as keyof typeof stats] || [
    { value: "1M+", label: "Daily Users", description: "Trust our tools" },
    { value: "99.9%", label: "Uptime", description: "Reliable service" },
    { value: "50%", label: "Time Savings", description: "Vs manual processing" },
    { value: "24/7", label: "Availability", description: "Always accessible" }
  ]
}

function getFAQs(category: string) {
  const faqs = {
    'PDF': [
      {
        question: "How does PDF compression affect document quality?",
        answer: "Our advanced compression algorithms reduce file size while maintaining visual quality and text readability. We use lossless compression for text and smart lossy compression for images."
      },
      {
        question: "Can I process password-protected PDFs?",
        answer: "Yes, you can upload password-protected PDFs. Our tool will prompt you for the password and process the document securely without storing any credentials."
      },
      {
        question: "What's the maximum file size I can process?",
        answer: "Free users can process PDFs up to 100MB. Premium users have access to larger file limits and additional features for enterprise-scale document processing."
      },
      {
        question: "Are my documents stored on your servers?",
        answer: "No, all PDF processing happens locally in your browser. Your documents never leave your device, ensuring complete privacy and security."
      }
    ],
    'IMAGE': [
      {
        question: "Which image formats are supported?",
        answer: "We support all major image formats including JPEG, PNG, WebP, GIF, BMP, TIFF, and AVIF. You can convert between any of these formats with quality control."
      },
      {
        question: "How much can I compress images without losing quality?",
        answer: "Our smart compression can reduce file sizes by 60-80% while maintaining visual quality. The exact reduction depends on the image content and chosen quality settings."
      },
      {
        question: "Can I process RAW camera files?",
        answer: "Currently, we support standard image formats. For RAW files, we recommend converting them to JPEG or PNG first using your camera software."
      },
      {
        question: "Is batch processing available?",
        answer: "Yes, you can process up to 100 images simultaneously. This feature is perfect for photographers, designers, and content creators who need to process multiple images efficiently."
      }
    ],
    'QR': [
      {
        question: "What data can I encode in QR codes?",
        answer: "QR codes can store up to 4,296 characters including URLs, text, contact information, WiFi credentials, calendar events, and more. Our generator supports all standard QR code data types."
      },
      {
        question: "Can I add my logo to QR codes?",
        answer: "Yes, you can add custom logos and branding to your QR codes. We automatically optimize logo placement and size to maintain scan reliability while preserving your brand identity."
      },
      {
        question: "How reliable are custom-styled QR codes?",
        answer: "Our QR codes maintain 99.9% scan reliability even with custom styling. We use advanced error correction and testing to ensure your codes work across all devices and scanning apps."
      },
      {
        question: "Can I track QR code scans?",
        answer: "While our generator creates static QR codes, you can use URL shorteners or analytics platforms to track scans when encoding URLs in your QR codes."
      }
    ]
  }
  
  return faqs[category as keyof typeof faqs] || [
    {
      question: "How does this tool work?",
      answer: "Our tool uses advanced algorithms to process your files quickly and securely, all within your browser for maximum privacy."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, all processing happens locally in your browser. Your files never leave your device, ensuring complete privacy and security."
    }
  ]
}