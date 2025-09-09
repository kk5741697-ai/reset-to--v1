"use client"

import { useState } from "react"
import { TextToolLayout } from "@/components/text-tool-layout"
import { Braces } from "lucide-react"
import { TextProcessor } from "@/lib/processors/text-processor"
import { ToolContentSections } from "@/components/content/tool-content-sections"
import { PersistentAdManager } from "@/components/ads/persistent-ad-manager"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Code, Zap, Shield, Globe } from "lucide-react"

const jsonExamples = [
  {
    name: "Simple Object",
    content: `{"name":"John Doe","age":30,"city":"New York","active":true}`,
  },
  {
    name: "Nested Structure",
    content: `{"user":{"id":123,"profile":{"name":"Jane Smith","email":"jane@example.com","preferences":{"theme":"dark","notifications":true}},"posts":[{"id":1,"title":"Hello World","published":true},{"id":2,"title":"Getting Started","published":false}]}}`,
  },
  {
    name: "Array Data",
    content: `[{"id":1,"product":"Laptop","price":999.99,"inStock":true,"tags":["electronics","computers"]},{"id":2,"product":"Mouse","price":29.99,"inStock":false,"tags":["electronics","accessories"]}]`,
  },
]

const jsonOptions = [
  {
    key: "indent",
    label: "Indentation",
    type: "select" as const,
    defaultValue: 2,
    selectOptions: [
      { value: 2, label: "2 Spaces" },
      { value: 4, label: "4 Spaces" },
      { value: "tab", label: "Tabs" },
    ],
  },
  {
    key: "minify",
    label: "Minify JSON",
    type: "checkbox" as const,
    defaultValue: false,
  },
  {
    key: "sortKeys",
    label: "Sort Keys",
    type: "checkbox" as const,
    defaultValue: false,
  },
  {
    key: "validateOnly",
    label: "Validate Only",
    type: "checkbox" as const,
    defaultValue: false,
  },
]

function processJSON(input: string, options: any = {}) {
  return TextProcessor.processJSON(input, options)
}

function validateJSON(input: string) {
  if (!input.trim()) {
    return { isValid: false, error: "Input cannot be empty" }
  }
  
  try {
    JSON.parse(input)
    return { isValid: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Invalid JSON format"
    // Extract line number from error if available
    const lineMatch = errorMessage.match(/line (\d+)/i)
    const positionMatch = errorMessage.match(/position (\d+)/i)
    
    let enhancedError = errorMessage
    if (lineMatch) {
      enhancedError = `Line ${lineMatch[1]}: ${errorMessage}`
    } else if (positionMatch) {
      enhancedError = `Position ${positionMatch[1]}: ${errorMessage}`
    }
    
    return { 
      isValid: false, 
      error: enhancedError
    }
  }
}

export default function JSONFormatterPage() {
  const [showToolInterface, setShowToolInterface] = useState(false)

  // Show content-rich interface for tools without upload
  if (!showToolInterface) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Before Tool Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 mb-4">
              <Braces className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-heading font-bold text-foreground">JSON Formatter & Validator</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Professional JSON formatting, validation, and beautification tool. Perfect for developers, 
              API testing, data analysis, and configuration management. Format, validate, and optimize 
              JSON data with advanced features and error detection.
            </p>
          </div>

          {/* Before Tool Ad */}
          <PersistentAdManager 
            toolName="json-formatter"
            adSlot="before-tool-banner"
            position="before-upload"
            className="max-w-4xl mx-auto mb-8"
          />

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card>
              <CardHeader className="text-center pb-4">
                <Code className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Format & Beautify</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-600">
                  Transform minified JSON into readable, properly indented format with syntax highlighting
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center pb-4">
                <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Validate & Debug</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-600">
                  Detect syntax errors, validate structure, and get detailed error messages with line numbers
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center pb-4">
                <Zap className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Minify & Optimize</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-600">
                  Compress JSON for production use while maintaining data integrity and structure
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center pb-4">
                <Globe className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Sort & Organize</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-600">
                  Automatically sort object keys alphabetically for consistent data organization
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Start Tool Button */}
          <div className="text-center mb-12">
            <button
              onClick={() => setShowToolInterface(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-lg font-semibold"
            >
              <Braces className="h-5 w-5 mr-2 inline" />
              Start JSON Formatting
            </button>
          </div>

          {/* After Tool Ad */}
          <PersistentAdManager 
            toolName="json-formatter"
            adSlot="after-tool-banner"
            position="after-upload"
            className="max-w-4xl mx-auto mb-8"
          />
        </div>

        {/* Comprehensive Content */}
        <ToolContentSections 
          toolName="JSON Formatter" 
          toolCategory="CODE" 
          position="after-upload" 
        />

        <Footer />
      </div>
    )
  }

  // Show the actual tool interface
  return (
    <TextToolLayout
      title="JSON Formatter"
      description="Beautify, validate, and minify JSON data with syntax highlighting and error detection."
      icon={Braces}
      placeholder="Paste your JSON here..."
      outputPlaceholder="Formatted JSON will appear here..."
      processFunction={processJSON}
      validateFunction={validateJSON}
      options={jsonOptions}
      examples={jsonExamples}
      fileExtensions={[".json"]}
    />
  )
}