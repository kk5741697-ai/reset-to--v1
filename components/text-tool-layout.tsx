"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Copy, 
  Download, 
  Upload, 
  Link, 
  RefreshCw,
  Settings,
  Trash2,
  Eye,
  Share2,
  Heart,
  AlertCircle,
  FileText,
  Menu
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { AdBanner } from "@/components/ads/ad-banner"

interface ToolOption {
  key: string
  label: string
  type: "text" | "number" | "select" | "checkbox" | "slider" | "color"
  defaultValue: any
  min?: number
  max?: number
  step?: number
  selectOptions?: Array<{ value: string; label: string }>
}

interface TextExample {
  name: string
  content: string
}

interface TextToolLayoutProps {
  title: string
  description: string
  icon: any
  placeholder: string
  outputPlaceholder: string
  processFunction: (input: string, options: any) => { output: string; error?: string; stats?: any }
  validateFunction?: (input: string) => { isValid: boolean; error?: string }
  options?: ToolOption[]
  examples?: TextExample[]
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
  const [autoUpdate, setAutoUpdate] = useState(true)
  const [error, setError] = useState("")
  const [stats, setStats] = useState<any>(null)
  const [toolOptions, setToolOptions] = useState<Record<string, any>>({})
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Initialize options with defaults
  useEffect(() => {
    const defaultOptions: Record<string, any> = {}
    options.forEach(option => {
      defaultOptions[option.key] = option.defaultValue
    })
    setToolOptions(defaultOptions)
  }, [options])

  useEffect(() => {
    if (autoUpdate && input.trim()) {
      processText()
    } else if (!input.trim()) {
      setOutput("")
      setError("")
      setStats(null)
    }
  }, [input, autoUpdate, toolOptions])

  const processText = () => {
    if (!input.trim()) {
      setOutput("")
      setError("")
      setStats(null)
      return
    }

    if (validateFunction) {
      const validation = validateFunction(input)
      if (!validation.isValid) {
        setError(validation.error || "Invalid input")
        setOutput("")
        setStats(null)
        return
      }
    }

    try {
      const result = processFunction(input, toolOptions)
      setOutput(result.output)
      setError(result.error || "")
      setStats(result.stats)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Processing failed")
      setOutput("")
      setStats(null)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied to clipboard",
        description: "Text has been copied successfully"
      })
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const loadExample = (exampleContent: string) => {
    setInput(exampleContent)
  }

  const getFileExtension = () => {
    return fileExtensions[0] || ".txt"
  }

