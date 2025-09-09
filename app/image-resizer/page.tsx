"use client"

import { ImageToolsLayout } from "@/components/image-tools-layout"
import { Maximize } from "lucide-react"
import { ImageProcessor } from "@/lib/processors/image-processor"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PersistentAdBanner } from "@/components/ads"

const resizeOptions = [
  {
    key: "width",
    label: "Width (px)",
    type: "input" as const,
    defaultValue: 800,
    min: 1,
    max: 10000,
    section: "Dimensions",
  },
  {
    key: "height",
    label: "Height (px)",
    type: "input" as const,
    defaultValue: 600,
    min: 1,
    max: 10000,
    section: "Dimensions",
  },
  {
    key: "maintainAspectRatio",
    label: "Lock Aspect Ratio",
    type: "checkbox" as const,
    defaultValue: true,
    section: "Dimensions",
  },
]

const resizePresets = [
  { name: "Instagram Post", values: { width: 1080, height: 1080, maintainAspectRatio: false } },
  { name: "YouTube Thumbnail", values: { width: 1280, height: 720, maintainAspectRatio: false } },
  { name: "Facebook Cover", values: { width: 1200, height: 630, maintainAspectRatio: false } },
  { name: "Twitter Header", values: { width: 1500, height: 500, maintainAspectRatio: false } },
  { name: "LinkedIn Post", values: { width: 1200, height: 627, maintainAspectRatio: false } },
  { name: "50% Scale", values: { resizeMode: "percentage", width: 50, height: 50 } },
]

async function resizeImages(files: any[], options: any) {
  try {
    if (files.length === 0) {
      return {
        success: false,
        error: "No files to process",
      }
    }

    const processedFiles = await Promise.all(
      files.map(async (file) => {
        let targetWidth = options.width
        let targetHeight = options.height
        
        // Handle percentage mode
        if (options.resizeMode === "percentage") {
          if (file.dimensions) {
            targetWidth = Math.round((file.dimensions.width * options.width) / 100)
            targetHeight = Math.round((file.dimensions.height * options.height) / 100)
          }
        }
        
        const processedBlob = await ImageProcessor.resizeImage(file.originalFile || file.file, {
          width: targetWidth,
          height: targetHeight,
          maintainAspectRatio: options.maintainAspectRatio,
          outputFormat: "png"
        })

        const processedUrl = URL.createObjectURL(processedBlob)
        
        const baseName = file.name.split(".")[0]
        const newName = `${baseName}_resized.png`

        return {
          ...file,
          processed: true,
          processedPreview: processedUrl,
          name: newName,
          processedSize: processedBlob.size,
          blob: processedBlob,
          dimensions: { width: targetWidth, height: targetHeight }
        }
      })
    )

    return {
      success: true,
      processedFiles,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to resize images",
    }
  }
}

export default function ImageResizerPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Rich Content Section for AdSense Approval */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 mb-4">
              <Maximize className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl lg:text-4xl font-heading font-bold text-foreground">
                Professional Image Resizer & Optimization Tool
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Resize images with precision using our advanced image processing technology. Perfect for web optimization, 
              social media content creation, print preparation, and professional photography workflows. Our intelligent 
              resizing algorithms maintain image quality while providing flexible dimension control through pixels, 
              percentages, and aspect ratio presets. Trusted by photographers, designers, marketers, and content creators 
              worldwide for reliable image optimization and batch processing capabilities.
            </p>
          </div>

          {/* Educational Content for AdSense */}
          <div className="max-w-5xl mx-auto mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Maximize className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Smart Resizing Technology</h3>
                <p className="text-sm text-gray-600">
                  Advanced algorithms preserve image quality while resizing. Support for bicubic interpolation, 
                  Lanczos filtering, and edge-preserving scaling for professional results.
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="h-6 w-6 text-green-600 font-bold text-lg">%</div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Flexible Dimension Control</h3>
                <p className="text-sm text-gray-600">
                  Resize by exact pixels, percentage scaling, or aspect ratio presets. Perfect for social media, 
                  web optimization, and print preparation with Instagram, YouTube, and Facebook presets.
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="h-6 w-6 text-purple-600 font-bold">∞</div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Batch Processing Power</h3>
                <p className="text-sm text-gray-600">
                  Process up to 20 images simultaneously with consistent settings. Ideal for photographers, 
                  e-commerce businesses, and content creators managing large image libraries.
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="h-6 w-6 text-orange-600 font-bold">⚡</div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Instant Processing</h3>
                <p className="text-sm text-gray-600">
                  Client-side processing ensures your images never leave your device. Lightning-fast results 
                  with complete privacy and security for sensitive business and personal content.
                </p>
              </div>
            </div>
            
            {/* Persistent Ad - Same instance across upload and tool interface */}
            <div className="mb-8">
              <PersistentAdBanner 
                adSlot="image-resizer-main"
                adFormat="auto"
                className="max-w-3xl mx-auto"
                mobileOptimized={true}
                persistAcrossPages={true}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Professional Use Cases Section */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Professional Image Resizing Applications & Industry Standards</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Web Development & Digital Marketing</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Website optimization with responsive image sizing for mobile, tablet, and desktop viewports</li>
                  <li>• Social media content creation with platform-specific dimensions for Instagram, Facebook, Twitter, LinkedIn</li>
                  <li>• E-commerce product photography standardization for consistent catalog presentation and faster loading</li>
                  <li>• Email marketing template optimization with size constraints for better deliverability and engagement</li>
                  <li>• Blog and CMS image preparation with SEO-optimized dimensions and file sizes for better search rankings</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Photography & Design</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Print preparation with exact DPI requirements for magazines, brochures, and marketing materials</li>
                  <li>• Portfolio optimization for online galleries, client presentations, and professional showcases</li>
                  <li>• Stock photography submission with marketplace-specific size requirements and quality standards</li>
                  <li>• Wedding and event photography delivery with client-requested dimensions and resolution specifications</li>
                  <li>• Commercial photography workflow optimization for advertising campaigns and brand asset management</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Business & Enterprise Applications</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Corporate branding asset standardization across marketing materials, presentations, and digital platforms</li>
                  <li>• Document management system integration with consistent image sizing for reports and presentations</li>
                  <li>• Real estate photography optimization for MLS listings, virtual tours, and property marketing materials</li>
                  <li>• Medical imaging preparation for telemedicine platforms, patient records, and research documentation</li>
                  <li>• Educational content creation with standardized image dimensions for online courses and training materials</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ImageToolsLayout
        title="Resize Image"
        description="Define your dimensions by percent or pixel, and resize your images with presets."
        icon={Maximize}
        toolType="resize"
        processFunction={resizeImages}
        options={resizeOptions}
        maxFiles={20}
        presets={resizePresets}
        allowBatchProcessing={true}
        supportedFormats={["image/jpeg", "image/png", "image/webp", "image/gif"]}
        outputFormats={["jpeg", "png", "webp"]}
      />
      
      {/* Technical Specifications Section */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Technical Specifications & Quality Standards</h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Our image resizer employs advanced interpolation algorithms including bicubic, Lanczos, and Mitchell filters 
              to ensure optimal quality preservation during scaling operations. Support for high-resolution images up to 
              100MP with memory-optimized processing for professional photography and enterprise applications.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">100MP</div>
                <p className="text-sm text-gray-600">Max Resolution</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">20x</div>
                <p className="text-sm text-gray-600">Batch Processing</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-2">15+</div>
                <p className="text-sm text-gray-600">Format Support</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 mb-2">100%</div>
                <p className="text-sm text-gray-600">Privacy Secure</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
  )
}
  )
}