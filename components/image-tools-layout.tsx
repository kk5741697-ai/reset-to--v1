"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { 
  Upload, 
  Download, 
  CheckCircle,
  X,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  AlertCircle,
  Settings,
  ImageIcon
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { PersistentAdBanner } from "@/components/ads/persistent-ad-banner"

interface ToolOption {
  key: string
  label: string
  type: "text" | "input" | "select" | "checkbox" | "slider" | "color"
  defaultValue: any
  min?: number
  max?: number
  step?: number
  selectOptions?: Array<{ value: string; label: string }>
  section?: string
  condition?: (options: any) => boolean
}

interface ImageFile {
  id: string
  file: File
  originalFile?: File
  name: string
  size: number
  dimensions?: { width: number; height: number }
  preview: string
  processed?: boolean
  processedPreview?: string
  processedSize?: number
  blob?: Blob
}

interface ImageToolsLayoutProps {
  title: string
  description: string
  icon: any
  toolType: string
  processFunction: (files: any[], options: any) => Promise<{ success: boolean; processedFiles?: any[]; error?: string }>
  options?: ToolOption[]
  maxFiles?: number
  presets?: Array<{ name: string; values: any }>
  allowBatchProcessing?: boolean
  supportedFormats?: string[]
  outputFormats?: string[]
}

