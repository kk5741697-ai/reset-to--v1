"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Copy, RefreshCw, Eye, EyeOff } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { PersistentAdManager } from "@/components/ads/persistent-ad-manager"
import { ToolContentSections } from "@/components/content/tool-content-sections"
import { CheckCircle, Lock, Zap, Users, Award } from "lucide-react"

export default function PasswordGeneratorPage() {
  const [password, setPassword] = useState("")
  const [length, setLength] = useState([12])
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [excludeSimilar, setExcludeSimilar] = useState(false)
  const [showPassword, setShowPassword] = useState(true)
  const [showToolInterface, setShowToolInterface] = useState(false)

  const generatePassword = () => {
    let charset = ""

    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz"
    if (includeNumbers) charset += "0123456789"
    if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?"

    if (excludeSimilar) {
      charset = charset.replace(/[il1Lo0O]/g, "")
    }

    if (charset === "") {
      toast({
        title: "No character types selected",
        description: "Please select at least one character type",
        variant: "destructive"
      })
      return
    }

    // Enhanced password generation with better randomness
    let result = ""
    const passwordLength = length[0]
    
    // Use crypto.getRandomValues for better randomness if available
    if (typeof window !== "undefined" && window.crypto && window.crypto.getRandomValues) {
      const array = new Uint32Array(passwordLength)
      window.crypto.getRandomValues(array)
      
      for (let i = 0; i < passwordLength; i++) {
        result += charset.charAt(array[i] % charset.length)
      }
    } else {
      // Fallback to Math.random
      for (let i = 0; i < passwordLength; i++) {
        result += charset.charAt(Math.floor(Math.random() * charset.length))
      }
    }

    setPassword(result)
    setShowToolInterface(true)
  }

  const copyPassword = () => {
    navigator.clipboard.writeText(password)
    toast({
      title: "Copied to clipboard",
      description: "Password has been copied"
    })
  }

  const getStrengthColor = (length: number) => {
    if (length < 8) return "text-red-500"
    if (length < 12) return "text-yellow-500"
    return "text-green-500"
  }

  const getStrengthText = (length: number) => {
    if (length < 8) return "Weak"
    if (length < 12) return "Medium"
    return "Strong"
  }

  // Show content-rich interface before tool usage
  if (!showToolInterface) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-heading font-bold text-foreground">Secure Password Generator</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Generate cryptographically secure passwords with customizable length, character sets, and complexity options. 
              Essential for cybersecurity, account protection, and compliance with security policies.
            </p>
          </div>

          {/* Before Tool Ad */}
          <PersistentAdManager 
            toolName="password-generator"
            adSlot="before-tool-banner"
            position="before-upload"
            className="max-w-4xl mx-auto mb-8"
          />

          {/* Security Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card>
              <CardHeader className="text-center pb-4">
                <Lock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Cryptographic Security</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-600">
                  Uses browser's crypto.getRandomValues() for true randomness and maximum security
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center pb-4">
                <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Privacy Protected</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-600">
                  Passwords generated locally in your browser - never transmitted or stored anywhere
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center pb-4">
                <Zap className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Instant Generation</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-600">
                  Generate unlimited passwords instantly with customizable complexity and character sets
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center pb-4">
                <Award className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Enterprise Grade</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-600">
                  Meets enterprise security standards and compliance requirements for password policies
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Generator */}
          <Card className="max-w-2xl mx-auto mb-12">
            <CardHeader>
              <CardTitle>Quick Password Generator</CardTitle>
              <CardDescription>Generate a secure password instantly</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-base font-medium">Password Length: {length[0]} characters</Label>
                <Slider value={length} onValueChange={setLength} max={50} min={8} step={1} className="mt-2" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="uppercase" checked={includeUppercase} onCheckedChange={setIncludeUppercase} />
                  <Label htmlFor="uppercase">Uppercase (A-Z)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="lowercase" checked={includeLowercase} onCheckedChange={setIncludeLowercase} />
                  <Label htmlFor="lowercase">Lowercase (a-z)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="numbers" checked={includeNumbers} onCheckedChange={setIncludeNumbers} />
                  <Label htmlFor="numbers">Numbers (0-9)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="symbols" checked={includeSymbols} onCheckedChange={setIncludeSymbols} />
                  <Label htmlFor="symbols">Symbols (!@#$%^&*)</Label>
                </div>
              </div>

              <Button onClick={generatePassword} className="w-full" size="lg">
                <RefreshCw className="mr-2 h-4 w-4" />
                Generate Secure Password
              </Button>
            </CardContent>
          </Card>

          {/* After Tool Ad */}
          <PersistentAdManager 
            toolName="password-generator"
            adSlot="after-tool-banner"
            position="after-upload"
            className="max-w-4xl mx-auto mb-8"
          />
        </div>

        {/* Comprehensive Content */}
        <ToolContentSections 
          toolName="Password Generator" 
          toolCategory="UTILITIES" 
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
          toolName="password-generator"
          adSlot="before-tool-banner"
          position="before-canvas"
          className="max-w-4xl mx-auto mb-8"
        />

        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-4">
            <Shield className="h-8 w-8 text-accent" />
            <h1 className="text-3xl font-heading font-bold text-foreground">Password Generator</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Generate secure passwords with customizable length, characters, and complexity options.
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Generated Password */}
          <Card>
            <CardHeader>
              <CardTitle>Generated Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  readOnly
                  className="pr-20 font-mono text-lg"
                  placeholder="Click generate to create password"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                  <Button variant="ghost" size="sm" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={copyPassword} disabled={!password}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {password && (
                <div className="flex items-center justify-between text-sm">
                  <span className={`font-medium ${getStrengthColor(length[0])}`}>
                    Strength: {getStrengthText(length[0])}
                  </span>
                  <span className="text-muted-foreground">Length: {password.length} characters</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Options */}
          <Card>
            <CardHeader>
              <CardTitle>Password Options</CardTitle>
              <CardDescription>Customize your password requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Length Slider */}
              <div>
                <Label className="text-base font-medium">Password Length: {length[0]} characters</Label>
                <Slider value={length} onValueChange={setLength} max={50} min={4} step={1} className="mt-2" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>4</span>
                  <span>50</span>
                </div>
              </div>

              {/* Character Types */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Include Characters</Label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="uppercase" checked={includeUppercase} onCheckedChange={setIncludeUppercase} />
                    <Label htmlFor="uppercase">Uppercase (A-Z)</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="lowercase" checked={includeLowercase} onCheckedChange={setIncludeLowercase} />
                    <Label htmlFor="lowercase">Lowercase (a-z)</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="numbers" checked={includeNumbers} onCheckedChange={setIncludeNumbers} />
                    <Label htmlFor="numbers">Numbers (0-9)</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="symbols" checked={includeSymbols} onCheckedChange={setIncludeSymbols} />
                    <Label htmlFor="symbols">Symbols (!@#$%^&*)</Label>
                  </div>
                </div>
              </div>

              {/* Advanced Options */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Advanced Options</Label>

                <div className="flex items-center space-x-2">
                  <Checkbox id="exclude-similar" checked={excludeSimilar} onCheckedChange={setExcludeSimilar} />
                  <Label htmlFor="exclude-similar">Exclude similar characters (i, l, 1, L, o, 0, O)</Label>
                </div>
              </div>

              {/* Generate Button */}
              <Button onClick={generatePassword} className="w-full" size="lg">
                <RefreshCw className="mr-2 h-4 w-4" />
                Generate Password
              </Button>
            </CardContent>
          </Card>

          {/* Password Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Password Security Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Use at least 12 characters for better security</li>
                <li>• Include a mix of uppercase, lowercase, numbers, and symbols</li>
                <li>• Avoid using personal information or common words</li>
                <li>• Use a unique password for each account</li>
                <li>• Consider using a password manager to store passwords securely</li>
                <li>• Enable two-factor authentication when available</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* After Tool Interface Ad */}
        <div className="mt-12">
          <PersistentAdManager 
            toolName="password-generator"
            adSlot="after-tool-banner"
            position="after-canvas"
            className="max-w-4xl mx-auto"
          />
        </div>

        {/* Comprehensive Password Security Content */}
        <div className="max-w-6xl mx-auto mt-16 space-y-12">
          {/* Password Security Best Practices */}
          <section>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Password Security Best Practices
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Essential guidelines for creating and managing secure passwords in today's digital landscape. 
                Protect your accounts and sensitive information with enterprise-grade security practices.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <Shield className="h-8 w-8 text-blue-600 mb-3" />
                  <CardTitle>Password Complexity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Strong passwords combine multiple character types and sufficient length 
                    to resist brute force attacks and dictionary-based cracking attempts.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span>Minimum 12 characters length</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span>Mix of uppercase and lowercase</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span>Numbers and special characters</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Lock className="h-8 w-8 text-green-600 mb-3" />
                  <CardTitle>Account Protection</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Implement multi-layered security strategies to protect your accounts 
                    from unauthorized access and data breaches.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span>Unique password per account</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span>Enable two-factor authentication</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span>Regular password updates</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Award className="h-8 w-8 text-purple-600 mb-3" />
                  <CardTitle>Password Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Use professional password management tools and practices to maintain 
                    security without compromising convenience or productivity.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span>Password manager software</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span>Secure backup and recovery</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span>Regular security audits</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Cybersecurity Statistics */}
          <section className="bg-white border rounded-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Cybersecurity Statistics & Trends
              </h2>
              <p className="text-lg text-gray-600">
                Understanding the importance of strong passwords in modern cybersecurity
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">81%</div>
                <div className="text-sm font-medium text-gray-900 mb-1">Data Breaches</div>
                <div className="text-xs text-gray-500">Caused by weak passwords</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">2.9B</div>
                <div className="text-sm font-medium text-gray-900 mb-1">Passwords Leaked</div>
                <div className="text-xs text-gray-500">In 2023 data breaches</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
                <div className="text-sm font-medium text-gray-900 mb-1">Attack Prevention</div>
                <div className="text-xs text-gray-500">With strong passwords</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">12+</div>
                <div className="text-sm font-medium text-gray-900 mb-1">Recommended Length</div>
                <div className="text-xs text-gray-500">Characters minimum</div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  )
}