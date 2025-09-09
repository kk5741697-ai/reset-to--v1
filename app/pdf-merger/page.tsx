"use client"

import { PDFToolsLayout } from "@/components/pdf-tools-layout"
import { FileType } from "lucide-react"
import { PDFProcessor } from "@/lib/processors/pdf-processor"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PersistentAdBanner } from "@/components/ads"

const mergeOptions = [
  {
    key: "addBookmarks",
    label: "Add Bookmarks",
    type: "checkbox" as const,
    defaultValue: true,
    section: "Options",
  },
  {
    key: "preserveMetadata",
    label: "Preserve Metadata",
    type: "checkbox" as const,
    defaultValue: true,
    section: "Options",
  },
  {
    key: "mergeMode",
    label: "Merge Mode",
    type: "select" as const,
    defaultValue: "sequential",
    selectOptions: [
      { value: "sequential", label: "Sequential Order" },
      { value: "interleave", label: "Interleave Pages" },
      { value: "custom", label: "Custom Order" },
    ],
    section: "Merge Settings",
  },
]

async function mergePDFs(files: any[], options: any) {
  try {
    if (files.length < 2) {
      return {
        success: false,
        error: "At least 2 PDF files are required for merging",
      }
    }

    const fileObjects = files.map((f: any) => f.originalFile || f.file)
    const mergedPdfBytes = await PDFProcessor.mergePDFs(fileObjects, {
      addBookmarks: options.addBookmarks,
      preserveMetadata: options.preserveMetadata
    })

    // Create proper blob and download URL
    const blob = new Blob([mergedPdfBytes], { type: "application/pdf" })
    const downloadUrl = URL.createObjectURL(blob)

    return {
      success: true,
      downloadUrl,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to merge PDFs",
    }
  }
}

export default function PDFMergerPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Rich Content Section for AdSense Approval */}
      <div className="bg-gradient-to-br from-red-50 via-white to-orange-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 mb-4">
              <FileType className="h-8 w-8 text-red-600" />
              <h1 className="text-3xl lg:text-4xl font-heading font-bold text-foreground">
                Professional PDF Merger & Document Consolidation Tool
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Combine multiple PDF documents into a single, organized file with our advanced PDF merging technology. 
              Perfect for business reports, academic research, legal documentation, and project management. Our tool 
              preserves document quality, maintains bookmarks, handles password-protected files, and supports custom 
              page ordering for professional document workflows. Trusted by law firms, corporations, educational 
              institutions, and government agencies for secure document consolidation.
            </p>
          {/* Educational Content for AdSense */}
          <div className="max-w-5xl mx-auto mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <FileType className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Document Integrity</h3>
                <p className="text-sm text-gray-600">
                  Preserve original formatting, fonts, images, and metadata while combining documents. 
                  Maintains professional quality for business and legal applications.
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="h-6 w-6 text-green-600 font-bold text-lg">📑</div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Bookmark Management</h3>
                <p className="text-sm text-gray-600">
                  Automatically generate bookmarks for each merged document section. Perfect for creating 
                  navigable reports, manuals, and multi-section documents.
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="h-6 w-6 text-purple-600 font-bold">🔒</div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Security & Privacy</h3>
                <p className="text-sm text-gray-600">
                  All PDF processing happens locally in your browser. No uploads to servers, ensuring 
                  complete confidentiality for sensitive business and legal documents.
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="h-6 w-6 text-orange-600 font-bold">⚡</div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Batch Processing</h3>
                <p className="text-sm text-gray-600">
                  Merge up to 10 PDF files simultaneously with custom ordering and organization. 
                  Streamline document workflows for maximum productivity.
                </p>
              </div>
            </div>
            
            {/* Persistent Ad - Same instance across upload and tool interface */}
            <div className="mb-8">
              <PersistentAdBanner 
                adSlot="pdf-merger-main"
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
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Enterprise PDF Merging Applications & Compliance Standards</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Legal & Compliance Documentation</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Contract compilation and legal brief assembly with exhibit organization and cross-referencing</li>
                  <li>• Regulatory compliance reporting with multi-department document consolidation and audit trails</li>
                  <li>• Court filing preparation with proper document sequencing and bookmark navigation for judges</li>
                  <li>• Due diligence document packages for mergers, acquisitions, and investment transactions</li>
                  <li>• Patent application assembly with technical drawings, specifications, and supporting documentation</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Business & Financial Operations</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Annual report compilation with financial statements, management discussion, and shareholder information</li>
                  <li>• Proposal development combining technical specifications, pricing, and company credentials</li>
                  <li>• Employee handbook creation with policies, procedures, and benefits information consolidation</li>
                  <li>• Board meeting packages with agendas, financial reports, and strategic planning documents</li>
                  <li>• Audit documentation assembly for internal controls, financial reviews, and compliance assessments</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic & Research Applications</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Dissertation and thesis compilation with chapters, appendices, and research data integration</li>
                  <li>• Grant application assembly with project descriptions, budgets, and institutional documentation</li>
                  <li>• Conference proceedings compilation with abstracts, papers, and presentation materials</li>
                  <li>• Research report consolidation with methodology, results, and supplementary data analysis</li>
                  <li>• Academic portfolio development with publications, presentations, and professional achievements</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
          </div>
      <PDFToolsLayout
        title="Merge PDF"
        description="Combine multiple PDF files into one document with custom page ordering and bookmark preservation. Perfect for merging reports, presentations, and documents."
        icon={FileType}
        toolType="merge"
        processFunction={mergePDFs}
        options={mergeOptions}
        maxFiles={10}
        allowPageReorder={true}
      />
      
      {/* Technical Standards Section */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">PDF Standards & Technical Compliance</h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Our PDF merger adheres to ISO 32000 standards and maintains compatibility with Adobe Acrobat, 
              PDF/A archival formats, and enterprise document management systems. Support for encrypted PDFs, 
              digital signatures, and metadata preservation ensures professional-grade document handling.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 mb-2">ISO 32000</div>
                <p className="text-sm text-gray-600">Standards Compliant</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">10x</div>
                <p className="text-sm text-gray-600">Batch Merging</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-2">500MB+</div>
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
  )
}