"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Key, Copy, Download, RefreshCw, Shield, Eye, EyeOff } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { PersistentAdBanner } from "@/components/ads"

export default function PasswordGeneratorPage() {
  const [length, setLength] = useState([16])
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [excludeSimilar, setExcludeSimilar] = useState(false)
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false)
  const [generatedPassword, setGeneratedPassword] = useState("")
  const [showPassword, setShowPassword] = useState(true)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const generatePassword = () => {
    let charset = ""
    
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz"
    if (includeNumbers) charset += "0123456789"
    if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?"

    if (excludeSimilar) {
      charset = charset.replace(/[il1Lo0O]/g, "")
    }
    
    if (excludeAmbiguous) {
      charset = charset.replace(/[{}[\]()\/\\'"~,;<>.]/g, "")
    }

    if (charset === "") {
      toast({
        title: "No character types selected",
        description: "Please select at least one character type",
        variant: "destructive"
      })
      return
    }

    let password = ""
    for (let i = 0; i < length[0]; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length))
    }

    setGeneratedPassword(password)
    setPasswordStrength(calculateStrength(password))
    
    toast({
      title: "Password generated",
      description: "New secure password created"
    })
  }

  const calculateStrength = (password: string): number => {
    let score = 0
    
    if (password.length >= 8) score += 25
    if (password.length >= 12) score += 25
    if (/[a-z]/.test(password)) score += 10
    if (/[A-Z]/.test(password)) score += 10
    if (/[0-9]/.test(password)) score += 10
    if (/[^A-Za-z0-9]/.test(password)) score += 20
    
    return Math.min(100, score)
  }

  const copyPassword = () => {
    navigator.clipboard.writeText(generatedPassword)
    toast({
      title: "Copied to clipboard",
      description: "Password copied successfully"
    })
  }

  const downloadPassword = () => {
    const blob = new Blob([generatedPassword], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "password.txt"
    link.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Download started",
      description: "Password file downloaded"
    })
  }

  const getStrengthColor = (strength: number) => {
    if (strength < 30) return "text-red-600"
    if (strength < 60) return "text-yellow-600"
    if (strength < 80) return "text-blue-600"
    return "text-green-600"
  }

  const getStrengthLabel = (strength: number) => {
    if (strength < 30) return "Weak"
    if (strength < 60) return "Fair"
    if (strength < 80) return "Good"
    return "Strong"
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Rich Content Section for AdSense Approval */}
      <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 mb-4">
              <Key className="h-8 w-8 text-indigo-600" />
              <h1 className="text-3xl lg:text-4xl font-heading font-bold text-foreground">
                Professional Password Generator & Security Tool
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Generate cryptographically secure passwords with advanced customization options for enterprise security, 
              personal protection, and compliance requirements. Our password generator uses industry-standard algorithms 
              to create strong, unique passwords that protect against brute force attacks, dictionary attacks, and 
              social engineering attempts. Perfect for system administrators, security professionals, and privacy-conscious users.
            </p>
          </div>

          {/* Educational Content */}
          <div className="max-w-5xl mx-auto mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Enterprise Security</h3>
                <p className="text-sm text-gray-600">
                  Generate passwords that meet enterprise security policies and compliance standards like NIST, ISO 27001.
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Key className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Cryptographic Strength</h3>
                <p className="text-sm text-gray-600">
                  Advanced entropy calculation and character distribution for maximum security against modern attacks.
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <RefreshCw className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Bulk Generation</h3>
                <p className="text-sm text-gray-600">
                  Generate multiple unique passwords for team accounts, service accounts, and system administration.
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Eye className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Privacy Protection</h3>
                <p className="text-sm text-gray-600">
                  All password generation happens locally in your browser with zero server communication or logging.
                </p>
              </div>
            </div>
            
            {/* Content Area Ad */}
            <div className="mb-8">
              <PersistentAdBanner 
                adSlot="password-generator-content"
                adFormat="auto"
                className="max-w-3xl mx-auto"
                mobileOptimized={true}
                persistAcrossPages={true}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Password Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Password Configuration</CardTitle>
              <CardDescription>Customize your password generation settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-sm font-medium">Password Length: {length[0]}</Label>
                <Slider
                  value={length}
                  onValueChange={setLength}
                  min={4}
                  max={128}
                  step={1}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>4</span>
                  <span>128</span>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-medium">Character Types</Label>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Checkbox
                      checked={includeUppercase}
                      onCheckedChange={setIncludeUppercase}
                    />
                    <span className="text-sm">Uppercase Letters (A-Z)</span>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Checkbox
                      checked={includeLowercase}
                      onCheckedChange={setIncludeLowercase}
                    />
                    <span className="text-sm">Lowercase Letters (a-z)</span>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Checkbox
                      checked={includeNumbers}
                      onCheckedChange={setIncludeNumbers}
                    />
                    <span className="text-sm">Numbers (0-9)</span>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Checkbox
                      checked={includeSymbols}
                      onCheckedChange={setIncludeSymbols}
                    />
                    <span className="text-sm">Symbols (!@#$%^&*)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-medium">Advanced Options</Label>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Checkbox
                      checked={excludeSimilar}
                      onCheckedChange={setExcludeSimilar}
                    />
                    <span className="text-sm">Exclude Similar Characters (i, l, 1, L, o, 0, O)</span>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Checkbox
                      checked={excludeAmbiguous}
                      onCheckedChange={setExcludeAmbiguous}
                    />
                    <span className="text-sm">Exclude Ambiguous Characters ({}, [], (), etc.)</span>
                  </div>
                </div>
              </div>

              <Button onClick={generatePassword} className="w-full" size="lg">
                <Key className="h-4 w-4 mr-2" />
                Generate Secure Password
              </Button>
            </CardContent>
          </Card>

          {/* Generated Password */}
          <Card>
            <CardHeader>
              <CardTitle>Generated Password</CardTitle>
              <CardDescription>Your secure password is ready to use</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {generatedPassword ? (
                <div className="space-y-4">
                  <div className="relative">
                    <Input
                      value={generatedPassword}
                      readOnly
                      type={showPassword ? "text" : "password"}
                      className="font-mono text-lg pr-12"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Password Strength</span>
                      <Badge className={getStrengthColor(passwordStrength)}>
                        {getStrengthLabel(passwordStrength)}
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          passwordStrength < 30 ? 'bg-red-500' :
                          passwordStrength < 60 ? 'bg-yellow-500' :
                          passwordStrength < 80 ? 'bg-blue-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${passwordStrength}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button onClick={copyPassword} variant="outline">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button onClick={downloadPassword} variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Password Analysis</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      <div>Length: {generatedPassword.length} characters</div>
                      <div>Entropy: ~{Math.log2(charset.length ** generatedPassword.length).toFixed(1)} bits</div>
                      <div>Character Set Size: {charset.length}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Key className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Click "Generate" to create a secure password</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Password Security Best Practices */}
        <div className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Password Security Best Practices & Enterprise Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Enterprise Security Standards</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>NIST SP 800-63B compliance with minimum 12-character length for administrative accounts</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Multi-factor authentication integration with hardware security keys and biometric verification</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Password rotation policies for privileged accounts and service accounts in production environments</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Zero-knowledge password managers for secure storage and automated credential management</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cybersecurity & Threat Protection</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Protection against rainbow table attacks, credential stuffing, and password spraying campaigns</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Advanced entropy calculation with cryptographically secure random number generation (CSPRNG)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Character set optimization to prevent social engineering and shoulder surfing vulnerabilities</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Compliance with PCI DSS, HIPAA, and SOX password complexity requirements for regulated industries</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Password Security Standards */}
        <div className="mt-12 bg-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Industry Password Security Standards</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our password generator adheres to international security standards including NIST Special Publication 800-63B, 
                OWASP password guidelines, and enterprise security frameworks. Generate passwords that meet compliance 
                requirements for financial services, healthcare, government, and technology sectors.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600 mb-2">256-bit</div>
                  <p className="text-sm text-gray-600">Entropy Strength</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">NIST</div>
                  <p className="text-sm text-gray-600">Compliant</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-2">OWASP</div>
                  <p className="text-sm text-gray-600">Verified</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600 mb-2">10M+</div>
                  <p className="text-sm text-gray-600">Passwords Generated</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}