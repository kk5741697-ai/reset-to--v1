"use client"

import { useState, useRef, useCallback } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, Download, CheckCircle, X, RefreshCw, Settings, Archive } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { ImageToolsLayout } from "@/components/image-tools-layout"
import { ImageProcessor } from "@/lib/processors/image-processor"
import { PersistentAdManager } from "@/components/ads/persistent-ad-manager"
import { ToolContentSections } from "@/components/content/tool-content-sections"

const compressionOptions = [
  {
    key: "quality",
    label: "Quality",
    type: "slider" as const,
    defaultValue: 70,
    min: 10,
    max: 100,
    step: 5,
  },
  {
    key: "compressionLevel",
    label: "Compression Level",
    type: "select" as const,
    defaultValue: "medium",
    selectOptions: [
      { value: "low", label: "Low Compression (High Quality)" },
      { value: "medium", label: "Medium Compression (Balanced)" },
      { value: "high", label: "High Compression (Small Size)" },
      { value: "maximum", label: "Maximum Compression (Smallest)" },
    ],
  },
  {
    key: "outputFormat",
    label: "Output Format",
    type: "select" as const,
    defaultValue: "jpeg",
    selectOptions: [
      { value: "jpeg", label: "JPEG" },
      { value: "png", label: "PNG" },
      { value: "webp", label: "WebP" },
    ],
  },
]

async function compressImages(files: any[], options: any) {
  try {
    if (files.length === 0) {
      return {
        success: false,
        error: "No files to process",
      }
    }

    const processedFiles = await Promise.all(
      files.map(async (file) => {
        const quality = parseFloat(options.quality || 70)
        const processedBlob = await ImageProcessor.compressImage(file.originalFile || file.file, {
          quality,
          compressionLevel: options.compressionLevel,
          outputFormat: options.outputFormat,
        })

        const processedUrl = URL.createObjectURL(processedBlob)
        
        const outputFormat = options.outputFormat || "jpeg"
        const baseName = file.name.split(".")[0]
        const newName = `${baseName}_compressed.${outputFormat}`

        return {
          ...file,
          processed: true,
          processedPreview: processedUrl,
          name: newName,
          processedSize: processedBlob.size,
          blob: processedBlob
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
      error: error instanceof Error ? error.message : "Failed to compress images",
    }
  }
}

export default function ImageCompressorPage() {
  const [showUploadArea, setShowUploadArea] = useState(true)
  const [files, setFiles] = useState<any[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = useCallback((uploadedFiles: FileList | null) => {
    if (!uploadedFiles || uploadedFiles.length === 0) return
    
    // Process files and hide upload area
    setShowUploadArea(false)
    // Handle file processing logic here
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    handleFileUpload(e.dataTransfer.files)
  }, [handleFileUpload])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  // Show upload interface with content
  if (showUploadArea) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Before Upload Content */}
        <ToolContentSections 
          toolName="Image Compressor" 
          toolCategory="IMAGE" 
          position="before-upload" 
        />
        
        {/* Before Upload Ad */}
        <div className="container mx-auto px-4 py-6">
          <PersistentAdManager 
            toolName="image-compressor"
            adSlot="before-upload-banner"
            position="before-upload"
            className="max-w-4xl mx-auto mb-8"
          />
        </div>

        {/* Upload Area */}
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 mb-4">
              <Archive className="h-8 w-8 text-green-600" />
              <h1 className="text-3xl font-heading font-bold text-foreground">Image Compressor</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Reduce image file size while maintaining quality. Perfect for web optimization, email attachments, and storage management.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div 
              className="border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:border-green-400 hover:bg-green-50/30 transition-all duration-300 p-16 group"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
                <Upload className="relative h-20 w-20 text-green-500 group-hover:text-green-600 transition-colors group-hover:scale-110 transform duration-300" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-700 group-hover:text-green-600 transition-colors">Drop images here</h3>
              <p className="text-gray-500 mb-6 text-lg text-center">or click to browse files</p>
              <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group-hover:scale-105">
                <Upload className="h-5 w-5 mr-2" />
                Choose Images
              </Button>
              <div className="mt-6 space-y-2 text-center">
                <p className="text-sm text-gray-500 font-medium">JPG, PNG, WebP files</p>
                <p className="text-xs text-gray-400">Up to 15 files • Up to 100MB each</p>
              </div>
            </div>
          </div>
        </div>

        {/* After Upload Ad */}
        <div className="container mx-auto px-4 py-6">
          <PersistentAdManager 
            toolName="image-compressor"
            adSlot="after-upload-banner"
            position="after-upload"
            className="max-w-4xl mx-auto mb-8"
          />
        </div>

        {/* After Upload Content */}
        <ToolContentSections 
          toolName="Image Compressor" 
          toolCategory="IMAGE" 
          position="after-upload" 
        />

        <Footer />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFileUpload(e.target.files)}
          className="hidden"
        />
      </div>
    )
  }

  // Return the existing ImageToolsLayout for processing interface
  return (
    <ImageToolsLayout
      title="Image Compressor"
      description="Reduce image file size while maintaining quality. Perfect for web optimization and storage."
      icon={Archive}
      toolType="compress"
      processFunction={compressImages}
      options={compressionOptions}
      maxFiles={15}
      allowBatchProcessing={true}
      supportedFormats={["image/jpeg", "image/png", "image/webp"]}
      outputFormats={["jpeg", "png", "webp"]}
    />
  )
}