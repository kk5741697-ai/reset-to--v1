"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  Copy,
  FileText,
  AlertCircle,
  Settings,
  Code
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { AdBanner } from "@/components/ads/ad-banner"
import { PersistentAdBanner } from "@/components/ads"

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
  processFunction: (input: string, options: any) => { output: string; error?: string; stats?: Record<string, any> }
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
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [toolOptions, setToolOptions] = useState<Record<string, any>>({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")
  const [stats, setStats] = useState<Record<string, any> | null>(null)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const defaultOptions: Record<string, any> = {}
    options.forEach(option => {
      defaultOptions[option.key] = option.defaultValue
    })
    setToolOptions(defaultOptions)
  }, [options])

  useEffect(() => {
    if (inputText.trim()) {
      processText()
    } else {
      setOutputText("")
      setError("")
      setStats(null)
    }
  }, [inputText, toolOptions])

  const processText = () => {
    setIsProcessing(true)
    setError("")
    
    try {
      // Validate input if validator provided
      if (validateFunction) {
        const validation = validateFunction(inputText)
        if (!validation.isValid) {
          setError(validation.error || "Invalid input")
          setOutputText("")
          setStats(null)
          setIsProcessing(false)
          return
        }
      }

      const result = processFunction(inputText, toolOptions)
      
      if (result.error) {
        setError(result.error)
        setOutputText("")
        setStats(null)
      } else {
        setOutputText(result.output)
        setStats(result.stats || null)
        setError("")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Processing failed")
      setOutputText("")
      setStats(null)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFileUpload = async (uploadedFiles: FileList | null) => {
    if (!uploadedFiles || uploadedFiles.length === 0) return

    const file = uploadedFiles[0]
    
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please use a file smaller than 10MB",
        variant: "destructive"
      })
      return
    }

    try {
      const text = await file.text()
      setInputText(text)
      toast({
        title: "File loaded",
        description: `${file.name} loaded successfully`
      })
    } catch (error) {
      toast({
        title: "Error loading file",
        description: `Failed to load ${file.name}`,
        variant: "destructive"
      })
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    handleFileUpload(e.dataTransfer.files)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: `${type} copied successfully`
    })
  }

  const downloadText = (text: string, filename: string) => {
    const blob = new Blob([text], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    toast({
      title: "Download started",
      description: `${filename} downloaded successfully`
    })
  }

  const loadExample = (example: Example) => {
    setInputText(example.content)
  }

  const clearAll = () => {
    setInputText("")
    setOutputText("")
    setError("")
    setStats(null)
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
            {/* Examples */}
            {examples.length > 0 && (
              <div className="space-y-3">
                <Label className="text-sm font-medium">Examples</Label>
                <div className="grid grid-cols-1 gap-2">
                  {examples.map((example, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        loadExample(example)
                        setIsMobileSidebarOpen(false)
                      }}
                      className="text-xs h-auto p-3 flex flex-col items-start"
                    >
                      <span className="font-medium">{example.name}</span>
                      <span className="text-gray-500 truncate w-full text-left">
                        {example.content.substring(0, 40)}...
                      </span>
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
          </div>
        </ScrollArea>
        
        {/* Mobile Footer */}
        <div className="p-4 border-t bg-white space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={() => copyToClipboard(outputText, "Output")}
              disabled={!outputText}
              variant="outline"
              className="py-3"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            
            <Button 
              onClick={() => downloadText(outputText, `processed${fileExtensions[0] || '.txt'}`)}
              disabled={!outputText}
              className="bg-green-600 hover:bg-green-700 text-white py-3"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )

  return (
    <div className="min-h-screen bg-background">
      <Header />

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
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={placeholder}
                className="min-h-[200px] font-mono text-sm"
              />
              <div className="flex items-center justify-between mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File
                </Button>
                <span className="text-xs text-gray-500">
                  {inputText.length} characters
                </span>
              </div>
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
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <span className="text-sm text-red-800">{error}</span>
                  </div>
                </div>
              ) : (
                <Textarea
                  value={outputText}
                  readOnly
                  placeholder={outputPlaceholder}
                  className="min-h-[200px] font-mono text-sm"
                />
              )}
              
              {stats && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Statistics</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs text-blue-800">
                    {Object.entries(stats).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span>{key}:</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mobile Ad */}
          <div className="mt-6">
            <AdBanner 
              adSlot="text-tools-mobile"
              adFormat="auto"
              className="w-full"
              mobileOptimized={true}
            />
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 space-y-3 z-30">
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={() => setIsMobileSidebarOpen(true)}
              variant="outline"
              className="py-3"
            >
              <Settings className="h-4 w-4 mr-2" />
              Options
            </Button>
            
            <Button 
              onClick={() => copyToClipboard(outputText, "Output")}
              disabled={!outputText}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>

          {outputText && (
            <Button 
              onClick={() => downloadText(outputText, `processed${fileExtensions[0] || '.txt'}`)}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Result
            </Button>
          )}
        </div>

        <MobileSidebar />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 mb-4">
              <Icon className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-heading font-bold text-foreground">{title}</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {description}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Input Section */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Input</CardTitle>
                      <CardDescription>Enter or paste your text content</CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                      <Button variant="outline" size="sm" onClick={clearAll}>
                        Clear
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-4"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                  >
                    <Textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder={placeholder}
                      className="min-h-[400px] font-mono text-sm border-none resize-none focus:ring-0"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{inputText.length} characters</span>
                    <span>{inputText.split('\n').length} lines</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Output Section */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Output</CardTitle>
                      <CardDescription>Processed result</CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(outputText, "Output")}
                        disabled={!outputText}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadText(outputText, `processed${fileExtensions[0] || '.txt'}`)}
                        disabled={!outputText}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {error ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 min-h-[400px] flex items-center justify-center">
                      <div className="text-center">
                        <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-red-800 mb-2">Processing Error</h3>
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  ) : (
                    <Textarea
                      value={outputText}
                      readOnly
                      placeholder={outputPlaceholder}
                      className="min-h-[400px] font-mono text-sm"
                    />
                  )}
                  
                  {stats && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="text-sm font-medium text-blue-900 mb-3">Processing Statistics</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm text-blue-800">
                        {Object.entries(stats).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span>{key}:</span>
                            <span className="font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Examples and Options */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {/* Examples */}
            {examples.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Examples</CardTitle>
                  <CardDescription>Try these sample inputs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {examples.map((example, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        onClick={() => loadExample(example)}
                        className="w-full h-auto p-4 text-left justify-start"
                      >
                        <div>
                          <div className="font-medium">{example.name}</div>
                          <div className="text-xs text-gray-500 mt-1 truncate">
                            {example.content.substring(0, 60)}...
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Options */}
            {options.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Options</CardTitle>
                  <CardDescription>Customize processing settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
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
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Footer />

      <input
        ref={fileInputRef}
        type="file"
        accept={fileExtensions.join(",")}
        onChange={(e) => handleFileUpload(e.target.files)}
        className="hidden"
      />
    </div>
  )
}