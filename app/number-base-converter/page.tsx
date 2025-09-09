"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Hash, Copy, RefreshCw } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function NumberBaseConverterPage() {
  const [inputValue, setInputValue] = useState("255")
  const [inputBase, setInputBase] = useState("10")
  const [results, setResults] = useState({
    binary: "",
    octal: "",
    decimal: "",
    hexadecimal: ""
  })

  const bases = [
    { value: "2", label: "Binary (Base 2)" },
    { value: "8", label: "Octal (Base 8)" },
    { value: "10", label: "Decimal (Base 10)" },
    { value: "16", label: "Hexadecimal (Base 16)" }
  ]

  useEffect(() => {
    convertNumber()
  }, [inputValue, inputBase])

  const convertNumber = () => {
    try {
      if (!inputValue.trim()) {
        setResults({ binary: "", octal: "", decimal: "", hexadecimal: "" })
        return
      }

      // Parse input based on base
      let decimalValue: number

      switch (inputBase) {
        case "2":
          if (!/^[01]+$/.test(inputValue)) {
            throw new Error("Invalid binary number")
          }
          decimalValue = parseInt(inputValue, 2)
          break
        case "8":
          if (!/^[0-7]+$/.test(inputValue)) {
            throw new Error("Invalid octal number")
          }
          decimalValue = parseInt(inputValue, 8)
          break
        case "10":
          decimalValue = parseInt(inputValue, 10)
          if (isNaN(decimalValue)) {
            throw new Error("Invalid decimal number")
          }
          break
        case "16":
          if (!/^[0-9A-Fa-f]+$/.test(inputValue)) {
            throw new Error("Invalid hexadecimal number")
          }
          decimalValue = parseInt(inputValue, 16)
          break
        default:
          throw new Error("Invalid base")
      }

      if (decimalValue < 0) {
        throw new Error("Negative numbers not supported")
      }

      if (decimalValue > Number.MAX_SAFE_INTEGER) {
        throw new Error("Number too large")
      }

      // Convert to all bases
      setResults({
        binary: decimalValue.toString(2),
        octal: decimalValue.toString(8),
        decimal: decimalValue.toString(10),
        hexadecimal: decimalValue.toString(16).toUpperCase()
      })
    } catch (error) {
      setResults({ binary: "Error", octal: "Error", decimal: "Error", hexadecimal: "Error" })
    }
  }

  const copyResult = (value: string, base: string) => {
    navigator.clipboard.writeText(value)
    toast({
      title: "Copied to clipboard",
      description: `${base} value copied`
    })
  }

  const loadExample = (value: string, base: string) => {
    setInputValue(value)
    setInputBase(base)
  }

  const examples = [
    { name: "Binary Example", value: "11111111", base: "2" },
    { name: "Octal Example", value: "377", base: "8" },
    { name: "Decimal Example", value: "255", base: "10" },
    { name: "Hex Example", value: "FF", base: "16" }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-4">
            <Hash className="h-8 w-8 text-accent" />
            <h1 className="text-3xl font-heading font-bold text-foreground">Number Base Converter</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Convert numbers between different bases: binary, decimal, hexadecimal, and octal. Essential for programming and computer science.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle>Number Input</CardTitle>
              <CardDescription>Enter a number in any base to convert</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="input-value">Number</Label>
                  <Input
                    id="input-value"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value.toUpperCase())}
                    placeholder="Enter number"
                    className="font-mono text-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="input-base">Input Base</Label>
                  <Select value={inputBase} onValueChange={setInputBase}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {bases.map((base) => (
                        <SelectItem key={base.value} value={base.value}>
                          {base.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={convertNumber} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Convert Number
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Binary (Base 2)
                  <Button variant="outline" size="sm" onClick={() => copyResult(results.binary, "Binary")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="font-mono text-lg break-all">{results.binary || "0"}</div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Used in computer science and digital electronics
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Octal (Base 8)
                  <Button variant="outline" size="sm" onClick={() => copyResult(results.octal, "Octal")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="font-mono text-lg">{results.octal || "0"}</div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Common in Unix file permissions and legacy systems
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Decimal (Base 10)
                  <Button variant="outline" size="sm" onClick={() => copyResult(results.decimal, "Decimal")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="font-mono text-lg">{results.decimal || "0"}</div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Standard number system used in everyday mathematics
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Hexadecimal (Base 16)
                  <Button variant="outline" size="sm" onClick={() => copyResult(results.hexadecimal, "Hexadecimal")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="font-mono text-lg">{results.hexadecimal || "0"}</div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Used in programming, web colors, and memory addresses
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Examples */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Examples</CardTitle>
              <CardDescription>Common number base conversions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {examples.map((example) => (
                  <Button
                    key={example.name}
                    variant="outline"
                    onClick={() => loadExample(example.value, example.base)}
                    className="h-auto p-4 text-left justify-start"
                  >
                    <div>
                      <div className="font-medium text-sm">{example.name}</div>
                      <div className="text-xs text-muted-foreground font-mono">{example.value}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reference Table */}
          <Card>
            <CardHeader>
              <CardTitle>Number Base Reference</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Decimal</th>
                      <th className="text-left p-2">Binary</th>
                      <th className="text-left p-2">Octal</th>
                      <th className="text-left p-2">Hexadecimal</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono">
                    {Array.from({ length: 16 }, (_, i) => (
                      <tr key={i} className="border-b hover:bg-muted/50">
                        <td className="p-2">{i}</td>
                        <td className="p-2">{i.toString(2).padStart(4, '0')}</td>
                        <td className="p-2">{i.toString(8)}</td>
                        <td className="p-2">{i.toString(16).toUpperCase()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}