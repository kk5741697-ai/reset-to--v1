"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { 
  Copy, 
  Download, 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Settings,
  RefreshCw,
  Eye,
  Code,
  Archive
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { AdBanner } from "@/components/ads/ad-banner"

interface ToolOption {
  key: string
  label: string
  type: "text" | "select" | "checkbox" | "slider" | "color"
  defaultValue: any
  min?: number
  max?: number
  step?: number
  selectOptions?: Array<{ value: string | number; label: string }>
  condition?: (options: any) => boolean
}

interface Example {
  name: string
  content: string
}

interface TextToolLayoutProps {
  title: string
  description: string
  icon: any
  placeholder: string
  outputPlaceholder: string
  processFunction: (input: string, options?: any) => { output: string; error?: string; stats?: Record<string, any> }
  validateFunction?: (input: string) => { isValid: boolean; error?: string }
  options?: ToolOption[]
  examples?: Example[]
  fileExtensions?: string[]
}

export function TextToolLayout({
  title,
  description,
  icon: Icon,
  placeholder,
  outputPlaceholder,
  processFunction,
  validateFunction,
  options = [],
  examples = [],
  fileExtensions = [".txt"]
}: TextToolLayoutProps) {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [stats, setStats] = useState<Record<string, any> | null>(null)
  const [toolOptions, setToolOptions] = useState<Record<string, any>>({})
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  // Initialize default options
  useEffect(() => {
    const defaultOptions: Record<string, any> = {}
    options.forEach(option => {
      defaultOptions[option.key] = option.defaultValue
    })
    setToolOptions(defaultOptions)
  }, [options])

  // Process text when input or options change
  useEffect(() => {
    if (input.trim()) {
      processText()
    } else {
      setOutput("")
      setError("")
      setStats(null)
    }
  }, [input, toolOptions])

  const processText = () => {
    try {
      // Validate input if validator provided
      if (validateFunction) {
        const validation = validateFunction(input)
        if (!validation.isValid) {
          setError(validation.error || "Invalid input")
          setOutput("")
          setStats(null)
          return
        }
      }

      const result = processFunction(input, toolOptions)
      
      if (result.error) {
        setError(result.error)
        setOutput("")
        setStats(null)
      } else {
        setOutput(result.output)
        setError("")
        setStats(result.stats || null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Processing failed")
      setOutput("")
      setStats(null)
    }
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: `${type} copied successfully`
    })
  }

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
    
    toast({
      title: "Download started",
      description: `${filename} downloaded successfully`
    })
  }

  const loadExample = (example: Example) => {
    setInput(example.content)
  }

  const clearAll = () => {
    setInput("")
    setOutput("")
    setError("")
    setStats(null)
  }

  // Mobile Sidebar Component
  const MobileSidebar = () => (
    <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
      <SheetContent side="bottom" className="h-[70vh] p-0">
        <SheetHeader className="px-6 py-4 border-b bg-gray-50">
          <SheetTitle className="flex items-center space-x-2">
            <Icon className="h-5 w-5 text-blue-600" />
            <span>{title} Settings</span>
          </SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="h-full">
          <div className="p-6 space-y-6">
            {/* Tool Options */}
            {options.map((option) => {
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
                          <SelectItem key={opt.value} value={opt.value.toString()}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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

            {/* Examples */}
            {examples.length > 0 && (
              <div className="space-y-3">
                <Label className="text-sm font-medium">Examples</Label>
                <div className="space-y-2">
                  {examples.map((example, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        loadExample(example)
                        setIsMobileSidebarOpen(false)
                      }}
                      className="w-full justify-start h-auto p-3"
                    >
                      <div className="text-left">
                        <div className="font-medium">{example.name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {example.content.substring(0, 50)}...
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Rich Content Section for AdSense Approval */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 mb-4">
              <Icon className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl lg:text-4xl font-heading font-bold text-foreground">{title}</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              {description} Our advanced text processing technology ensures accurate results 
              while maintaining data integrity and format compliance. Perfect for developers, 
              content creators, and professionals who demand precision in their text processing workflows.
            </p>
          </div>

          {/* Educational Content */}
          <div className="max-w-5xl mx-auto mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Code className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Format & Beautify</h3>
                <p className="text-sm text-gray-600">
                  Transform minified or messy text into readable, properly formatted content with customizable styling options.
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Validate & Verify</h3>
                <p className="text-sm text-gray-600">
                  Detect and highlight syntax errors with detailed error messages and suggestions for corrections.
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Archive className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Minify & Compress</h3>
                <p className="text-sm text-gray-600">
                  Remove unnecessary whitespace and optimize text for production use and better performance.
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Eye className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Live Preview</h3>
                <p className="text-sm text-gray-600">
                  See real-time results as you type with instant processing and syntax highlighting.
                </p>
              </div>
            </div>
            
            {/* Content Area Ad */}
            <div className="mb-8">
              <PersistentAdBanner 
                adSlot="text-tools-main"
              <PersistentAdBanner 
                adSlot="text-tools-main"
                mobileOptimized={true}
                persistAcrossPages={true}
                persistAcrossPages={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-2">
            <Icon className="h-5 w-5 text-blue-600" />
            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={clearAll}>
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

        <div className="p-4 space-y-4">
          {/* Input */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Input</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={placeholder}
                className="min-h-[200px] font-mono text-sm"
              />
            </CardContent>
          </Card>

          {/* Output */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Output</CardTitle>
            </CardHeader>
            <CardContent>
              {error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-red-800">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Error</span>
                  </div>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              ) : (
                <Textarea
                  value={output}
                  readOnly
                  placeholder={outputPlaceholder}
                  className="min-h-[200px] font-mono text-sm"
                />
              )}
            </CardContent>
          </Card>

          {/* Stats */}
          {stats && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(stats).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className="text-lg font-bold">{value}</div>
                      <div className="text-xs text-muted-foreground">{key}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Mobile Canvas Ad */}
          <div className="my-6">
            <PersistentAdBanner 
              adSlot="text-tools-main"
              adFormat="auto"
              className="w-full"
              mobileOptimized={true}
              persistAcrossPages={true}
            />
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 space-y-3 z-30">
          <div className="grid grid-cols-3 gap-2">
            <Button 
              onClick={() => setIsMobileSidebarOpen(true)}
              variant="outline"
              size="sm"
            >
              <Settings className="h-4 w-4 mr-1" />
              Options
            </Button>
            
            <Button 
              onClick={() => copyToClipboard(output, "Output")}
              disabled={!output}
              variant="outline"
              size="sm"
            >
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </Button>
            
            <Button 
              onClick={() => downloadFile(output, `${title.toLowerCase().replace(/\s+/g, '-')}.${fileExtensions[0]?.replace('.', '') || 'txt'}`)}
              disabled={!output}
              variant="outline"
              size="sm"
            >
              <Download className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        </div>

        <MobileSidebar />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex h-[calc(100vh-8rem)] w-full overflow-hidden">
        {/* Left Panel - Input */}
        <div className="flex-1 flex flex-col border-r">
          <div className="bg-white border-b px-6 py-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-2">
              <Icon className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Input</h2>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={clearAll}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex-1 p-6">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
              className="w-full h-full font-mono text-sm resize-none"
            />
          </div>
        </div>

        {/* Center Panel - Output */}
        <div className="flex-1 flex flex-col">
          <div className="bg-white border-b px-6 py-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900">Output</h2>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                onClick={() => copyToClipboard(output, "Output")}
                disabled={!output}
                variant="outline"
                size="sm"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button 
                onClick={() => downloadFile(output, `${title.toLowerCase().replace(/\s+/g, '-')}.${fileExtensions[0]?.replace('.', '') || 'txt'}`)}
                disabled={!output}
                variant="outline"
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
          
          <div className="flex-1 p-6">
            {error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center space-x-2 text-red-800 mb-2">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium">Processing Error</span>
                </div>
                <p className="text-red-700">{error}</p>
              </div>
            ) : (
              <Textarea
                value={output}
                readOnly
                placeholder={outputPlaceholder}
                className="w-full h-full font-mono text-sm resize-none"
              />
            )}
          </div>

          {/* Canvas Ad */}
          <div className="p-6 border-t">
            <AdBanner 
              adSlot="text-canvas-content"
              adFormat="horizontal"
              className="max-w-2xl mx-auto"
            />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 bg-white border-l shadow-lg flex flex-col">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Settings & Examples</h2>
            <p className="text-sm text-gray-600 mt-1">Configure processing options</p>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-6 space-y-6">
              {/* Tool Options */}
              {options.length > 0 && (
                <div className="space-y-4">
                  <Label className="text-sm font-medium">Options</Label>
                  {options.map((option) => {
                    if (option.condition && !option.condition(toolOptions)) {
                      return null
                    }

                    return (
                      <div key={option.key} className="space-y-2">
                        <Label className="text-sm">{option.label}</Label>
                        
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
                                <SelectItem key={opt.value} value={opt.value.toString()}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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

                        {option.type === "color" && (
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              value={toolOptions[option.key] || option.defaultValue}
                              onChange={(e) => setToolOptions(prev => ({ ...prev, [option.key]: e.target.value }))}
                              className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
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
              )}

              {/* Examples */}
              {examples.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Examples</Label>
                  <div className="space-y-2">
                    {examples.map((example, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => loadExample(example)}
                        className="w-full justify-start h-auto p-3"
                      >
                        <div className="text-left">
                          <div className="font-medium">{example.name}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {example.content.substring(0, 40)}...
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Statistics */}
              {stats && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Statistics</Label>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="space-y-2">
                      {Object.entries(stats).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-blue-700">{key}:</span>
                          <span className="font-medium text-blue-900">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Sidebar Ad */}
              <div className="pt-4">
                <PersistentAdBanner 
                  adSlot="text-tools-sidebar"
                  adFormat="auto"
                  className="w-full"
                  persistAcrossPages={true}
                />
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>

    </div>
  )
}