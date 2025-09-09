"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Copy, RefreshCw, Calendar } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function TimestampConverterPage() {
  const [timestamp, setTimestamp] = useState("")
  const [timezone, setTimezone] = useState("UTC")
  const [inputFormat, setInputFormat] = useState("unix")
  const [humanDate, setHumanDate] = useState("")
  const [currentTimestamp, setCurrentTimestamp] = useState("")

  useEffect(() => {
    // Update current timestamp every second
    const interval = setInterval(() => {
      setCurrentTimestamp(Math.floor(Date.now() / 1000).toString())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const convertToHuman = () => {
    try {
      let date: Date

      switch (inputFormat) {
        case "unix":
          const unixTimestamp = parseInt(timestamp)
          if (isNaN(unixTimestamp)) {
            setHumanDate("Invalid timestamp")
            return
          }
          date = new Date(unixTimestamp * 1000)
          break
        case "milliseconds":
          const msTimestamp = parseInt(timestamp)
          if (isNaN(msTimestamp)) {
            setHumanDate("Invalid timestamp")
            return
          }
          date = new Date(msTimestamp)
          break
        case "iso":
          date = new Date(timestamp)
          break
        default:
          date = new Date(timestamp)
      }

      if (isNaN(date.getTime())) {
        setHumanDate("Invalid date")
        return
      }

      // Format based on timezone
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: timezone === "UTC" ? "UTC" : undefined,
        timeZoneName: 'short'
      }

      setHumanDate(date.toLocaleString('en-US', options))
    } catch (error) {
      setHumanDate("Conversion failed")
    }
  }

  const convertToTimestamp = () => {
    try {
      const date = new Date(humanDate)
      if (isNaN(date.getTime())) {
        setTimestamp("Invalid date")
        return
      }

      switch (inputFormat) {
        case "unix":
          setTimestamp(Math.floor(date.getTime() / 1000).toString())
          break
        case "milliseconds":
          setTimestamp(date.getTime().toString())
          break
        case "iso":
          setTimestamp(date.toISOString())
          break
        default:
          setTimestamp(Math.floor(date.getTime() / 1000).toString())
      }
    } catch (error) {
      setTimestamp("Conversion failed")
    }
  }

  const copyTimestamp = () => {
    navigator.clipboard.writeText(timestamp)
    toast({
      title: "Copied to clipboard",
      description: "Timestamp copied"
    })
  }

  const copyHumanDate = () => {
    navigator.clipboard.writeText(humanDate)
    toast({
      title: "Copied to clipboard", 
      description: "Human-readable date copied"
    })
  }

  const useCurrentTime = () => {
    const now = new Date()
    setHumanDate(now.toLocaleString())
    convertToTimestamp()
  }

  const timezones = [
    "UTC",
    "America/New_York",
    "America/Los_Angeles", 
    "America/Chicago",
    "Europe/London",
    "Europe/Paris",
    "Europe/Berlin",
    "Asia/Tokyo",
    "Asia/Shanghai",
    "Asia/Kolkata",
    "Australia/Sydney"
  ]

  const quickTimestamps = [
    { name: "Now", value: Math.floor(Date.now() / 1000) },
    { name: "1 Hour Ago", value: Math.floor((Date.now() - 3600000) / 1000) },
    { name: "1 Day Ago", value: Math.floor((Date.now() - 86400000) / 1000) },
    { name: "1 Week Ago", value: Math.floor((Date.now() - 604800000) / 1000) },
    { name: "1 Month Ago", value: Math.floor((Date.now() - 2592000000) / 1000) },
    { name: "1 Year Ago", value: Math.floor((Date.now() - 31536000000) / 1000) }
  ]

  useEffect(() => {
    if (timestamp) {
      convertToHuman()
    }
  }, [timestamp, timezone, inputFormat])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-4">
            <Clock className="h-8 w-8 text-accent" />
            <h1 className="text-3xl font-heading font-bold text-foreground">Timestamp Converter</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Convert between Unix timestamps and human-readable dates with timezone support. Perfect for developers and system administrators.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Timestamp to Human */}
          <Card>
            <CardHeader>
              <CardTitle>Timestamp to Human Date</CardTitle>
              <CardDescription>Convert timestamps to readable dates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="input-format">Input Format</Label>
                <Select value={inputFormat} onValueChange={setInputFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unix">Unix Timestamp (seconds)</SelectItem>
                    <SelectItem value="milliseconds">Milliseconds</SelectItem>
                    <SelectItem value="iso">ISO 8601</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="timestamp">Timestamp</Label>
                <div className="flex space-x-2">
                  <Input
                    id="timestamp"
                    value={timestamp}
                    onChange={(e) => setTimestamp(e.target.value)}
                    placeholder="1640995200"
                    className="font-mono"
                  />
                  <Button variant="outline" onClick={() => setTimestamp(currentTimestamp)}>
                    Now
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz} value={tz}>
                        {tz}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Human Date</div>
                    <div className="font-mono text-lg">{humanDate || "Enter timestamp above"}</div>
                  </div>
                  <Button variant="outline" size="sm" onClick={copyHumanDate} disabled={!humanDate}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Human to Timestamp */}
          <Card>
            <CardHeader>
              <CardTitle>Human Date to Timestamp</CardTitle>
              <CardDescription>Convert readable dates to timestamps</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="human-date">Human Date</Label>
                <Input
                  id="human-date"
                  value={humanDate}
                  onChange={(e) => setHumanDate(e.target.value)}
                  placeholder="2024-01-01 12:00:00"
                  type="datetime-local"
                />
              </div>

              <Button onClick={useCurrentTime} variant="outline" className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                Use Current Time
              </Button>

              <Button onClick={convertToTimestamp} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Convert to Timestamp
              </Button>

              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Timestamp</div>
                    <div className="font-mono text-lg">{timestamp || "Enter date above"}</div>
                  </div>
                  <Button variant="outline" size="sm" onClick={copyTimestamp} disabled={!timestamp}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Timestamps */}
        <Card className="mt-8 max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Quick Timestamps</CardTitle>
            <CardDescription>Common timestamp values for quick reference</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {quickTimestamps.map((item) => (
                <Button
                  key={item.name}
                  variant="outline"
                  onClick={() => setTimestamp(item.value.toString())}
                  className="h-auto p-4 text-left justify-start"
                >
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-muted-foreground font-mono">{item.value}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Time Display */}
        <Card className="mt-8 max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Current Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Current Unix Timestamp</div>
                <div className="text-2xl font-mono font-bold">{currentTimestamp}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Current Date & Time</div>
                <div className="text-lg">{new Date().toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">ISO 8601 Format</div>
                <div className="text-sm font-mono">{new Date().toISOString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}