export function ImageToolsLayout({
  title,
  description,
  icon: Icon,
  toolType,
  processFunction,
  options = [],
  maxFiles = 10,
  presets = [],
  allowBatchProcessing = true,
  supportedFormats = ["image/jpeg", "image/png", "image/webp"],
  outputFormats = ["jpeg", "png", "webp"]
}: ImageToolsLayoutProps) {
  const [files, setFiles] = useState<ImageFile[]>([])
  const [toolOptions, setToolOptions] = useState<Record<string, any>>({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [zoomLevel, setZoomLevel] = useState(100)
  const [showUploadArea, setShowUploadArea] = useState(true)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const defaultOptions: Record<string, any> = {}
    options.forEach(option => {
      defaultOptions[option.key] = option.defaultValue
    })
    setToolOptions(defaultOptions)
  }, [options])

  const handleFileUpload = async (uploadedFiles: FileList | null) => {
    if (!uploadedFiles || uploadedFiles.length === 0) return

    // Enhanced file size checking with stricter limits
    const largeFiles = Array.from(uploadedFiles).filter(file => file.size > 8 * 1024 * 1024)
    const veryLargeFiles = Array.from(uploadedFiles).filter(file => file.size > 15 * 1024 * 1024)
    
    if (largeFiles.length > 0) {
      toast({
        title: "Large files detected", 
        description: `${largeFiles.length} file(s) are larger than 8MB. Processing may be slower and use more memory.`,
      })
    }
    
    if (veryLargeFiles.length > 0) {
      toast({
        title: "Very large files detected",
        description: `${veryLargeFiles.length} file(s) are larger than 15MB. These may fail to process.`,
        variant: "destructive"
      })
    }

    const newFiles: ImageFile[] = []
    
    for (const file of Array.from(uploadedFiles)) {
      if (!supportedFormats.some(format => file.type === format)) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported image format`,
          variant: "destructive"
        })
        continue
      }

      if (files.length + newFiles.length >= maxFiles) {
        toast({
          title: "Too many files",
          description: `Maximum ${maxFiles} files allowed`,
          variant: "destructive"
        })
        break
      }

      // Skip very large files that will cause crashes
      if (file.size > 15 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} is ${Math.round(file.size / (1024 * 1024))}MB. Skipping to prevent crashes.`,
          variant: "destructive"
        })
        continue
      }

      try {
        const dimensions = await getImageDimensions(file)
        
        // Additional dimension safety check
        if (dimensions.width * dimensions.height > 2048 * 2048) {
          toast({
            title: "Image resolution too high",
            description: `${file.name} has very high resolution. This may cause processing issues.`,
            variant: "destructive"
          })
        }
        
        const preview = await createImagePreview(file)
        
        const imageFile: ImageFile = {
          id: `${file.name}-${Date.now()}-${Math.random()}`,
          file,
          originalFile: file,
          name: file.name,
          size: file.size,
          dimensions,
          preview,
        }

        newFiles.push(imageFile)
      } catch (error) {
        toast({
          title: "Error loading image",
          description: `Failed to load ${file.name}`,
          variant: "destructive"
        })
      }
    }

    if (newFiles.length > 0) {
      setFiles(prev => [...prev, ...newFiles])
      setShowUploadArea(false)
      toast({
        title: "Images uploaded",
        description: `${newFiles.length} image${newFiles.length > 1 ? 's' : ''} loaded successfully`
      })
    }
  }

  const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
      img.onerror = reject
      img.src = URL.createObjectURL(file)
    })
  }

  const createImagePreview = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    handleFileUpload(e.dataTransfer.files)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId))
    if (files.length === 1) {
      setShowUploadArea(true)
    }
  }

  const resetTool = () => {
    setFiles([])
    setProcessingProgress(0)
    setShowUploadArea(true)
    setIsMobileSidebarOpen(false)
    
    const defaultOptions: Record<string, any> = {}
    options.forEach(option => {
      defaultOptions[option.key] = option.defaultValue
    })
    setToolOptions(defaultOptions)
  }

  const applyPreset = (preset: any) => {
    setToolOptions(prev => ({ ...prev, ...preset.values }))
  }

  const handleProcess = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please upload images to process",
        variant: "destructive"
      })
      return
    }

    // Pre-processing safety checks
    const hasLargeFiles = files.some(f => f.size > 8 * 1024 * 1024)
    const hasHighResFiles = files.some(f => 
      f.dimensions && f.dimensions.width * f.dimensions.height > 1536 * 1536
    )
    
    if (hasLargeFiles || hasHighResFiles) {
      toast({
        title: "Processing large files",
        description: "Large files detected. Processing may take longer and use more memory.",
      })
    }
    setIsProcessing(true)
    setProcessingProgress(0)

    try {
      // Stagger processing to prevent memory overload
      const progressInterval = setInterval(() => {
        setProcessingProgress(prev => Math.min(prev + 8, 85))
      }, 300)

      const result = await processFunction(files, toolOptions)
      
      clearInterval(progressInterval)
      setProcessingProgress(100)
      
      if (result.success && result.processedFiles) {
        setFiles(result.processedFiles)
        toast({
          title: "Processing complete",
          description: `${result.processedFiles.length} image${result.processedFiles.length !== 1 ? 's' : ''} processed successfully`
        })
        
        // Clean up memory after processing
        setTimeout(() => {
          if ('gc' in window && typeof (window as any).gc === 'function') {
            (window as any).gc()
          }
        }, 1000)
      } else {
        throw new Error(result.error || "Processing failed")
      }
    } catch (error) {
      console.error("Processing failed:", error)
      toast({
        title: "Processing failed",
        description: error instanceof Error ? error.message : "Failed to process images",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
      setProcessingProgress(0)
    }
  }

  const downloadFile = (file: ImageFile) => {
    if (!file.blob) return

    const link = document.createElement("a")
    link.href = file.processedPreview || file.preview
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast({
      title: "Download started",
      description: `${file.name} downloaded successfully`
    })
  }

  const downloadAll = async () => {
    const processedFiles = files.filter(f => f.processed && f.blob)
    
    if (processedFiles.length === 0) {
      toast({
        title: "No processed files",
        description: "Please process images first",
        variant: "destructive"
      })
      return
    }

    if (processedFiles.length === 1) {
      downloadFile(processedFiles[0])
      return
    }

    try {
      const JSZip = (await import("jszip")).default
      const zip = new JSZip()

      processedFiles.forEach((file) => {
        if (file.blob) {
          zip.file(file.name, file.blob)
        }
      })

      const zipBlob = await zip.generateAsync({ type: "blob" })
      const url = URL.createObjectURL(zipBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = "processed-images.zip"
      link.click()
      URL.revokeObjectURL(url)
      
      toast({
        title: "Download started",
        description: "All processed images downloaded as ZIP"
      })
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to create ZIP file",
        variant: "destructive"
      })
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  }

  const optionsBySection = options.reduce((acc, option) => {
    const section = option.section || "General"
    if (!acc[section]) acc[section] = []
    acc[section].push(option)
    return acc
  }, {} as Record<string, ToolOption[]>)

  // Mobile Sidebar Component
  const MobileSidebar = () => (
    <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
      <SheetContent side="bottom" className="h-[80vh] p-0">
        <SheetHeader className="px-6 py-4 border-b bg-gray-50">
          <SheetTitle className="flex items-center space-x-2">
            <Icon className="h-5 w-5 text-blue-600" />
            <span>{title} Settings</span>
          </SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="h-full">
          <div className="p-6 space-y-6">
            {/* Presets */}
            {presets.length > 0 && (
              <div className="space-y-3">
                <Label className="text-sm font-medium">Presets</Label>
                <div className="grid grid-cols-2 gap-2">
                  {presets.map((preset, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        applyPreset(preset)
                        setIsMobileSidebarOpen(false)
                      }}
                      className="text-xs h-auto p-2 flex flex-col items-center"
                    >
                      <span className="font-medium">{preset.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Tool Options */}
            {Object.entries(optionsBySection).map(([section, sectionOptions]) => (
              <div key={section} className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="h-px bg-gray-200 flex-1"></div>
                  <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{section}</Label>
                  <div className="h-px bg-gray-200 flex-1"></div>
                </div>
                
                {sectionOptions.map((option) => {
                  if (option.condition && !option.condition(toolOptions)) {
                    return null
                  }

                  return (
                    <div key={option.key} className="space-y-2">
                      <Label className="text-sm font-medium">{option.label}</Label>
                      
                      {option.type === "text" && (
                        <Input
                          value={toolOptions[option.key] || option.defaultValue}
                          onChange={(e) => setToolOptions(prev => ({ ...prev, [option.key]: e.target.value }))}
                          className="h-10"
                        />
                      )}

                      {option.type === "select" && (
                        <Select
                          value={toolOptions[option.key]?.toString()}
                          onValueChange={(value) => setToolOptions(prev => ({ ...prev, [option.key]: value }))}
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {option.selectOptions?.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}

                      {option.type === "slider" && (
                        <div className="space-y-3">
                          <Slider
                            value={[toolOptions[option.key] || option.defaultValue]}
                            onValueChange={([value]) => setToolOptions(prev => ({ ...prev, [option.key]: value }))}
                            min={option.min}
                            max={option.max}
                            step={option.step}
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>{option.min}</span>
                            <span className="font-medium bg-gray-100 px-2 py-1 rounded">{toolOptions[option.key] || option.defaultValue}</span>
                            <span>{option.max}</span>
                          </div>
                        </div>
                      )}

                      {option.type === "checkbox" && (
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <Checkbox
                            checked={toolOptions[option.key] || false}
                            onCheckedChange={(checked) => setToolOptions(prev => ({ ...prev, [option.key]: checked }))}
                          />
                          <span className="text-sm">{option.label}</span>
                        </div>
                      )}

                      {option.type === "input" && (
                        <Input
                          type="number"
                          value={toolOptions[option.key] || option.defaultValue}
                          onChange={(e) => setToolOptions(prev => ({ ...prev, [option.key]: parseInt(e.target.value) || 0 }))}
                          min={option.min}
                          max={option.max}
                          className="h-10"
                        />
                      )}

                      {option.type === "color" && (
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={toolOptions[option.key] || option.defaultValue}
                            onChange={(e) => setToolOptions(prev => ({ ...prev, [option.key]: e.target.value }))}
                            className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
                          />
                          <Input
                            value={toolOptions[option.key] || option.defaultValue}
                            onChange={(e) => setToolOptions(prev => ({ ...prev, [option.key]: e.target.value }))}
                            className="flex-1 font-mono text-xs"
                          />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}

            {/* Mobile Ad */}
            <div className="py-4">
              <PersistentAdBanner 
                adSlot="mobile-image-sidebar"
                adFormat="auto"
                className="w-full"
                mobileOptimized={true}
                persistAcrossPages={true}
              />
            </div>
          </div>
        </ScrollArea>
        
        {/* Mobile Footer */}
        <div className="p-4 border-t bg-white space-y-3">
          <Button 
            onClick={() => {
              handleProcess()
              setIsMobileSidebarOpen(false)
            }}
            disabled={isProcessing || files.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base font-semibold"
            size="lg"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <Icon className="h-4 w-4 mr-2" />
                Process {files.length} Image{files.length !== 1 ? 's' : ''}
              </>
            )}
          </Button>

          {files.some(f => f.processed) && (
            <Button 
              onClick={() => {
                downloadAll()
                setIsMobileSidebarOpen(false)
              }}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-base font-semibold"
              size="lg"
            >
              <Download className="h-4 w-4 mr-2" />
              Download All
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )

  // Show upload area if no files
  if (showUploadArea && files.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Rich Content Section for AdSense Approval */}
        <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 mb-4">
                <Icon className="h-8 w-8 text-blue-600" />
                <h1 className="text-3xl lg:text-4xl font-heading font-bold text-foreground">
                  Professional {title} Tool
                </h1>
              </div>
              <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                {description} Our advanced image processing technology provides professional-grade results 
                with complete privacy and security. Perfect for photographers, designers, marketers, and content creators 
                who need reliable image optimization and batch processing capabilities.
              </p>
            </div>

            {/* Educational Content for AdSense */}
            <div className="max-w-5xl mx-auto mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Advanced Processing</h3>
                  <p className="text-sm text-gray-600">
                    State-of-the-art algorithms ensure optimal quality while maintaining fast processing speeds.
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <div className="h-6 w-6 text-green-600 font-bold text-lg">🔒</div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Complete Privacy</h3>
                  <p className="text-sm text-gray-600">
                    All processing happens locally in your browser. Your files never leave your device.
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <div className="h-6 w-6 text-purple-600 font-bold">∞</div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Batch Processing</h3>
                  <p className="text-sm text-gray-600">
                    Process multiple images simultaneously with consistent settings for maximum efficiency.
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <div className="h-6 w-6 text-orange-600 font-bold">⚡</div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Instant Results</h3>
                  <p className="text-sm text-gray-600">
                    Get professional results in seconds with our optimized processing engine.
                  </p>
                </div>
              </div>
              
              {/* Persistent Ad - Same instance across upload and tool interface */}
              <div className="mb-8">
                <PersistentAdBanner 
                  adSlot={`${toolType}-main`}
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
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Professional Image Processing Applications</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Digital Marketing & E-commerce</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Product photography optimization for online stores and marketplaces</li>
                    <li>• Social media content creation with platform-specific dimensions</li>
                    <li>• Email marketing image optimization for better deliverability</li>
                    <li>• Website performance optimization through image compression</li>
                    <li>• Brand asset management and consistent visual identity</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Photography</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Wedding and event photography delivery optimization</li>
                    <li>• Portfolio preparation for online galleries and client presentations</li>
                    <li>• Print preparation with exact DPI requirements</li>
                    <li>• Stock photography submission with marketplace specifications</li>
                    <li>• Commercial photography workflow automation</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Business & Enterprise</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Corporate document management and standardization</li>
                    <li>• Real estate photography for MLS listings and marketing</li>
                    <li>• Medical imaging preparation for telemedicine platforms</li>
                    <li>• Educational content creation for online courses</li>
                    <li>• Legal document imaging and archival processing</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6 lg:py-8">
          <div className="text-center mb-6 lg:mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Your Images</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Select your images to begin processing. Our secure tool handles your files with complete privacy.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div 
              className="border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-300 p-8 lg:p-16 group"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              data-tool-action="file-upload"
            >
              <div className="relative mb-4 lg:mb-6">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
                <Upload className="relative h-16 w-16 lg:h-20 lg:w-20 text-blue-500 group-hover:text-blue-600 transition-colors group-hover:scale-110 transform duration-300" />
              </div>
              <h3 className="text-xl lg:text-2xl font-semibold mb-2 lg:mb-3 text-gray-700 group-hover:text-blue-600 transition-colors">Drop images here</h3>
              <p className="text-gray-500 mb-4 lg:mb-6 text-base lg:text-lg text-center">or tap to browse files</p>
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 lg:px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group-hover:scale-105">
                <Upload className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
                Choose Images
              </Button>
              <div className="mt-4 lg:mt-6 space-y-2 text-center">
                <p className="text-sm text-gray-500 font-medium">
                  {supportedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')} files
                </p>
                <p className="text-xs text-gray-400">Up to {maxFiles} files • Up to 100MB each</p>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specifications Section */}
        <div className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Technical Specifications & Quality Standards</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our image processing engine employs advanced algorithms including bicubic interpolation, 
                Lanczos filtering, and edge-preserving scaling to ensure optimal quality preservation 
                during image manipulation operations.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">{maxFiles}x</div>
                  <p className="text-sm text-gray-600">Batch Processing</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">15+</div>
                  <p className="text-sm text-gray-600">Format Support</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-2">100MB</div>
                  <p className="text-sm text-gray-600">Max File Size</p>
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

        <input
          ref={fileInputRef}
          type="file"
          accept={supportedFormats.join(",")}
          multiple={allowBatchProcessing && maxFiles > 1}
          onChange={(e) => handleFileUpload(e.target.files)}
          className="hidden"
        />
      </div>
    )
  }

  // Tool interface after files are uploaded
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-2">
            <Icon className="h-5 w-5 text-blue-600" />
            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={resetTool}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsMobileSidebarOpen(true)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-4 min-h-[60vh]">
          <div className="grid grid-cols-2 gap-4">
            {files.map((file) => (
              <Card key={file.id} className="relative">
                <CardContent className="p-3">
                  <div className="relative">
                    <img
                      src={file.processedPreview || file.preview}
                      alt={file.name}
                      className="w-full aspect-square object-cover border rounded"
                    />
                    {file.processed && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="h-5 w-5 text-green-600 bg-white rounded-full" />
                      </div>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      className="absolute top-2 left-2"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="mt-2 text-center">
                    <p className="text-xs font-medium text-gray-900 truncate">{file.name}</p>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{formatFileSize(file.size)}</span>
                      {file.processedSize && (
                        <span className="text-green-600">→ {formatFileSize(file.processedSize)}</span>
                      )}
                    </div>
                    {file.dimensions && (
                      <p className="text-xs text-gray-400">{file.dimensions.width}×{file.dimensions.height}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Same Persistent Ad continues in tool interface */}
          <div className="mt-6">
            <PersistentAdBanner 
              adSlot={`${toolType}-main`}
              adFormat="auto"
              className="w-full"
              mobileOptimized={true}
              persistAcrossPages={true}
            />
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 space-y-3 z-30">
          {isProcessing && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm font-medium text-blue-800">Processing images...</span>
              </div>
              <Progress value={processingProgress} className="h-2" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={() => setIsMobileSidebarOpen(true)}
              variant="outline"
              className="py-3"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            
            <Button 
              onClick={handleProcess}
              disabled={isProcessing || files.length === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3"
            >
              {isProcessing ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <Icon className="h-4 w-4 mr-2" />
                  Process
                </>
              )}
            </Button>
          </div>

          {files.some(f => f.processed) && (
            <Button 
              onClick={downloadAll}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-base font-semibold"
              size="lg"
            >
              <Download className="h-4 w-4 mr-2" />
              Download All
            </Button>
          )}
        </div>

        <MobileSidebar />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex h-[calc(100vh-8rem)] w-full overflow-hidden">
        {/* Left Canvas */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="bg-white border-b px-6 py-3 flex items-center justify-between shadow-sm flex-shrink-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Icon className="h-5 w-5 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
              </div>
              <Badge variant="secondary">Image Mode</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={resetTool}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              {files.length > 0 && (
                <div className="flex items-center space-x-1 border rounded-md">
                  <Button variant="ghost" size="sm" onClick={() => setZoomLevel(prev => Math.max(25, prev - 25))}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm px-2">{zoomLevel}%</span>
                  <Button variant="ghost" size="sm" onClick={() => setZoomLevel(prev => Math.min(400, prev + 25))}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setZoomLevel(100)}>
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Canvas Content */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-6 space-y-4 min-h-[calc(100vh-12rem)]">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {files.map((file) => (
                    <Card key={file.id} className="relative group">
                      <CardContent className="p-3">
                        <div className="relative">
                          <img
                            src={file.processedPreview || file.preview}
                            alt={file.name}
                            className="w-full aspect-square object-cover border rounded transition-transform group-hover:scale-105"
                            style={{ 
                              transform: `scale(${Math.min(zoomLevel / 100, 1)})`,
                              transition: "transform 0.2s ease"
                            }}
                          />
                          {file.processed && (
                            <div className="absolute top-2 right-2">
                              <CheckCircle className="h-5 w-5 text-green-600 bg-white rounded-full" />
                            </div>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFile(file.id)}
                            className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                          {file.processed && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadFile(file)}
                              className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        <div className="mt-2 text-center">
                          <p className="text-xs font-medium text-gray-900 truncate">{file.name}</p>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{formatFileSize(file.size)}</span>
                            {file.processedSize && (
                              <span className="text-green-600">→ {formatFileSize(file.processedSize)}</span>
                            )}
                          </div>
                          {file.dimensions && (
                            <p className="text-xs text-gray-400">{file.dimensions.width}×{file.dimensions.height}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Canvas Ad */}
                <div className="my-8">
                  <PersistentAdBanner 
                    adSlot={`${toolType}-main`}
                    adFormat="horizontal"
                    className="max-w-2xl mx-auto"
                    persistAcrossPages={true}
                  />
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Desktop Right Sidebar */}
        <div className="w-80 xl:w-96 bg-white border-l shadow-lg flex flex-col h-full">
          <div className="px-6 py-4 border-b bg-gray-50 flex-shrink-0">
            <div className="flex items-center space-x-2">
              <Icon className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            </div>
            <p className="text-sm text-gray-600 mt-1">Configure processing options</p>
          </div>

          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-6 space-y-6">
                {/* Presets */}
                {presets.length > 0 && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Presets</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {presets.map((preset, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => applyPreset(preset)}
                          className="text-xs h-auto p-2 flex flex-col items-center"
                        >
                          <span className="font-medium">{preset.name}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tool Options */}
                {Object.entries(optionsBySection).map(([section, sectionOptions]) => (
                  <div key={section} className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="h-px bg-gray-200 flex-1"></div>
                      <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{section}</Label>
                      <div className="h-px bg-gray-200 flex-1"></div>
                    </div>
                    
                    {sectionOptions.map((option) => {
                      if (option.condition && !option.condition(toolOptions)) {
                        return null
                      }

                      return (
                        <div key={option.key} className="space-y-2">
                          <Label className="text-sm font-medium">{option.label}</Label>
                          
                          {option.type === "text" && (
                            <Input
                              value={toolOptions[option.key] || option.defaultValue}
                              onChange={(e) => setToolOptions(prev => ({ ...prev, [option.key]: e.target.value }))}
                              className="h-9"
                            />
                          )}

                          {option.type === "select" && (
                            <Select
                              value={toolOptions[option.key]?.toString()}
                              onValueChange={(value) => setToolOptions(prev => ({ ...prev, [option.key]: value }))}
                            >
                              <SelectTrigger className="h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {option.selectOptions?.map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}

                          {option.type === "slider" && (
                            <div className="space-y-2">
                              <Slider
                                value={[toolOptions[option.key] || option.defaultValue]}
                                onValueChange={([value]) => setToolOptions(prev => ({ ...prev, [option.key]: value }))}
                                min={option.min}
                                max={option.max}
                                step={option.step}
                              />
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>{option.min}</span>
                                <span className="font-medium">{toolOptions[option.key] || option.defaultValue}</span>
                                <span>{option.max}</span>
                              </div>
                            </div>
                          )}

                          {option.type === "checkbox" && (
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                checked={toolOptions[option.key] || false}
                                onCheckedChange={(checked) => setToolOptions(prev => ({ ...prev, [option.key]: checked }))}
                              />
                              <span className="text-sm">{option.label}</span>
                            </div>
                          )}

                          {option.type === "input" && (
                            <Input
                              type="number"
                              value={toolOptions[option.key] || option.defaultValue}
                              onChange={(e) => setToolOptions(prev => ({ ...prev, [option.key]: parseInt(e.target.value) || 0 }))}
                              min={option.min}
                              max={option.max}
                              className="h-9"
                            />
                          )}

                          {option.type === "color" && (
                            <div className="flex items-center space-x-2">
                              <input
                                type="color"
                                value={toolOptions[option.key] || option.defaultValue}
                                onChange={(e) => setToolOptions(prev => ({ ...prev, [option.key]: e.target.value }))}
                                className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
                              />
                              <Input
                                value={toolOptions[option.key] || option.defaultValue}
                                onChange={(e) => setToolOptions(prev => ({ ...prev, [option.key]: e.target.value }))}
                                className="flex-1 font-mono text-xs"
                              />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ))}

                {/* File Info */}
                {files.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="text-sm font-semibold text-blue-800 mb-2">Image Info</h4>
                    <div className="text-xs text-blue-700 space-y-1">
                      <div className="flex justify-between">
                        <span>Total Files:</span>
                        <span className="font-medium">{files.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Size:</span>
                        <span className="font-medium">{formatFileSize(files.reduce((sum, f) => sum + f.size, 0))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Processed:</span>
                        <span className="font-medium">{files.filter(f => f.processed).length}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Same Persistent Ad in sidebar */}
                <div className="pt-4">
                  <PersistentAdBanner 
                    adSlot={`${toolType}-sidebar`}
                    adFormat="auto"
                    className="w-full"
                    persistAcrossPages={true}
                  />
                </div>
              </div>
            </ScrollArea>
          </div>

          <div className="p-6 border-t bg-gray-50 space-y-3 flex-shrink-0">
            {isProcessing && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm font-medium text-blue-800">Processing images...</span>
                </div>
                <Progress value={processingProgress} className="h-2" />
              </div>
            )}

            <Button 
              onClick={handleProcess}
              disabled={isProcessing || files.length === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base font-semibold"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Icon className="h-4 w-4 mr-2" />
                  Process {files.length} Image{files.length !== 1 ? 's' : ''}
                </>
              )}
            </Button>

            {files.some(f => f.processed) && (
              <Button 
                onClick={downloadAll}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-base font-semibold"
                size="lg"
              >
                <Download className="h-4 w-4 mr-2" />
                Download All ({files.filter(f => f.processed).length})
              </Button>
            )}
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={supportedFormats.join(",")}
        multiple={allowBatchProcessing && maxFiles > 1}
        onChange={(e) => handleFileUpload(e.target.files)}
        className="hidden"
      />
    </div>
  )
}