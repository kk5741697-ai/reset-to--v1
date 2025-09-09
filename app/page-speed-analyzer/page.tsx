"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Zap, 
  Globe, 
  Smartphone, 
  Monitor, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Download,
  RefreshCw
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface PerformanceMetrics {
  score: number
  fcp: number // First Contentful Paint
  lcp: number // Largest Contentful Paint
  cls: number // Cumulative Layout Shift
  fid: number // First Input Delay
  ttfb: number // Time to First Byte
  speedIndex: number
}

interface Recommendation {
  type: "critical" | "warning" | "info"
  title: string
  description: string
  impact: "high" | "medium" | "low"
  savings: string
}

export default function PageSpeedAnalyzerPage() {
  const [url, setUrl] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [mobileMetrics, setMobileMetrics] = useState<PerformanceMetrics | null>(null)
  const [desktopMetrics, setDesktopMetrics] = useState<PerformanceMetrics | null>(null)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])

  const analyzePageSpeed = async () => {
    if (!url.trim()) {
      toast({
        title: "URL required",
        description: "Please enter a website URL to analyze",
        variant: "destructive"
      })
      return
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL starting with http:// or https://",
        variant: "destructive"
      })
      return
    }

    setIsAnalyzing(true)
    setProgress(0)

    try {
      // Simulate analysis progress
      const steps = [
        { progress: 10, message: "Connecting to website" },
        { progress: 25, message: "Analyzing mobile performance" },
        { progress: 50, message: "Analyzing desktop performance" },
        { progress: 75, message: "Generating recommendations" },
        { progress: 90, message: "Calculating scores" },
        { progress: 100, message: "Analysis complete" }
      ]

      for (const step of steps) {
        setProgress(step.progress)
        await new Promise(resolve => setTimeout(resolve, 800))
      }

      // Generate mock metrics (in real app, this would call PageSpeed Insights API)
      const generateMetrics = (): PerformanceMetrics => ({
        score: Math.floor(Math.random() * 40) + 60, // 60-100
        fcp: Math.random() * 2 + 1, // 1-3 seconds
        lcp: Math.random() * 3 + 2, // 2-5 seconds
        cls: Math.random() * 0.2, // 0-0.2
        fid: Math.random() * 200 + 50, // 50-250ms
        ttfb: Math.random() * 800 + 200, // 200-1000ms
        speedIndex: Math.random() * 4 + 2 // 2-6 seconds
      })

      setMobileMetrics(generateMetrics())
      setDesktopMetrics(generateMetrics())

      // Generate recommendations
      const mockRecommendations: Recommendation[] = [
        {
          type: "critical",
          title: "Optimize Images",
          description: "Compress and resize images to reduce file sizes. Consider using modern formats like WebP.",
          impact: "high",
          savings: "2.3s"
        },
        {
          type: "warning", 
          title: "Minify CSS and JavaScript",
          description: "Remove unnecessary characters from CSS and JavaScript files to reduce file sizes.",
          impact: "medium",
          savings: "0.8s"
        },
        {
          type: "warning",
          title: "Enable Text Compression",
          description: "Use gzip or brotli compression to reduce the size of text-based resources.",
          impact: "medium",
          savings: "1.2s"
        },
        {
          type: "info",
          title: "Leverage Browser Caching",
          description: "Set appropriate cache headers for static resources to improve repeat visit performance.",
          impact: "low",
          savings: "0.5s"
        }
      ]

      setRecommendations(mockRecommendations)

      toast({
        title: "Analysis complete",
        description: "Page speed analysis finished successfully"
      })
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Failed to analyze page speed. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsAnalyzing(false)
      setProgress(0)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 50) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Good"
    if (score >= 50) return "Needs Improvement"
    return "Poor"
  }

  const getMetricColor = (metric: string, value: number) => {
    switch (metric) {
      case "fcp":
      case "lcp":
        return value <= 2.5 ? "text-green-600" : value <= 4 ? "text-yellow-600" : "text-red-600"
      case "cls":
        return value <= 0.1 ? "text-green-600" : value <= 0.25 ? "text-yellow-600" : "text-red-600"
      case "fid":
        return value <= 100 ? "text-green-600" : value <= 300 ? "text-yellow-600" : "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const formatMetric = (metric: string, value: number) => {
    switch (metric) {
      case "fcp":
      case "lcp":
      case "speedIndex":
        return `${value.toFixed(1)}s`
      case "cls":
        return value.toFixed(3)
      case "fid":
      case "ttfb":
        return `${Math.round(value)}ms`
      default:
        return value.toString()
    }
  }

  const MetricsCard = ({ title, metrics, icon: Icon }: { title: string; metrics: PerformanceMetrics; icon: any }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Icon className="h-5 w-5" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className={`text-4xl font-bold ${getScoreColor(metrics.score)}`}>
            {metrics.score}
          </div>
          <div className="text-sm text-muted-foreground">
            Performance Score ({getScoreLabel(metrics.score)})
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm">First Contentful Paint</span>
            <span className={`text-sm font-medium ${getMetricColor("fcp", metrics.fcp)}`}>
              {formatMetric("fcp", metrics.fcp)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Largest Contentful Paint</span>
            <span className={`text-sm font-medium ${getMetricColor("lcp", metrics.lcp)}`}>
              {formatMetric("lcp", metrics.lcp)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Cumulative Layout Shift</span>
            <span className={`text-sm font-medium ${getMetricColor("cls", metrics.cls)}`}>
              {formatMetric("cls", metrics.cls)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">First Input Delay</span>
            <span className={`text-sm font-medium ${getMetricColor("fid", metrics.fid)}`}>
              {formatMetric("fid", metrics.fid)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Time to First Byte</span>
            <span className="text-sm font-medium text-gray-600">
              {formatMetric("ttfb", metrics.ttfb)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Speed Index</span>
            <span className="text-sm font-medium text-gray-600">
              {formatMetric("speedIndex", metrics.speedIndex)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-4">
            <Zap className="h-8 w-8 text-accent" />
            <h1 className="text-3xl font-heading font-bold text-foreground">Page Speed Analyzer</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Analyze website performance and get recommendations for speed optimization. Test both mobile and desktop performance.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* URL Input */}
          <Card>
            <CardHeader>
              <CardTitle>Website Analysis</CardTitle>
              <CardDescription>Enter a website URL to analyze performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="website-url">Website URL</Label>
                <Input
                  id="website-url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  type="url"
                />
              </div>

              <Button 
                onClick={analyzePageSpeed}
                disabled={isAnalyzing}
                className="w-full"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Analyze Page Speed
                  </>
                )}
              </Button>

              {isAnalyzing && (
                <div className="space-y-2">
                  <Progress value={progress} />
                  <p className="text-sm text-center text-muted-foreground">
                    {progress}% complete
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results */}
          {(mobileMetrics || desktopMetrics) && (
            <Tabs defaultValue="mobile" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="mobile">
                  <Smartphone className="h-4 w-4 mr-2" />
                  Mobile
                </TabsTrigger>
                <TabsTrigger value="desktop">
                  <Monitor className="h-4 w-4 mr-2" />
                  Desktop
                </TabsTrigger>
              </TabsList>

              <TabsContent value="mobile" className="space-y-6">
                {mobileMetrics && (
                  <MetricsCard title="Mobile Performance" metrics={mobileMetrics} icon={Smartphone} />
                )}
              </TabsContent>

              <TabsContent value="desktop" className="space-y-6">
                {desktopMetrics && (
                  <MetricsCard title="Desktop Performance" metrics={desktopMetrics} icon={Monitor} />
                )}
              </TabsContent>
            </Tabs>
          )}

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Optimization Recommendations</CardTitle>
                <CardDescription>Actionable suggestions to improve page speed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendations.map((rec, index) => {
                    const Icon = rec.type === "critical" ? AlertTriangle : 
                               rec.type === "warning" ? Clock : CheckCircle
                    const iconColor = rec.type === "critical" ? "text-red-600" :
                                    rec.type === "warning" ? "text-yellow-600" : "text-blue-600"
                    
                    return (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <Icon className={`h-5 w-5 mt-0.5 ${iconColor}`} />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{rec.title}</h4>
                              <div className="flex items-center space-x-2">
                                <Badge variant={rec.impact === "high" ? "destructive" : rec.impact === "medium" ? "default" : "secondary"}>
                                  {rec.impact} impact
                                </Badge>
                                <Badge variant="outline" className="text-green-600">
                                  Save {rec.savings}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{rec.description}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Performance Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle>Core Web Vitals Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium mb-3 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Loading Performance
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>First Contentful Paint (FCP):</strong>
                      <div className="text-muted-foreground">Good: ≤ 1.8s, Needs Improvement: ≤ 3s</div>
                    </div>
                    <div>
                      <strong>Largest Contentful Paint (LCP):</strong>
                      <div className="text-muted-foreground">Good: ≤ 2.5s, Needs Improvement: ≤ 4s</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3 flex items-center">
                    <Zap className="h-4 w-4 mr-2" />
                    Interactivity
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>First Input Delay (FID):</strong>
                      <div className="text-muted-foreground">Good: ≤ 100ms, Needs Improvement: ≤ 300ms</div>
                    </div>
                    <div>
                      <strong>Interaction to Next Paint (INP):</strong>
                      <div className="text-muted-foreground">Good: ≤ 200ms, Needs Improvement: ≤ 500ms</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3 flex items-center">
                    <Globe className="h-4 w-4 mr-2" />
                    Visual Stability
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Cumulative Layout Shift (CLS):</strong>
                      <div className="text-muted-foreground">Good: ≤ 0.1, Needs Improvement: ≤ 0.25</div>
                    </div>
                    <div>
                      <strong>Speed Index:</strong>
                      <div className="text-muted-foreground">Good: ≤ 3.4s, Needs Improvement: ≤ 5.8s</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}