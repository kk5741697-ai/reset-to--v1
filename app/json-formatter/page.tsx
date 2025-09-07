"use client"

import { TextToolLayout } from "@/components/text-tool-layout"
import { Braces, Code, CheckCircle, Archive, ArrowUpDown } from "lucide-react"
import { TextProcessor } from "@/lib/processors/text-processor"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AdBanner } from "@/components/ads/ad-banner"

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
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Rich Content Section for AdSense Approval */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 mb-4">
              <Braces className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl lg:text-4xl font-heading font-bold text-foreground">
                Professional JSON Formatter & Validator
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Format, validate, and beautify JSON data with our advanced JSON processor. Perfect for developers, 
              API testing, data analysis, and configuration management. Our tool provides syntax highlighting, 
              error detection, and multiple formatting options to make your JSON data readable and professional.
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
                  Transform minified JSON into readable, properly indented format with customizable spacing.
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Validate Syntax</h3>
                <p className="text-sm text-gray-600">
                  Detect and highlight JSON syntax errors with detailed error messages and line numbers.
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Archive className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Minify & Compress</h3>
                <p className="text-sm text-gray-600">
                  Remove whitespace and compress JSON for production use and API optimization.
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <ArrowUpDown className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Sort Keys</h3>
                <p className="text-sm text-gray-600">
                  Alphabetically sort object keys for consistent formatting and easier comparison.
                </p>
              </div>
            </div>
            
            {/* Content Area Ad */}
            <div className="mb-8">
              <AdBanner 
                adSlot="json-formatter-content"
                adFormat="auto"
                className="max-w-3xl mx-auto"
                mobileOptimized={true}
              />
            </div>
          </div>
        </div>
      </div>

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
      
      {/* Additional Educational Content */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">JSON Best Practices & Common Use Cases</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Development Workflows</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>API response formatting and debugging</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Configuration file management and validation</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Database schema design and documentation</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Data transformation and migration scripts</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Analysis</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Log file analysis and error tracking</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Analytics data processing and reporting</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Import/export data between different systems</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Testing and quality assurance workflows</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}