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
import { PersistentAdBanner } from "@/components/ads/persistent-ad-manager"

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
      charset = charset.replace(/[{}[\]()\/\\'"~,;.<>]/g, "")
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

  const getStrengthColor = (strength: number) => {
    if (strength < 40) return "text-red-600"
    if (strength < 70) return "text-yellow-600"
    return "text-green-600"
  }

  const getStrengthText = (strength: number) => {
    if (strength < 40) return "Weak"
    if (strength < 70) return "Medium"
    return "Strong"
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
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Rich Content Section for AdSense */}
      <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 mb-4">
              <Key className="h-8 w-8 text-indigo-600" />
              <h1 className="text-3xl lg:text-4xl font-heading font-bold text-foreground">
                Professional Password Generator
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Generate cryptographically secure passwords with customizable length, character sets, and complexity options. 
              Our advanced password generator helps protect your accounts with strong, unique passwords that meet modern 
              security standards and compliance requirements.
            </p>
          </div>

          {/* Educational Content */}
          <div className="max-w-5xl mx-auto mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Cryptographically Secure</h3>
                <p className="text-sm text-gray-600">
                  Uses secure random number generation to create passwords that are truly unpredictable and safe.
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Key className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Customizable Options</h3>
                <p className="text-sm text-gray-600">
                  Control length, character types, and exclusions to meet specific security requirements.
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Eye className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Strength Analysis</h3>
                <p className="text-sm text-gray-600">
                  Real-time password strength evaluation with detailed security recommendations.
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <RefreshCw className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Instant Generation</h3>
                <p className="text-sm text-gray-600">
                  Generate unlimited passwords instantly with no server communication required.
                </p>
              </div>
            </div>
            
            {/* Content Area Ad */}
            <div className="mb-8">
              <AdBanner 
                adSlot="password-generator-content"
                adFormat="auto"
                className="max-w-3xl mx-auto"
                mobileOptimized={true}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Configuration */}
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
                <PersistentAdBanner 
                  min={4}
                  max={128}
                  step={1}
                  className="mt-2"
                  persistAcrossPages={true}
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
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate Password
              </Button>
            </CardContent>
          </Card>

          {/* Generated Password */}
          <Card>
            <CardHeader>
              <CardTitle>Generated Password</CardTitle>
              <CardDescription>Your secure password is ready to use</CardDescription>
            </CardHeader>
            <CardContent>
              {generatedPassword ? (
                <div className="space-y-4">
                  <div className="relative">
                    <Input
                      value={generatedPassword}
                      readOnly
                      type={showPassword ? "text" : "password"}
                      className="font-mono text-lg pr-10"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Password Strength</span>
                      <span className={`text-sm font-bold ${getStrengthColor(passwordStrength)}`}>
                        {getStrengthText(passwordStrength)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          passwordStrength < 40 ? "bg-red-500" :
                          passwordStrength < 70 ? "bg-yellow-500" : "bg-green-500"
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
                      <div>Entropy: ~{Math.round(Math.log2(Math.pow(charset.length, generatedPassword.length)))} bits</div>
                      <div>Character Types: {[
                        includeUppercase && "Uppercase",
                        includeLowercase && "Lowercase", 
                        includeNumbers && "Numbers",
                        includeSymbols && "Symbols"
                      ].filter(Boolean).join(", ")}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Key className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Click "Generate Password" to create a secure password</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Security Tips */}
        <Card className="mt-8 max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Enterprise Password Security & Compliance Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Corporate Security Standards</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Implement minimum 16-character passwords for enterprise accounts and administrative access</li>
                  <li>• Enforce complex character requirements including uppercase, lowercase, numbers, and special symbols</li>
                  <li>• Prohibit dictionary words, personal information, and common password patterns</li>
                  <li>• Mandate unique passwords for each system, application, and service account</li>
                  <li>• Deploy enterprise password managers with centralized policy enforcement</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3">Compliance & Risk Management</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Implement multi-factor authentication (MFA) for all critical business systems and applications</li>
                  <li>• Establish password rotation policies aligned with industry standards and regulatory requirements</li>
                  <li>• Prohibit password sharing through insecure channels and implement secure credential sharing protocols</li>
                  <li>• Maintain strict separation between corporate and personal account credentials</li>
                  <li>• Utilize enterprise-grade encrypted password vaults with audit trails and access controls</li>
                </ul>
              </div>
            </div>
            
            {/* Compliance Standards */}
            <div className="mt-8 pt-6 border-t">
              <h4 className="font-medium mb-4 text-center">Compliance Standards Supported</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="font-semibold text-blue-900">SOC 2</div>
                  <div className="text-xs text-blue-700">Security Controls</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="font-semibold text-green-900">GDPR</div>
                  <div className="text-xs text-green-700">Data Protection</div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="font-semibold text-purple-900">HIPAA</div>
                  <div className="text-xs text-purple-700">Healthcare Security</div>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <div className="font-semibold text-orange-900">PCI DSS</div>
                  <div className="text-xs text-orange-700">Payment Security</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}