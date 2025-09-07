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
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { QRProcessor } from "@/lib/qr-processor"
import { QrCode, Download, Copy, Upload, Palette, Settings, RefreshCw, Eye, Wifi, User, Mail, Phone, MessageSquare, Globe } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { PersistentAdBanner } from "@/components/ads/persistent-ad-manager"

export default function QRCodeGeneratorPage() {
  const [content, setContent] = useState("https://pixoratools.com")
  const [qrType, setQrType] = useState("url")
  const [size, setSize] = useState([1000])
  const [margin, setMargin] = useState([4])
  const [errorCorrection, setErrorCorrection] = useState("M")
  const [darkColor, setDarkColor] = useState("#000000")
  const [lightColor, setLightColor] = useState("#ffffff")
  const [qrDataUrl, setQrDataUrl] = useState("")
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState("")
  const [showUploadArea, setShowUploadArea] = useState(true)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  // QR Type specific fields
  const [wifiData, setWifiData] = useState({
    ssid: "",
    password: "",
    security: "WPA",
    hidden: false
  })

  const [contactData, setContactData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    organization: "",
    url: ""
  })

  useEffect(() => {
    generateQR()
  }, [content, qrType, size, margin, errorCorrection, darkColor, lightColor, wifiData, contactData])

  useEffect(() => {
    if (qrDataUrl) {
      setShowUploadArea(false)
    }
  }, [qrDataUrl])

  const generateQR = async () => {
    try {
      let qrContent = content

      switch (qrType) {
        case "wifi":
          if (wifiData.ssid) {
            qrContent = QRProcessor.generateWiFiQR(
              wifiData.ssid,
              wifiData.password,
              wifiData.security as any,
              wifiData.hidden
            )
          } else {
            setQrDataUrl("")
            return
          }
          break
        case "contact":
          if (contactData.firstName || contactData.lastName || contactData.email) {
            qrContent = QRProcessor.generateVCardQR(contactData)
          } else {
            setQrDataUrl("")
            return
          }
          break
        case "email":
          if (content.includes("@")) {
            qrContent = `mailto:${content}`
          }
          break
        case "phone":
          qrContent = `tel:${content}`
          break
        case "sms":
          qrContent = `sms:${content}`
          break
      }

      if (!qrContent.trim()) {
        setQrDataUrl("")
        return
      }

      const qrDataURL = await QRProcessor.generateQRCode(qrContent, {
        width: size[0],
        margin: margin[0],
        errorCorrectionLevel: errorCorrection as any,
        color: {
          dark: darkColor,
          light: lightColor
        }
      })
      
      setQrDataUrl(qrDataURL)
    } catch (error) {
      console.error("QR generation failed:", error)
      setQrDataUrl("")
    }
  }

  const downloadQR = (format: string) => {
    if (!qrDataUrl) return

    const link = document.createElement("a")
    link.download = `qr-code.${format}`
    link.href = qrDataUrl
    link.click()

    toast({
      title: "Download started",
      description: `QR code downloaded as ${format.toUpperCase()}`
    })
  }

  const copyQRData = () => {
    navigator.clipboard.writeText(content)
    toast({
      title: "Copied to clipboard",
      description: "QR code content copied"
    })
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setLogoPreview(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const resetTool = () => {
    setContent("https://pixoratools.com")
    setQrType("url")
    setQrDataUrl("")
    setShowUploadArea(true)
    setIsMobileSidebarOpen(false)
  }

  const getQRTypeIcon = (type: string) => {
    switch (type) {
      case "wifi": return Wifi
      case "contact": return User
      case "email": return Mail
      case "phone": return Phone
      case "sms": return MessageSquare
      case "url": return Globe
      default: return QrCode
    }
  }

  const renderTypeSpecificFields = () => {
    switch (qrType) {
      case "wifi":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="wifi-ssid">Network Name (SSID)</Label>
              <Input
                id="wifi-ssid"
                value={wifiData.ssid}
                onChange={(e) => setWifiData(prev => ({ ...prev, ssid: e.target.value }))}
                placeholder="MyWiFiNetwork"
              />
            </div>
            <div>
              <Label htmlFor="wifi-password">Password</Label>
              <Input
                id="wifi-password"
                type="password"
                value={wifiData.password}
                onChange={(e) => setWifiData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="WiFi password"
              />
            </div>
            <div>
              <Label htmlFor="wifi-security">Security Type</Label>
              <Select value={wifiData.security} onValueChange={(value) => setWifiData(prev => ({ ...prev, security: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WPA">WPA/WPA2</SelectItem>
                  <SelectItem value="WEP">WEP</SelectItem>
                  <SelectItem value="nopass">No Password</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={wifiData.hidden}
                onCheckedChange={(checked) => setWifiData(prev => ({ ...prev, hidden: !!checked }))}
              />
              <Label>Hidden Network</Label>
            </div>
          </div>
        )

      case "contact":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact-first">First Name</Label>
                <Input
                  id="contact-first"
                  value={contactData.firstName}
                  onChange={(e) => setContactData(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="John"
                />
              </div>
              <div>
                <Label htmlFor="contact-last">Last Name</Label>
                <Input
                  id="contact-last"
                  value={contactData.lastName}
                  onChange={(e) => setContactData(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Doe"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="contact-phone">Phone</Label>
              <Input
                id="contact-phone"
                value={contactData.phone}
                onChange={(e) => setContactData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+1234567890"
              />
            </div>
            <div>
              <Label htmlFor="contact-email">Email</Label>
              <Input
                id="contact-email"
                type="email"
                value={contactData.email}
                onChange={(e) => setContactData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="john@example.com"
              />
            </div>
            <div>
              <Label htmlFor="contact-org">Organization</Label>
              <Input
                id="contact-org"
                value={contactData.organization}
                onChange={(e) => setContactData(prev => ({ ...prev, organization: e.target.value }))}
                placeholder="Company Name"
              />
            </div>
          </div>
        )

      default:
        return (
          <div>
            <Label htmlFor="qr-content">Content</Label>
            <Textarea
              id="qr-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your content here..."
              rows={4}
            />
          </div>
        )
    }
  }

  // Mobile Sidebar Component
  const MobileSidebar = () => (
    <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
      <SheetContent side="bottom" className="h-[80vh] p-0">
        <SheetHeader className="px-6 py-4 border-b bg-gray-50">
          <SheetTitle className="flex items-center space-x-2">
            <QrCode className="h-5 w-5 text-green-600" />
            <span>QR Code Settings</span>
          </SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="h-full">
          <div className="p-6 space-y-6">
            {/* QR Type Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">QR Code Type</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "url", label: "URL", icon: Globe },
                  { value: "text", label: "Text", icon: QrCode },
                  { value: "wifi", label: "WiFi", icon: Wifi },
                  { value: "contact", label: "Contact", icon: User },
                  { value: "email", label: "Email", icon: Mail },
                  { value: "phone", label: "Phone", icon: Phone }
                ].map((type) => {
                  const Icon = type.icon
                  return (
                    <Button
                      key={type.value}
                      variant={qrType === type.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setQrType(type.value)}
                      className="h-auto p-3 flex flex-col items-center"
                    >
                      <Icon className="h-4 w-4 mb-1" />
                      <span className="text-xs">{type.label}</span>
                    </Button>
                  )
                })}
              </div>
            </div>

            {/* Content Fields */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-px bg-gray-200 flex-1"></div>
                <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Content</Label>
                <div className="h-px bg-gray-200 flex-1"></div>
              </div>
              {renderTypeSpecificFields()}
            </div>

            {/* Customization */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-px bg-gray-200 flex-1"></div>
                <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Customization</Label>
                <div className="h-px bg-gray-200 flex-1"></div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Size: {size[0]}px</Label>
                <Slider
                  value={size}
                  onValueChange={setSize}
                  min={200}
                  max={2000}
                  step={50}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Margin: {margin[0]}</Label>
                <Slider
                  value={margin}
                  onValueChange={setMargin}
                  min={0}
                  max={10}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="error-correction">Error Correction</Label>
                <Select value={errorCorrection} onValueChange={setErrorCorrection}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L">Low (7%)</SelectItem>
                    <SelectItem value="M">Medium (15%)</SelectItem>
                    <SelectItem value="Q">Quartile (25%)</SelectItem>
                    <SelectItem value="H">High (30%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dark-color">Dark Color</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <input
                      type="color"
                      value={darkColor}
                      onChange={(e) => setDarkColor(e.target.value)}
                      className="w-8 h-8 border rounded cursor-pointer"
                    />
                    <Input
                      value={darkColor}
                      onChange={(e) => setDarkColor(e.target.value)}
                      className="flex-1 font-mono text-xs"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="light-color">Light Color</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <input
                      type="color"
                      value={lightColor}
                      onChange={(e) => setLightColor(e.target.value)}
                      className="w-8 h-8 border rounded cursor-pointer"
                    />
                    <Input
                      value={lightColor}
                      onChange={(e) => setLightColor(e.target.value)}
                      className="flex-1 font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t bg-white space-y-3">
          <Button 
            onClick={() => {
              generateQR()
              setIsMobileSidebarOpen(false)
            }}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-base font-semibold"
            size="lg"
          >
            <QrCode className="h-4 w-4 mr-2" />
            Generate QR Code
          </Button>

          {qrDataUrl && (
            <Button 
              onClick={() => {
                downloadQR("png")
                setIsMobileSidebarOpen(false)
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base font-semibold"
              size="lg"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PNG
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )

  // Show upload area initially
  if (showUploadArea && !qrDataUrl) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-2 lg:py-3">
            <PersistentAdBanner 
              adSlot="tool-header-banner"
              adFormat="auto"
              className="max-w-4xl mx-auto"
              persistAcrossPages={true}
            />
          </div>
        </div>

        {/* Rich Content Section for AdSense */}
        <div className="bg-gradient-to-br from-green-50 via-white to-blue-50 py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 mb-4">
                <QrCode className="h-8 w-8 text-green-600" />
                <h1 className="text-3xl lg:text-4xl font-heading font-bold text-foreground">
                  Professional QR Code Generator
                </h1>
              </div>
              <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                Create custom QR codes with advanced styling options, logo integration, and multiple data formats. 
                Perfect for marketing campaigns, business cards, event management, and digital connectivity solutions. 
                Our generator supports WiFi credentials, contact information, URLs, and custom content with professional styling.
              </p>
            </div>

            {/* Educational Content */}
            <div className="max-w-5xl mx-auto mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <QrCode className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Custom Styling</h3>
                  <p className="text-sm text-gray-600">
                    Customize colors, add logos, and apply different styles to match your brand identity.
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Settings className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Multiple Formats</h3>
                  <p className="text-sm text-gray-600">
                    Support for URLs, WiFi, contacts, emails, phone numbers, and custom text content.
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Download className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">High Quality Output</h3>
                  <p className="text-sm text-gray-600">
                    Generate high-resolution QR codes in PNG, SVG, and PDF formats for any use case.
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <Palette className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Brand Integration</h3>
                  <p className="text-sm text-gray-600">
                    Add your logo and customize colors to create branded QR codes for marketing materials.
                  </p>
                </div>
              </div>
              
              {/* Content Area Ad */}
              <div className="mb-8">
                <PersistentAdBanner 
                  adSlot="qr-generator-content"
                  adFormat="auto"
                  className="max-w-3xl mx-auto"
                  mobileOptimized={true}
                  persistAcrossPages={true}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6 lg:py-8">
          <div className="text-center mb-6 lg:mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Create Your QR Code</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose your QR code type and customize the content to generate a professional QR code.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:border-green-400 hover:bg-green-50/30 transition-all duration-300 p-8 lg:p-16 group">
              <div className="relative mb-4 lg:mb-6">
                <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
                <QrCode className="relative h-16 w-16 lg:h-20 lg:w-20 text-green-500 group-hover:text-green-600 transition-colors group-hover:scale-110 transform duration-300" />
              </div>
              <h3 className="text-xl lg:text-2xl font-semibold mb-2 lg:mb-3 text-gray-700 group-hover:text-green-600 transition-colors">Start Creating QR Code</h3>
              <p className="text-gray-500 mb-4 lg:mb-6 text-base lg:text-lg text-center">Choose your QR code type and content</p>
              <Button 
                onClick={() => setShowUploadArea(false)}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 lg:px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group-hover:scale-105"
              >
                <QrCode className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
                Create QR Code
              </Button>
              <div className="mt-4 lg:mt-6 space-y-2 text-center">
                <p className="text-sm text-gray-500 font-medium">URL, WiFi, Contact, Email, Phone, Text</p>
                <p className="text-xs text-gray-400">High-resolution PNG, SVG, PDF output</p>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Use Cases */}
        <div className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">QR Code Applications & Best Practices</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Business & Marketing</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Business card contact information and social media links</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Product information, reviews, and purchase links</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Event registration, tickets, and venue information</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Restaurant menus, catalogs, and promotional campaigns</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Digital Connectivity</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>WiFi network credentials for instant connection</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>App download links and software distribution</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Email contact forms and messaging shortcuts</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Phone numbers for quick dialing and SMS</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Integration</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>API endpoints, webhooks, and configuration data</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Authentication tokens and secure data transfer</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Location coordinates and mapping integration</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Calendar events and scheduling automation</span>
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

  // QR Code Generator Interface
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-2">
            <QrCode className="h-5 w-5 text-green-600" />
            <h1 className="text-lg font-semibold text-gray-900">QR Code Generator</h1>
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

        {/* QR Type Selection Header */}
        <div className="bg-gray-50 border-b px-4 py-3">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            <Label className="text-sm font-medium text-gray-700 mr-2 flex-shrink-0">QR Type:</Label>
            {[
              { value: "url", label: "URL", icon: Globe },
              { value: "wifi", label: "WiFi", icon: Wifi },
              { value: "contact", label: "Contact", icon: User },
              { value: "email", label: "Email", icon: Mail },
              { value: "phone", label: "Phone", icon: Phone },
              { value: "text", label: "Text", icon: QrCode }
            ].map((type) => {
              const Icon = type.icon
              return (
                <Button
                  key={type.value}
                  variant={qrType === type.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setQrType(type.value)}
                  className="flex-shrink-0 h-auto p-2 flex flex-col items-center min-w-[70px]"
                >
                  <Icon className="h-3 w-3 mb-1" />
                  <span className="text-xs">{type.label}</span>
                </Button>
              )
            })}
          </div>
        </div>

        <div className="p-4 min-h-[60vh]">
          {/* QR Preview */}
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-base">QR Code Preview</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              {qrDataUrl ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg inline-block">
                    <img
                      src={qrDataUrl}
                      alt="Generated QR Code"
                      className="max-w-full border rounded"
                      style={{ maxWidth: "250px" }}
                    />
                  </div>
                </div>
              ) : (
                <div className="py-8 text-muted-foreground">
                  <QrCode className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Configure content to generate QR code</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Content Input */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Content</CardTitle>
            </CardHeader>
            <CardContent>
              {renderTypeSpecificFields()}
            </CardContent>
          </Card>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 space-y-3 z-30">
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
              onClick={generateQR}
              className="bg-green-600 hover:bg-green-700 text-white py-3"
            >
              <QrCode className="h-4 w-4 mr-2" />
              Generate
            </Button>
          </div>

          {qrDataUrl && (
            <Button 
              onClick={() => downloadQR("png")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
            >
              <Download className="h-4 w-4 mr-2" />
              Download QR Code
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
                <QrCode className="h-5 w-5 text-green-600" />
                <h1 className="text-xl font-semibold text-gray-900">QR Code Generator</h1>
              </div>
              <Badge variant="secondary">QR Mode</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={resetTool}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* QR Type Selection Header */}
          <div className="bg-gray-50 border-b px-6 py-3">
            <div className="flex items-center space-x-3 overflow-x-auto">
              <Label className="text-sm font-medium text-gray-700 mr-2 flex-shrink-0">QR Code Type:</Label>
              {[
                { value: "url", label: "URL", icon: Globe },
                { value: "wifi", label: "WiFi", icon: Wifi },
                { value: "contact", label: "Contact", icon: User },
                { value: "email", label: "Email", icon: Mail },
                { value: "phone", label: "Phone", icon: Phone },
                { value: "text", label: "Text", icon: QrCode }
              ].map((type) => {
                const Icon = type.icon
                return (
                  <Button
                    key={type.value}
                    variant={qrType === type.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setQrType(type.value)}
                    className="h-auto p-3 flex flex-col items-center min-w-[80px] flex-shrink-0"
                  >
                    <Icon className="h-4 w-4 mb-1" />
                    <span className="text-xs">{type.label}</span>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Canvas Content */}
          <div className="flex-1 overflow-hidden p-6">
            <div className="grid grid-cols-2 gap-6 h-full">
              {/* Content Configuration */}
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Content Configuration</CardTitle>
                  <CardDescription>Enter your QR code content</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto">
                  {renderTypeSpecificFields()}
                </CardContent>
              </Card>

              {/* QR Code Preview */}
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>QR Code Preview</CardTitle>
                  <CardDescription>Live preview of your QR code</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex items-center justify-center">
                  {qrDataUrl ? (
                    <div className="text-center">
                      <div className="bg-gray-50 p-6 rounded-lg inline-block mb-4">
                        <img
                          src={qrDataUrl}
                          alt="Generated QR Code"
                          className="max-w-full border rounded shadow-lg"
                          style={{ maxWidth: "300px" }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Button onClick={() => downloadQR("png")} className="w-full">
                          <Download className="h-4 w-4 mr-2" />
                          Download PNG
                        </Button>
                        <div className="grid grid-cols-2 gap-2">
                          <Button variant="outline" onClick={() => downloadQR("svg")}>
                            SVG
                          </Button>
                          <Button variant="outline" onClick={copyQRData}>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      <QrCode className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p>Configure content to generate QR code</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Desktop Right Sidebar */}
        <div className="w-80 xl:w-96 bg-white border-l shadow-lg flex flex-col h-full">
          <div className="px-6 py-4 border-b bg-gray-50 flex-shrink-0">
            <div className="flex items-center space-x-2">
              <QrCode className="h-5 w-5 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900">Customization</h2>
            </div>
            <p className="text-sm text-gray-600 mt-1">Adjust QR code appearance</p>
          </div>

          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-6 space-y-6">
                <div>
                  <Label className="text-sm font-medium">Size: {size[0]}px</Label>
                  <Slider
                    value={size}
                    onValueChange={setSize}
                    min={200}
                    max={2000}
                    step={50}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Margin: {margin[0]}</Label>
                  <Slider
                    value={margin}
                    onValueChange={setMargin}
                    min={0}
                    max={10}
                    step={1}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="error-correction">Error Correction</Label>
                  <Select value={errorCorrection} onValueChange={setErrorCorrection}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L">Low (7%)</SelectItem>
                      <SelectItem value="M">Medium (15%)</SelectItem>
                      <SelectItem value="Q">Quartile (25%)</SelectItem>
                      <SelectItem value="H">High (30%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dark-color">Dark Color</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <input
                        type="color"
                        value={darkColor}
                        onChange={(e) => setDarkColor(e.target.value)}
                        className="w-8 h-8 border rounded cursor-pointer"
                      />
                      <Input
                        value={darkColor}
                        onChange={(e) => setDarkColor(e.target.value)}
                        className="flex-1 font-mono text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="light-color">Light Color</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <input
                        type="color"
                        value={lightColor}
                        onChange={(e) => setLightColor(e.target.value)}
                        className="w-8 h-8 border rounded cursor-pointer"
                      />
                      <Input
                        value={lightColor}
                        onChange={(e) => setLightColor(e.target.value)}
                        className="flex-1 font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="logo-upload">Logo (Optional)</Label>
                  <div className="mt-2">
                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  {logoPreview && (
                    <div className="mt-2">
                      <img src={logoPreview} alt="Logo preview" className="w-16 h-16 object-cover border rounded" />
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          </div>

          <div className="p-6 border-t bg-gray-50 space-y-3 flex-shrink-0">
            <Button 
              onClick={generateQR}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-base font-semibold"
              size="lg"
            >
              <QrCode className="h-4 w-4 mr-2" />
              Generate QR Code
            </Button>

            {qrDataUrl && (
              <Button 
                onClick={() => downloadQR("png")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base font-semibold"
                size="lg"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PNG
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}