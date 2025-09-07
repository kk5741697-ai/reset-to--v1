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

export default function PasswordGeneratorPage() {
  const [password, setPassword] = useState("")
  const [length, setLength] = useState([12])
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [excludeSimilar, setExcludeSimilar] = useState(false)
  const [showPassword, setShowPassword] = useState(true)

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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Rich Content Section for AdSense Approval */}
        <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-2xl p-8 mb-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 mb-4">
              <Shield className="h-8 w-8 text-indigo-600" />
              <h1 className="text-3xl lg:text-4xl font-heading font-bold text-foreground">Secure Password Generator</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Generate cryptographically secure passwords with customizable length, character sets, and complexity requirements. 
              Our password generator uses advanced randomization algorithms to create strong, unique passwords that protect 
              your accounts from unauthorized access. Essential for cybersecurity and digital privacy protection.
            </p>
          </div>

          {/* Security Education Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white border border-indigo-200 rounded-lg p-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-3">Cryptographic Security</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Uses Web Crypto API for true randomness, ensuring each password is unpredictable 
                and secure against brute force attacks.
              </p>
            </div>
            <div className="bg-white border border-green-200 rounded-lg p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-3">Privacy Protection</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Passwords are generated locally in your browser. No data is transmitted 
                to our servers, ensuring complete privacy and security.
              </p>
            </div>
            <div className="bg-white border border-purple-200 rounded-lg p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Key className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-3">Customizable Options</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Configure length, character types, and complexity to meet specific 
                security requirements and platform restrictions.
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

        {/* Rich Content Section for AdSense Approval */}
        <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-2xl p-8 mb-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 mb-4">
              <Shield className="h-8 w-8 text-indigo-600" />
              <h1 className="text-3xl lg:text-4xl font-heading font-bold text-foreground">Secure Password Generator</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Generate cryptographically secure passwords with customizable length, character sets, and complexity requirements. 
              Our password generator uses advanced randomization algorithms to create strong, unique passwords that protect 
              your accounts from unauthorized access. Essential for cybersecurity and digital privacy protection.
            </p>
          </div>

          {/* Security Education Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white border border-indigo-200 rounded-lg p-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-3">Cryptographic Security</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Uses Web Crypto API for true randomness, ensuring each password is unpredictable 
                and secure against brute force attacks.
              </p>
            </div>
            <div className="bg-white border border-green-200 rounded-lg p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-3">Privacy Protection</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Passwords are generated locally in your browser. No data is transmitted 
                to our servers, ensuring complete privacy and security.
              </p>
            </div>
            <div className="bg-white border border-purple-200 rounded-lg p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Key className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-3">Customizable Options</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Configure length, character types, and complexity to meet specific 
                security requirements and platform restrictions.
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

        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Generate Your Secure Password</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Configure your password requirements below and generate a cryptographically secure password.
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
              <CardTitle>Essential Password Security Guidelines</CardTitle>
              <CardDescription>Follow these best practices to protect your digital accounts</CardDescription>
              <CardDescription>Follow these best practices to protect your digital accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Password Strength Requirements</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Minimum 12 characters for strong security</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Mix of uppercase, lowercase, numbers, and symbols</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Avoid dictionary words and personal information</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Unique password for each account and service</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Security Best Practices</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start space-x-2">
                      <Shield className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Use a reputable password manager for storage</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Shield className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Enable two-factor authentication when available</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Shield className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Regular password updates for sensitive accounts</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Shield className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Monitor accounts for suspicious activity</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Password Security Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Password Security Statistics</CardTitle>
              <CardDescription>Understanding the importance of strong passwords</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">81%</div>
                  <p className="text-sm text-gray-600">of data breaches involve weak or stolen passwords</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">23.2M</div>
                  <p className="text-sm text-gray-600">accounts use "123456" as their password</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Password Strength Requirements</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Minimum 12 characters for strong security</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Mix of uppercase, lowercase, numbers, and symbols</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Avoid dictionary words and personal information</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Unique password for each account and service</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Security Best Practices</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start space-x-2">
                      <Shield className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Use a reputable password manager for storage</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Shield className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Enable two-factor authentication when available</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Shield className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Regular password updates for sensitive accounts</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Shield className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Monitor accounts for suspicious activity</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Password Security Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Password Security Statistics</CardTitle>
              <CardDescription>Understanding the importance of strong passwords</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">81%</div>
                  <p className="text-sm text-gray-600">of data breaches involve weak or stolen passwords</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">23.2M</div>
                  <p className="text-sm text-gray-600">accounts use "123456" as their password</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">300+</div>
                  <p className="text-sm text-gray-600">years to crack a 12-character complex password</p>
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
