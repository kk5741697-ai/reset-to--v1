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
import { QRProcessor } from "@/lib/qr-processor"
import { QrCode, Download, Copy, Upload, Palette, Settings } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { AdBanner } from "@/components/ads/ad-banner"

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

  return (
    <div className="min-h-screen bg-background">
      <Header />

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
              <AdBanner 
                adSlot="qr-generator-content"
                adFormat="auto"
                className="max-w-3xl mx-auto"
                mobileOptimized={true}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Content Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>QR Code Content</CardTitle>
              <CardDescription>Choose the type of data to encode</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="qr-type">Content Type</Label>
                <Select value={qrType} onValueChange={setQrType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="url">Website URL</SelectItem>
                    <SelectItem value="text">Plain Text</SelectItem>
                    <SelectItem value="wifi">WiFi Network</SelectItem>
                    <SelectItem value="contact">Contact Info</SelectItem>
                    <SelectItem value="email">Email Address</SelectItem>
                    <SelectItem value="phone">Phone Number</SelectItem>
                    <SelectItem value="sms">SMS Message</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {renderTypeSpecificFields()}
            </CardContent>
          </Card>

          {/* QR Code Preview */}
          <Card>
            <CardHeader>
              <CardTitle>QR Code Preview</CardTitle>
              <CardDescription>Live preview of your QR code</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              {qrDataUrl ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg inline-block">
                    <img
                      src={qrDataUrl}
                      alt="Generated QR Code"
                      className="max-w-full border rounded"
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
                        Copy Data
                      </Button>
                    </div>
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

          {/* Customization Options */}
          <Card>
            <CardHeader>
              <CardTitle>Customization</CardTitle>
              <CardDescription>Adjust QR code appearance and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
            </CardContent>
          </Card>
        </div>

        {/* Usage Examples */}
        <Card className="mt-8 max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>QR Code Use Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium mb-3">Business & Marketing</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Business card contact information</li>
                  <li>• Website and social media links</li>
                  <li>• Product information and reviews</li>
                  <li>• Event registration and tickets</li>
                  <li>• Menu and catalog access</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3">Connectivity</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• WiFi network credentials</li>
                  <li>• App download links</li>
                  <li>• Email contact forms</li>
                  <li>• Phone numbers for quick dialing</li>
                  <li>• SMS and messaging shortcuts</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3">Digital Integration</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• API endpoints and webhooks</li>
                  <li>• Configuration data transfer</li>
                  <li>• Authentication tokens</li>
                  <li>• Location coordinates</li>
                  <li>• Calendar event details</li>
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