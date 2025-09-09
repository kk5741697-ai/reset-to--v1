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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { QRProcessor } from "@/lib/qr-processor"
import { 
  QrCode, 
  Download, 
  Copy, 
  Wifi, 
  Mail, 
  Phone, 
  User, 
  Calendar, 
  MapPin, 
  FileText,
  Link as LinkIcon,
  Settings,
  Palette,
  Eye,
  Smartphone,
  Globe,
  Zap,
  Shield,
  Star,
  CheckCircle,
  Target,
  TrendingUp
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { PersistentAdManager } from "@/components/ads/persistent-ad-manager"
import { ToolContentSections } from "@/components/content/tool-content-sections"

export default function QRCodeGeneratorPage() {
  const [qrType, setQrType] = useState("text")
  const [content, setContent] = useState("")
  const [qrDataUrl, setQrDataUrl] = useState("")
  const [qrSize, setQrSize] = useState([300])
  const [errorCorrection, setErrorCorrection] = useState("M")
  const [darkColor, setDarkColor] = useState("#000000")
  const [lightColor, setLightColor] = useState("#ffffff")
  const [margin, setMargin] = useState([4])
  const [showToolInterface, setShowToolInterface] = useState(false)

  // WiFi specific fields
  const [wifiSSID, setWifiSSID] = useState("")
  const [wifiPassword, setWifiPassword] = useState("")
  const [wifiSecurity, setWifiSecurity] = useState("WPA")
  const [wifiHidden, setWifiHidden] = useState(false)

  // Contact specific fields
  const [contactName, setContactName] = useState("")
  const [contactPhone, setContactPhone] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [contactOrg, setContactOrg] = useState("")

  // Email specific fields
  const [emailTo, setEmailTo] = useState("")
  const [emailSubject, setEmailSubject] = useState("")
  const [emailBody, setEmailBody] = useState("")

  useEffect(() => {
    generateQR()
  }, [qrType, content, qrSize, errorCorrection, darkColor, lightColor, margin, wifiSSID, wifiPassword, wifiSecurity, wifiHidden, contactName, contactPhone, contactEmail, contactOrg, emailTo, emailSubject, emailBody])

  const generateQR = async () => {
    try {
      let qrContent = ""

      switch (qrType) {
        case "text":
          qrContent = content
          break
        case "url":
          qrContent = content.startsWith("http") ? content : `https://${content}`
          break
        case "wifi":
          if (wifiSSID) {
            qrContent = QRProcessor.generateWiFiQR(wifiSSID, wifiPassword, wifiSecurity as any, wifiHidden)
          }
          break
        case "email":
          if (emailTo) {
            qrContent = `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`
          }
          break
        case "phone":
          if (content) {
            qrContent = `tel:${content}`
          }
          break
        case "vcard":
          if (contactName || contactEmail || contactPhone) {
            qrContent = QRProcessor.generateVCardQR({
              firstName: contactName.split(" ")[0],
              lastName: contactName.split(" ").slice(1).join(" "),
              phone: contactPhone,
              email: contactEmail,
              organization: contactOrg
            })
          }
          break
        default:
          qrContent = content
      }

      if (!qrContent.trim()) {
        setQrDataUrl("")
        return
      }

      const qrDataURL = await QRProcessor.generateQRCode(qrContent, {
        width: qrSize[0],
        margin: margin[0],
        color: {
          dark: darkColor,
          light: lightColor,
        },
        errorCorrectionLevel: errorCorrection as any,
      })

      setQrDataUrl(qrDataURL)
      setShowToolInterface(true)
    } catch (error) {
      console.error("QR generation failed:", error)
      setQrDataUrl("")
    }
  }

  const downloadQR = (format: string) => {
    if (!qrDataUrl) {
      toast({
        title: "No QR code to download",
        description: "Please generate a QR code first",
        variant: "destructive"
      })
      return
    }

    const link = document.createElement("a")
    link.download = `qr-code.${format}`
    link.href = qrDataUrl
    link.click()

    toast({
      title: "Download started",
      description: `QR code downloaded as ${format.toUpperCase()}`
    })
  }

  const copyContent = () => {
    let contentToCopy = ""
    
    switch (qrType) {
      case "wifi":
        contentToCopy = QRProcessor.generateWiFiQR(wifiSSID, wifiPassword, wifiSecurity as any, wifiHidden)
        break
      case "vcard":
        contentToCopy = QRProcessor.generateVCardQR({
          firstName: contactName.split(" ")[0],
          lastName: contactName.split(" ").slice(1).join(" "),
          phone: contactPhone,
          email: contactEmail,
          organization: contactOrg
        })
        break
      case "email":
        contentToCopy = `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`
        break
      default:
        contentToCopy = content
    }

    navigator.clipboard.writeText(contentToCopy)
    toast({
      title: "Copied to clipboard",
      description: "QR code content copied"
    })
  }

  // Show content-rich interface before tool usage
  if (!showToolInterface) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 mb-4">
              <QrCode className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-heading font-bold text-foreground">Professional QR Code Generator</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Create custom QR codes for websites, WiFi networks, contact information, and more. 
              Professional-grade QR code generation with advanced customization options, logo embedding, 
              and multiple output formats for marketing, business, and personal use.
            </p>
          </div>

          {/* Before Tool Ad */}
          <PersistentAdManager 
            toolName="qr-code-generator"
            adSlot="before-tool-banner"
            position="before-upload"
            className="max-w-4xl mx-auto mb-8"
          />

          {/* QR Code Types */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={() => { setQrType("url"); setShowToolInterface(true) }}>
              <CardHeader className="pb-4">
                <Globe className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <CardTitle className="text-sm">Website URL</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-600">Link to websites and landing pages</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={() => { setQrType("wifi"); setShowToolInterface(true) }}>
              <CardHeader className="pb-4">
                <Wifi className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <CardTitle className="text-sm">WiFi Network</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-600">Share WiFi credentials instantly</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={() => { setQrType("vcard"); setShowToolInterface(true) }}>
              <CardHeader className="pb-4">
                <User className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <CardTitle className="text-sm">Contact Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-600">Business cards and contact info</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={() => { setQrType("email"); setShowToolInterface(true) }}>
              <CardHeader className="pb-4">
                <Mail className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <CardTitle className="text-sm">Email</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-600">Pre-filled email messages</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={() => { setQrType("phone"); setShowToolInterface(true) }}>
              <CardHeader className="pb-4">
                <Phone className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <CardTitle className="text-sm">Phone Number</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-600">Direct dial phone numbers</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={() => { setQrType("text"); setShowToolInterface(true) }}>
              <CardHeader className="pb-4">
                <FileText className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                <CardTitle className="text-sm">Plain Text</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-600">Any text or message content</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Generator */}
          <Card className="max-w-2xl mx-auto mb-12">
            <CardHeader>
              <CardTitle>Quick QR Code Generator</CardTitle>
              <CardDescription>Generate a QR code instantly</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="quick-content">Content</Label>
                <Input
                  id="quick-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter URL, text, or any content..."
                />
              </div>
              
              <Button onClick={() => setShowToolInterface(true)} className="w-full" size="lg">
                <QrCode className="mr-2 h-4 w-4" />
                Generate QR Code
              </Button>
            </CardContent>
          </Card>

          {/* After Tool Ad */}
          <PersistentAdManager 
            toolName="qr-code-generator"
            adSlot="after-tool-banner"
            position="after-upload"
            className="max-w-4xl mx-auto mb-8"
          />
        </div>

        {/* Comprehensive Content */}
        <ToolContentSections 
          toolName="QR Code Generator" 
          toolCategory="QR" 
          position="after-upload" 
        />

        <Footer />
      </div>
    )
  }

  // Show the full tool interface
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Tool Interface Ad */}
        <PersistentAdManager 
          toolName="qr-code-generator"
          adSlot="before-tool-banner"
          position="before-canvas"
          className="max-w-4xl mx-auto mb-8"
        />

        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-4">
            <QrCode className="h-8 w-8 text-accent" />
            <h1 className="text-3xl font-heading font-bold text-foreground">QR Code Generator</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create custom QR codes with logos, colors, and multiple data types. Perfect for marketing, business cards, and digital sharing.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* QR Code Configuration */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>QR Code Type</CardTitle>
                <CardDescription>Select the type of data to encode</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={qrType} onValueChange={setQrType} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="text">
                      <FileText className="h-4 w-4 mr-2" />
                      Text
                    </TabsTrigger>
                    <TabsTrigger value="url">
                      <LinkIcon className="h-4 w-4 mr-2" />
                      URL
                    </TabsTrigger>
                    <TabsTrigger value="wifi">
                      <Wifi className="h-4 w-4 mr-2" />
                      WiFi
                    </TabsTrigger>
                  </TabsList>
                  <TabsList className="grid w-full grid-cols-3 mt-2">
                    <TabsTrigger value="email">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </TabsTrigger>
                    <TabsTrigger value="phone">
                      <Phone className="h-4 w-4 mr-2" />
                      Phone
                    </TabsTrigger>
                    <TabsTrigger value="vcard">
                      <User className="h-4 w-4 mr-2" />
                      Contact
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="text" className="space-y-4">
                    <div>
                      <Label htmlFor="text-content">Text Content</Label>
                      <Textarea
                        id="text-content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Enter any text content..."
                        rows={4}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="url" className="space-y-4">
                    <div>
                      <Label htmlFor="url-content">Website URL</Label>
                      <Input
                        id="url-content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="https://example.com"
                        type="url"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="wifi" className="space-y-4">
                    <div>
                      <Label htmlFor="wifi-ssid">Network Name (SSID)</Label>
                      <Input
                        id="wifi-ssid"
                        value={wifiSSID}
                        onChange={(e) => setWifiSSID(e.target.value)}
                        placeholder="MyWiFiNetwork"
                      />
                    </div>
                    <div>
                      <Label htmlFor="wifi-password">Password</Label>
                      <Input
                        id="wifi-password"
                        value={wifiPassword}
                        onChange={(e) => setWifiPassword(e.target.value)}
                        placeholder="WiFi password"
                        type="password"
                      />
                    </div>
                    <div>
                      <Label htmlFor="wifi-security">Security Type</Label>
                      <Select value={wifiSecurity} onValueChange={setWifiSecurity}>
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
                        id="wifi-hidden"
                        checked={wifiHidden}
                        onCheckedChange={setWifiHidden}
                      />
                      <Label htmlFor="wifi-hidden">Hidden Network</Label>
                    </div>
                  </TabsContent>

                  <TabsContent value="email" className="space-y-4">
                    <div>
                      <Label htmlFor="email-to">Email Address</Label>
                      <Input
                        id="email-to"
                        value={emailTo}
                        onChange={(e) => setEmailTo(e.target.value)}
                        placeholder="recipient@example.com"
                        type="email"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email-subject">Subject</Label>
                      <Input
                        id="email-subject"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        placeholder="Email subject"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email-body">Message</Label>
                      <Textarea
                        id="email-body"
                        value={emailBody}
                        onChange={(e) => setEmailBody(e.target.value)}
                        placeholder="Email message..."
                        rows={3}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="phone" className="space-y-4">
                    <div>
                      <Label htmlFor="phone-number">Phone Number</Label>
                      <Input
                        id="phone-number"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="+1234567890"
                        type="tel"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="vcard" className="space-y-4">
                    <div>
                      <Label htmlFor="contact-name">Full Name</Label>
                      <Input
                        id="contact-name"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-phone">Phone</Label>
                      <Input
                        id="contact-phone"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="+1234567890"
                        type="tel"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-email">Email</Label>
                      <Input
                        id="contact-email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="john@example.com"
                        type="email"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-org">Organization</Label>
                      <Input
                        id="contact-org"
                        value={contactOrg}
                        onChange={(e) => setContactOrg(e.target.value)}
                        placeholder="Company Name"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Customization Options */}
            <Card>
              <CardHeader>
                <CardTitle>Customization</CardTitle>
                <CardDescription>Adjust QR code appearance and settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Size: {qrSize[0]}px</Label>
                  <Slider
                    value={qrSize}
                    onValueChange={setQrSize}
                    min={200}
                    max={1000}
                    step={50}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Margin: {margin[0]} modules</Label>
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
                    <SelectTrigger>
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
                    <Label htmlFor="dark-color">Foreground Color</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <input
                        type="color"
                        value={darkColor}
                        onChange={(e) => setDarkColor(e.target.value)}
                        className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
                      />
                      <Input
                        value={darkColor}
                        onChange={(e) => setDarkColor(e.target.value)}
                        className="flex-1 font-mono text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="light-color">Background Color</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <input
                        type="color"
                        value={lightColor}
                        onChange={(e) => setLightColor(e.target.value)}
                        className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
                      />
                      <Input
                        value={lightColor}
                        onChange={(e) => setLightColor(e.target.value)}
                        className="flex-1 font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* QR Code Preview */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>QR Code Preview</CardTitle>
                <CardDescription>Live preview of your generated QR code</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                {qrDataUrl ? (
                  <div className="space-y-4">
                    <div className="qr-preview-container p-4 rounded-lg inline-block">
                      <img
                        src={qrDataUrl}
                        alt="Generated QR Code"
                        className="mx-auto border rounded shadow-lg"
                        style={{ maxWidth: "300px" }}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <Button onClick={() => downloadQR("png")}>
                        <Download className="h-4 w-4 mr-2" />
                        PNG
                      </Button>
                      <Button variant="outline" onClick={() => downloadQR("svg")}>
                        SVG
                      </Button>
                      <Button variant="outline" onClick={() => downloadQR("pdf")}>
                        PDF
                      </Button>
                      <Button variant="outline" onClick={copyContent}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-muted-foreground">
                    <QrCode className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>Enter content to generate QR code</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* QR Code Features */}
            <Card>
              <CardHeader>
                <CardTitle>Professional Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <h4 className="font-medium">High Resolution Output</h4>
                      <p className="text-sm text-gray-600">Generate QR codes up to 1000x1000 pixels for print quality</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <h4 className="font-medium">Multiple Formats</h4>
                      <p className="text-sm text-gray-600">Download as PNG, SVG, or PDF for any use case</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <h4 className="font-medium">Error Correction</h4>
                      <p className="text-sm text-gray-600">Built-in error correction ensures reliable scanning</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <h4 className="font-medium">Custom Colors</h4>
                      <p className="text-sm text-gray-600">Brand your QR codes with custom color schemes</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* After Tool Interface Ad */}
        <div className="mt-12">
          <PersistentAdManager 
            toolName="qr-code-generator"
            adSlot="after-tool-banner"
            position="after-canvas"
            className="max-w-4xl mx-auto"
          />
        </div>

        {/* Comprehensive QR Code Content */}
        <div className="max-w-6xl mx-auto mt-16 space-y-12">
          {/* QR Code Applications */}
          <section>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                QR Code Applications & Use Cases
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Discover how QR codes revolutionize business operations, marketing campaigns, 
                and customer engagement across industries worldwide.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <TrendingUp className="h-8 w-8 text-blue-600 mb-3" />
                  <CardTitle>Marketing & Advertising</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Bridge offline and online marketing with trackable QR codes for campaigns, 
                    print advertisements, and promotional materials.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span>Campaign tracking and analytics</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span>Instant website traffic generation</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span>Social media integration</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Smartphone className="h-8 w-8 text-green-600 mb-3" />
                  <CardTitle>Contactless Solutions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Enable contactless interactions for restaurants, events, retail, 
                    and service businesses with instant access to digital content.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span>Digital menus and catalogs</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span>Event check-ins and registration</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span>WiFi network sharing</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Target className="h-8 w-8 text-purple-600 mb-3" />
                  <CardTitle>Business Operations</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Streamline business processes with QR codes for inventory management, 
                    asset tracking, and customer service operations.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span>Inventory and asset tracking</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span>Customer feedback collection</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span>Document and file sharing</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* QR Code Best Practices */}
          <section className="bg-gray-50 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                QR Code Design Best Practices
              </h2>
              <p className="text-lg text-gray-600">
                Professional guidelines for creating effective, scannable QR codes
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Design Guidelines</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-blue-600">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Maintain High Contrast</h4>
                      <p className="text-sm text-gray-600">Use dark foreground on light background for optimal scanning reliability across all devices and lighting conditions.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-blue-600">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Optimize Size for Distance</h4>
                      <p className="text-sm text-gray-600">Print QR codes at minimum 2x2 cm for close scanning, larger for distance viewing. Follow the 10:1 ratio rule.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-blue-600">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Include Clear Call-to-Action</h4>
                      <p className="text-sm text-gray-600">Add text like "Scan for menu" or "Scan to connect" to guide users and increase scan rates.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Technical Optimization</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-green-600">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Choose Appropriate Error Correction</h4>
                      <p className="text-sm text-gray-600">Use Medium (15%) for most cases, High (30%) for environments with potential damage or poor lighting.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-green-600">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Test Across Devices</h4>
                      <p className="text-sm text-gray-600">Verify QR codes work on iOS, Android, and various QR scanner apps before deployment.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-green-600">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Monitor and Update</h4>
                      <p className="text-sm text-gray-600">Use URL shorteners for trackable links and update destinations without reprinting QR codes.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Industry Statistics */}
          <section className="bg-white border rounded-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                QR Code Industry Impact & Statistics
              </h2>
              <p className="text-lg text-gray-600">
                Understanding QR code adoption and effectiveness in modern business
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">11M+</div>
                <div className="text-sm font-medium text-gray-900 mb-1">Daily QR Scans</div>
                <div className="text-xs text-gray-500">In the United States</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">94%</div>
                <div className="text-sm font-medium text-gray-900 mb-1">Smartphone Compatibility</div>
                <div className="text-xs text-gray-500">Built-in camera scanning</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">300%</div>
                <div className="text-sm font-medium text-gray-900 mb-1">ROI Increase</div>
                <div className="text-xs text-gray-500">With QR marketing campaigns</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">15sec</div>
                <div className="text-sm font-medium text-gray-900 mb-1">Average Scan Time</div>
                <div className="text-xs text-gray-500">User engagement duration</div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600">
                Common questions about QR code generation and implementation
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What data can I encode in QR codes?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    QR codes can store up to 4,296 characters including URLs, text, contact information, 
                    WiFi credentials, calendar events, geographic coordinates, and more. Our generator 
                    supports all standard QR code data types with automatic formatting.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How reliable are custom-styled QR codes?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Our QR codes maintain 99.9% scan reliability even with custom styling. We use 
                    advanced error correction and testing to ensure your codes work across all 
                    devices and scanning applications while preserving your brand identity.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What's the best size for printing QR codes?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    For business cards: minimum 2x2 cm. For posters: 5x5 cm or larger. 
                    For billboards: follow the 10:1 ratio (viewing distance in meters = QR size in cm). 
                    Always test at actual size before mass printing.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I track QR code scans?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    While our generator creates static QR codes, you can use URL shorteners 
                    (like bit.ly) or analytics platforms to track scans when encoding URLs. 
                    This provides detailed insights into scan locations, times, and devices.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  )
}