"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Search, Copy, Download, AlertTriangle } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface KeywordData {
  keyword: string
  count: number
  density: number
  positions: number[]
}

export default function KeywordDensityCheckerPage() {
  const [content, setContent] = useState("")
  const [targetKeyword, setTargetKeyword] = useState("")
  const [analysis, setAnalysis] = useState<{
    totalWords: number
    uniqueWords: number
    keywords: KeywordData[]
    readingTime: number
  } | null>(null)

  const analyzeContent = () => {
    if (!content.trim()) {
      toast({
        title: "No content to analyze",
        description: "Please enter some text content",
        variant: "destructive"
      })
      return
    }

    // Clean and process text
    const cleanText = content.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    const words = cleanText.split(' ').filter(word => word.length > 2)
    const totalWords = words.length
    const uniqueWords = new Set(words).size

    // Count keyword frequencies
    const keywordCounts = new Map<string, { count: number; positions: number[] }>()
    
    words.forEach((word, index) => {
      if (!keywordCounts.has(word)) {
        keywordCounts.set(word, { count: 0, positions: [] })
      }
      const data = keywordCounts.get(word)!
      data.count++
      data.positions.push(index)
    })

    // Convert to keyword data and sort by frequency
    const keywords: KeywordData[] = Array.from(keywordCounts.entries())
      .map(([keyword, data]) => ({
        keyword,
        count: data.count,
        density: (data.count / totalWords) * 100,
        positions: data.positions
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20) // Top 20 keywords

    // Calculate reading time (average 200 words per minute)
    const readingTime = Math.ceil(totalWords / 200)

    setAnalysis({
      totalWords,
      uniqueWords,
      keywords,
      readingTime
    })

    toast({
      title: "Analysis complete",
      description: `Analyzed ${totalWords} words and found ${keywords.length} unique keywords`
    })
  }

  const getDensityColor = (density: number) => {
    if (density < 1) return "text-green-600"
    if (density < 3) return "text-yellow-600"
    if (density < 5) return "text-orange-600"
    return "text-red-600"
  }

  const getDensityLabel = (density: number) => {
    if (density < 1) return "Low"
    if (density < 3) return "Optimal"
    if (density < 5) return "High"
    return "Too High"
  }

  const copyAnalysis = () => {
    if (!analysis) return

    const report = `Keyword Density Analysis Report
Generated: ${new Date().toLocaleString()}

CONTENT STATISTICS
==================
Total Words: ${analysis.totalWords}
Unique Words: ${analysis.uniqueWords}
Reading Time: ${analysis.readingTime} minute${analysis.readingTime !== 1 ? 's' : ''}

TOP KEYWORDS
============
${analysis.keywords.map(kw => 
  `${kw.keyword}: ${kw.count} times (${kw.density.toFixed(2)}%)`
).join('\n')}

TARGET KEYWORD ANALYSIS
=======================
${targetKeyword ? `Keyword: ${targetKeyword}
Density: ${analysis.keywords.find(k => k.keyword === targetKeyword.toLowerCase())?.density.toFixed(2) || '0.00'}%
Count: ${analysis.keywords.find(k => k.keyword === targetKeyword.toLowerCase())?.count || 0}` : 'No target keyword specified'}

RECOMMENDATIONS
===============
- Optimal keyword density: 1-3%
- Avoid keyword stuffing (>5% density)
- Focus on natural, readable content
- Use related keywords and synonyms`

    navigator.clipboard.writeText(report)
    toast({
      title: "Copied to clipboard",
      description: "Analysis report copied"
    })
  }

  const downloadAnalysis = () => {
    if (!analysis) return

    const report = `Keyword Density Analysis Report
Generated: ${new Date().toLocaleString()}

CONTENT STATISTICS
==================
Total Words: ${analysis.totalWords}
Unique Words: ${analysis.uniqueWords}
Reading Time: ${analysis.readingTime} minute${analysis.readingTime !== 1 ? 's' : ''}

TOP KEYWORDS
============
${analysis.keywords.map(kw => 
  `${kw.keyword}: ${kw.count} times (${kw.density.toFixed(2)}%)`
).join('\n')}

ORIGINAL CONTENT
================
${content}`

    const blob = new Blob([report], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "keyword-density-analysis.txt"
    link.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Download started",
      description: "Analysis report downloaded"
    })
  }

  const loadExample = () => {
    setContent(`Search engine optimization (SEO) is the practice of increasing the quantity and quality of traffic to your website through organic search engine results. SEO involves optimizing your website content, structure, and technical elements to improve visibility in search engines like Google, Bing, and Yahoo.

Effective SEO strategies include keyword research, content optimization, technical SEO improvements, and link building. By implementing proper SEO techniques, businesses can attract more qualified visitors to their websites and improve their online presence.

Modern SEO focuses on user experience, mobile optimization, page speed, and high-quality content that provides value to users. Search engines continuously update their algorithms to better understand user intent and deliver the most relevant results.`)
    setTargetKeyword("SEO")
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-4">
            <TrendingUp className="h-8 w-8 text-accent" />
            <h1 className="text-3xl font-heading font-bold text-foreground">Keyword Density Checker</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Analyze keyword density and frequency in your content for SEO optimization. Identify overused keywords and improve content balance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Content Input */}
          <Card>
            <CardHeader>
              <CardTitle>Content Analysis</CardTitle>
              <CardDescription>Enter your content for keyword density analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="target-keyword">Target Keyword (Optional)</Label>
                <Input
                  id="target-keyword"
                  value={targetKeyword}
                  onChange={(e) => setTargetKeyword(e.target.value)}
                  placeholder="Enter your target keyword"
                />
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste your article, blog post, or web page content here..."
                  className="min-h-[300px]"
                />
              </div>

              <div className="flex space-x-2">
                <Button onClick={analyzeContent} className="flex-1">
                  <Search className="h-4 w-4 mr-2" />
                  Analyze Content
                </Button>
                <Button onClick={loadExample} variant="outline">
                  Load Example
                </Button>
              </div>

              {analysis && (
                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{analysis.totalWords}</div>
                    <div className="text-sm text-muted-foreground">Total Words</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{analysis.uniqueWords}</div>
                    <div className="text-sm text-muted-foreground">Unique Words</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{analysis.readingTime}m</div>
                    <div className="text-sm text-muted-foreground">Reading Time</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Analysis Results */}
          <Card>
            <CardHeader>
              <CardTitle>Keyword Analysis Results</CardTitle>
              <CardDescription>Keyword frequency and density breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              {analysis ? (
                <div className="space-y-4">
                  {/* Target Keyword Analysis */}
                  {targetKeyword && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">Target Keyword: "{targetKeyword}"</h4>
                      {(() => {
                        const targetData = analysis.keywords.find(k => 
                          k.keyword === targetKeyword.toLowerCase()
                        )
                        if (targetData) {
                          return (
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span>Count:</span>
                                <span className="font-medium">{targetData.count}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Density:</span>
                                <span className={`font-medium ${getDensityColor(targetData.density)}`}>
                                  {targetData.density.toFixed(2)}% ({getDensityLabel(targetData.density)})
                                </span>
                              </div>
                              <Progress value={Math.min(targetData.density * 20, 100)} className="h-2" />
                            </div>
                          )
                        } else {
                          return (
                            <div className="flex items-center space-x-2 text-orange-600">
                              <AlertTriangle className="h-4 w-4" />
                              <span>Target keyword not found in content</span>
                            </div>
                          )
                        }
                      })()}
                    </div>
                  )}

                  {/* Top Keywords */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Top Keywords</h4>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={copyAnalysis}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Report
                        </Button>
                        <Button variant="outline" size="sm" onClick={downloadAnalysis}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {analysis.keywords.map((keyword, index) => (
                        <div key={keyword.keyword} className="flex items-center justify-between p-3 bg-muted rounded border">
                          <div className="flex items-center space-x-3">
                            <Badge variant="outline">{index + 1}</Badge>
                            <div>
                              <div className="font-medium">{keyword.keyword}</div>
                              <div className="text-xs text-muted-foreground">
                                {keyword.count} occurrence{keyword.count !== 1 ? 's' : ''}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-medium ${getDensityColor(keyword.density)}`}>
                              {keyword.density.toFixed(2)}%
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {getDensityLabel(keyword.density)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Search className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Enter content to analyze keyword density</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* SEO Guidelines */}
        <Card className="mt-8 max-w-6xl mx-auto">
          <CardHeader>
            <CardTitle>SEO Keyword Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-medium mb-4">Optimal Keyword Density</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <div>
                      <span className="font-medium">1-3%:</span>
                      <span className="text-muted-foreground ml-2">Optimal range for most keywords</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <div>
                      <span className="font-medium">3-5%:</span>
                      <span className="text-muted-foreground ml-2">High but acceptable for primary keywords</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <div>
                      <span className="font-medium">5%+:</span>
                      <span className="text-muted-foreground ml-2">Risk of keyword stuffing penalty</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-4">Best Practices</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Focus on natural, readable content over exact density</li>
                  <li>• Use related keywords and synonyms throughout content</li>
                  <li>• Place important keywords in titles, headings, and early paragraphs</li>
                  <li>• Avoid keyword stuffing which can harm SEO rankings</li>
                  <li>• Consider user intent and search context</li>
                  <li>• Monitor competitor keyword strategies</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}