  // Mobile Options Sidebar
  const MobileOptionsSidebar = () => (
    <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
      <SheetContent side="bottom" className="h-[70vh] p-0">
        <SheetHeader className="px-6 py-4 border-b bg-gray-50">
          <SheetTitle className="flex items-center space-x-2">
            <Icon className="h-5 w-5 text-teal-600" />
            <span>{title} Options</span>
          </SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="h-full">
          <div className="p-6 space-y-6">
            {/* Tool Options */}
            {options.map((option) => (
              <div key={option.key} className="space-y-2">
                <Label className="text-sm font-medium">{option.label}</Label>
                
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
              </div>
            ))}

            {/* Mobile Examples */}
            {examples.length > 0 && (
              <div className="space-y-3">
                <Label className="text-sm font-medium">Examples</Label>
                <div className="space-y-2">
                  {examples.map((example, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      onClick={() => {
                        loadExample(example.content)
                        setIsMobileSidebarOpen(false)
                      }}
                      className="w-full h-auto p-3 text-left justify-start"
                    >
                      <div>
                        <div className="font-medium text-sm">{example.name}</div>
                        <div className="text-xs text-gray-500 mt-1 truncate">
                          {example.content.substring(0, 40)}...
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Mobile Ad */}
            <div className="py-4">
              <AdBanner 
                adSlot="mobile-text-sidebar"
                adFormat="auto"
                className="w-full"
                mobileOptimized={true}
              />
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Top Ad Banner */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <AdBanner 
            adSlot="tool-header-banner"
            adFormat="auto"
            className="max-w-4xl mx-auto"
            mobileOptimized={true}
          />
        </div>
      </div>

      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3 lg:py-4">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-2xl font-bold text-gray-900">Code</span>
            <Heart className="h-6 w-6 text-teal-500 fill-teal-500" />
            <span className="text-2xl font-bold text-gray-900">Beautify</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 text-center">{title}</h1>
          <div className="flex flex-wrap items-center justify-center space-x-2 text-gray-600 text-sm lg:text-base">
            <Icon className="h-5 w-5 text-teal-600" />
            <span>{description}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 lg:py-8">
        {/* Mobile Options Button */}
        {isMobile && (options.length > 0 || examples.length > 0) && (
          <div className="mb-4">
            <Button
              onClick={() => setIsMobileSidebarOpen(true)}
              variant="outline"
              className="w-full h-12 flex items-center justify-center space-x-2"
            >
              <Settings className="h-4 w-4" />
              <span>Options & Examples</span>
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Desktop Sidebar */}
          {!isMobile && (options.length > 0 || examples.length > 0) && (
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Settings className="h-5 w-5 text-teal-600" />
                    <span>Options</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Tool Options */}
                  {options.map((option) => (
                    <div key={option.key} className="space-y-2">
                      <Label className="text-sm font-medium">{option.label}</Label>
                      
                      {option.type === "text" && (
                        <Input
                          value={toolOptions[option.key] || ""}
                          onChange={(e) => setToolOptions(prev => ({ ...prev, [option.key]: e.target.value }))}
                          placeholder={option.label}
                        />
                      )}

                      {option.type === "number" && (
                        <Input
                          type="number"
                          value={toolOptions[option.key] || ""}
                          onChange={(e) => setToolOptions(prev => ({ ...prev, [option.key]: Number(e.target.value) }))}
                          min={option.min}
                          max={option.max}
                          step={option.step}
                        />
                      )}

                      {option.type === "select" && (
                        <Select
                          value={toolOptions[option.key]?.toString()}
                          onValueChange={(value) => setToolOptions(prev => ({ ...prev, [option.key]: value }))}
                        >
                          <SelectTrigger>
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
                            <span>{toolOptions[option.key] || option.defaultValue}</span>
                            <span>{option.max}</span>
                          </div>
                        </div>
                      )}

                      {option.type === "color" && (
                        <Input
                          type="color"
                          value={toolOptions[option.key] || option.defaultValue}
                          onChange={(e) => setToolOptions(prev => ({ ...prev, [option.key]: e.target.value }))}
                        />
                      )}
                    </div>
                  ))}

                  {/* Examples */}
                  {examples.length > 0 && (
                    <div className="space-y-2 pt-4 border-t">
                      <Label className="text-sm font-medium">Examples</Label>
                      <div className="space-y-1">
                        {examples.map((example, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            size="sm"
                            onClick={() => loadExample(example.content)}
                            className="w-full justify-start h-auto p-2 text-left"
                          >
                            <div className="truncate">
                              <div className="font-medium text-xs">{example.name}</div>
                              <div className="text-xs text-gray-500 truncate">
                                {example.content.substring(0, 30)}...
                              </div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sidebar Ad */}
                  <div className="pt-4 border-t">
                    <AdBanner 
                      adSlot="text-tool-sidebar"
                      adFormat="auto"
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Content */}
          <div className={`${!isMobile && (options.length > 0 || examples.length > 0) ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
            {/* Auto Update Toggle */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={autoUpdate}
                  onCheckedChange={setAutoUpdate}
                />
                <Label className="text-sm">Auto-update output</Label>
              </div>
              
              {!autoUpdate && (
                <Button onClick={processText} size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Process
                </Button>
              )}
            </div>

            {/* Center Ad */}
            <div className="mb-6 lg:mb-8">
              {/* Same ad continues in tool interface */}
            </div>

            {/* Tool Options */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Input</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const input = document.createElement('input')
                          input.type = 'file'
                          input.accept = fileExtensions.join(',')
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0]
                            if (file) {
                              const reader = new FileReader()
                              reader.onload = (e) => {
                                setInput(e.target?.result as string)
                              }
                              reader.readAsText(file)
                            }
                          }
                          input.click()
                        }}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setInput("")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={placeholder}
                    className="min-h-[300px] lg:min-h-[400px] font-mono text-sm"
                  />
                </CardContent>
              </Card>

              {/* Output */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Output</CardTitle>
                    <div className="flex items-center space-x-2">
                      {output && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(output)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadFile(output, `output${getFileExtension()}`)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {error ? (
                    <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      <span className="text-red-700 text-sm">{error}</span>
                    </div>
                  ) : (
                    <Textarea
                      value={output}
                      readOnly
                      placeholder={outputPlaceholder}
                      className="min-h-[300px] lg:min-h-[400px] font-mono text-sm bg-gray-50"
                    />
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Stats */}
            {stats && (
              <Card className="mt-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-teal-600" />
                    <span>Statistics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(stats).map(([key, value]) => (
                      <div key={key} className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-teal-600">{value as string}</div>
                        <div className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Bottom Ad */}
            <div className="mt-8">
              {/* Same ad continues throughout the tool */}
            </div>

            {/* Examples */}
            {examples.length > 0 && !isMobile && (
              <Card className="mt-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Examples</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {examples.map((example, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        onClick={() => loadExample(example.content)}
                        className="h-auto p-4 text-left justify-start"
                      >
                        <div className="w-full">
                          <div className="font-medium mb-1">{example.name}</div>
                          <div className="text-sm text-gray-500 truncate">
                            {example.content.substring(0, 60)}...
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Mobile Sticky Bottom Ad */}
        {isMobile && (
          <div className="mt-8 pb-20">
            {/* Same ad continues in mobile interface */}
          </div>
        )}
      </div>

      <MobileOptionsSidebar />
      <Footer />
    </div>
  )
}