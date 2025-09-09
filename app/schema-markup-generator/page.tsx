"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, Copy, Download, Eye } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface SchemaData {
  type: string
  name: string
  description: string
  url: string
  image: string
  author: string
  datePublished: string
  dateModified: string
  publisher: string
  rating: string
  price: string
  currency: string
  availability: string
  brand: string
  model: string
  address: string
  telephone: string
  email: string
  openingHours: string
}

export default function SchemaMarkupGeneratorPage() {
  const [schemaType, setSchemaType] = useState("Article")
  const [schemaData, setSchemaData] = useState<SchemaData>({
    type: "Article",
    name: "",
    description: "",
    url: "",
    image: "",
    author: "",
    datePublished: "",
    dateModified: "",
    publisher: "",
    rating: "",
    price: "",
    currency: "USD",
    availability: "InStock",
    brand: "",
    model: "",
    address: "",
    telephone: "",
    email: "",
    openingHours: ""
  })

  const schemaTypes = [
    { value: "Article", label: "Article" },
    { value: "Product", label: "Product" },
    { value: "LocalBusiness", label: "Local Business" },
    { value: "Organization", label: "Organization" },
    { value: "Person", label: "Person" },
    { value: "Recipe", label: "Recipe" },
    { value: "Event", label: "Event" },
    { value: "Review", label: "Review" },
    { value: "FAQ", label: "FAQ" },
    { value: "BreadcrumbList", label: "Breadcrumb" }
  ]

  const generateSchema = () => {
    const schema: any = {
      "@context": "https://schema.org",
      "@type": schemaType
    }

    // Add common properties
    if (schemaData.name) schema.name = schemaData.name
    if (schemaData.description) schema.description = schemaData.description
    if (schemaData.url) schema.url = schemaData.url
    if (schemaData.image) schema.image = schemaData.image

    // Add type-specific properties
    switch (schemaType) {
      case "Article":
        if (schemaData.author) {
          schema.author = {
            "@type": "Person",
            "name": schemaData.author
          }
        }
        if (schemaData.publisher) {
          schema.publisher = {
            "@type": "Organization", 
            "name": schemaData.publisher
          }
        }
        if (schemaData.datePublished) schema.datePublished = schemaData.datePublished
        if (schemaData.dateModified) schema.dateModified = schemaData.dateModified
        break

      case "Product":
        if (schemaData.brand) schema.brand = { "@type": "Brand", "name": schemaData.brand }
        if (schemaData.model) schema.model = schemaData.model
        if (schemaData.price) {
          schema.offers = {
            "@type": "Offer",
            "price": schemaData.price,
            "priceCurrency": schemaData.currency,
            "availability": `https://schema.org/${schemaData.availability}`
          }
        }
        if (schemaData.rating) {
          schema.aggregateRating = {
            "@type": "AggregateRating",
            "ratingValue": schemaData.rating,
            "bestRating": "5"
          }
        }
        break

      case "LocalBusiness":
        if (schemaData.address) {
          schema.address = {
            "@type": "PostalAddress",
            "streetAddress": schemaData.address
          }
        }
        if (schemaData.telephone) schema.telephone = schemaData.telephone
        if (schemaData.email) schema.email = schemaData.email
        if (schemaData.openingHours) schema.openingHours = schemaData.openingHours
        break

      case "Organization":
        if (schemaData.email) schema.email = schemaData.email
        if (schemaData.telephone) schema.telephone = schemaData.telephone
        if (schemaData.address) {
          schema.address = {
            "@type": "PostalAddress",
            "streetAddress": schemaData.address
          }
        }
        break

      case "Person":
        if (schemaData.email) schema.email = schemaData.email
        if (schemaData.telephone) schema.telephone = schemaData.telephone
        break
    }

    return JSON.stringify(schema, null, 2)
  }

  const generatedSchema = generateSchema()

  const copySchema = () => {
    navigator.clipboard.writeText(generatedSchema)
    toast({
      title: "Copied to clipboard",
      description: "Schema markup copied"
    })
  }

  const downloadSchema = () => {
    const blob = new Blob([generatedSchema], { type: "application/ld+json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "schema-markup.json"
    link.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Download started",
      description: "Schema markup file downloaded"
    })
  }

  const testSchema = () => {
    const testUrl = `https://search.google.com/test/rich-results?url=${encodeURIComponent(schemaData.url || 'https://example.com')}`
    window.open(testUrl, '_blank')
  }

  const loadExample = () => {
    setSchemaType("Article")
    setSchemaData({
      ...schemaData,
      type: "Article",
      name: "10 Best SEO Practices for 2024",
      description: "Discover the latest SEO strategies and techniques to boost your website's ranking in search engines.",
      url: "https://example.com/blog/seo-practices-2024",
      image: "https://example.com/images/seo-blog-post.jpg",
      author: "John Smith",
      publisher: "Digital Marketing Blog",
      datePublished: "2024-01-15",
      dateModified: "2024-01-20"
    })
  }

  const getFieldsForType = (type: string) => {
    const commonFields = ["name", "description", "url", "image"]
    
    switch (type) {
      case "Article":
        return [...commonFields, "author", "publisher", "datePublished", "dateModified"]
      case "Product":
        return [...commonFields, "brand", "model", "price", "currency", "availability", "rating"]
      case "LocalBusiness":
        return [...commonFields, "address", "telephone", "email", "openingHours"]
      case "Organization":
        return [...commonFields, "email", "telephone", "address"]
      case "Person":
        return [...commonFields, "email", "telephone"]
      default:
        return commonFields
    }
  }

  const fieldsToShow = getFieldsForType(schemaType)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-4">
            <Code className="h-8 w-8 text-accent" />
            <h1 className="text-3xl font-heading font-bold text-foreground">Schema Markup Generator</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create structured data markup for rich snippets and better search visibility. Generate JSON-LD schema for various content types.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Configuration */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Schema Configuration</CardTitle>
                <CardDescription>Configure your structured data markup</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="schema-type">Schema Type</Label>
                  <Select value={schemaType} onValueChange={(value) => {
                    setSchemaType(value)
                    setSchemaData(prev => ({ ...prev, type: value }))
                  }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {schemaTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {fieldsToShow.includes("name") && (
                  <div>
                    <Label htmlFor="name">Name/Title *</Label>
                    <Input
                      id="name"
                      value={schemaData.name}
                      onChange={(e) => setSchemaData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter name or title"
                    />
                  </div>
                )}

                {fieldsToShow.includes("description") && (
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={schemaData.description}
                      onChange={(e) => setSchemaData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter description"
                      rows={3}
                    />
                  </div>
                )}

                {fieldsToShow.includes("url") && (
                  <div>
                    <Label htmlFor="url">URL</Label>
                    <Input
                      id="url"
                      value={schemaData.url}
                      onChange={(e) => setSchemaData(prev => ({ ...prev, url: e.target.value }))}
                      placeholder="https://example.com/page"
                      type="url"
                    />
                  </div>
                )}

                {fieldsToShow.includes("image") && (
                  <div>
                    <Label htmlFor="image">Image URL</Label>
                    <Input
                      id="image"
                      value={schemaData.image}
                      onChange={(e) => setSchemaData(prev => ({ ...prev, image: e.target.value }))}
                      placeholder="https://example.com/image.jpg"
                      type="url"
                    />
                  </div>
                )}

                {fieldsToShow.includes("author") && (
                  <div>
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      value={schemaData.author}
                      onChange={(e) => setSchemaData(prev => ({ ...prev, author: e.target.value }))}
                      placeholder="Author name"
                    />
                  </div>
                )}

                {fieldsToShow.includes("publisher") && (
                  <div>
                    <Label htmlFor="publisher">Publisher</Label>
                    <Input
                      id="publisher"
                      value={schemaData.publisher}
                      onChange={(e) => setSchemaData(prev => ({ ...prev, publisher: e.target.value }))}
                      placeholder="Publisher name"
                    />
                  </div>
                )}

                {fieldsToShow.includes("datePublished") && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date-published">Date Published</Label>
                      <Input
                        id="date-published"
                        value={schemaData.datePublished}
                        onChange={(e) => setSchemaData(prev => ({ ...prev, datePublished: e.target.value }))}
                        type="date"
                      />
                    </div>
                    <div>
                      <Label htmlFor="date-modified">Date Modified</Label>
                      <Input
                        id="date-modified"
                        value={schemaData.dateModified}
                        onChange={(e) => setSchemaData(prev => ({ ...prev, dateModified: e.target.value }))}
                        type="date"
                      />
                    </div>
                  </div>
                )}

                {fieldsToShow.includes("price") && (
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        value={schemaData.price}
                        onChange={(e) => setSchemaData(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="29.99"
                        type="number"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <Label htmlFor="currency">Currency</Label>
                      <Select value={schemaData.currency} onValueChange={(value) => setSchemaData(prev => ({ ...prev, currency: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="CAD">CAD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="availability">Availability</Label>
                      <Select value={schemaData.availability} onValueChange={(value) => setSchemaData(prev => ({ ...prev, availability: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="InStock">In Stock</SelectItem>
                          <SelectItem value="OutOfStock">Out of Stock</SelectItem>
                          <SelectItem value="PreOrder">Pre-Order</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                <Button onClick={loadExample} variant="outline" className="w-full">
                  Load Example Data
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Generated Schema */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Generated Schema Markup</CardTitle>
                <CardDescription>JSON-LD structured data for your content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={generatedSchema}
                  readOnly
                  className="min-h-[400px] font-mono text-sm"
                  placeholder="Schema markup will appear here..."
                />

                <div className="flex space-x-2">
                  <Button onClick={copySchema} variant="outline">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy JSON-LD
                  </Button>
                  <Button onClick={downloadSchema} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button onClick={testSchema} variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Test Schema
                  </Button>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-2">Implementation:</h4>
                  <ol className="text-sm text-green-800 space-y-1">
                    <li>1. Copy the JSON-LD code above</li>
                    <li>2. Add it to your HTML page's &lt;head&gt; section</li>
                    <li>3. Wrap in &lt;script type="application/ld+json"&gt; tags</li>
                    <li>4. Test with Google's Rich Results Test</li>
                  </ol>
                </div>
              </CardContent>
            </Card>

            {/* Schema Benefits */}
            <Card>
              <CardHeader>
                <CardTitle>Schema Markup Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Rich Snippets</h4>
                    <p className="text-sm text-muted-foreground">
                      Enhanced search results with additional information like ratings, prices, and images.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Better CTR</h4>
                    <p className="text-sm text-muted-foreground">
                      Rich snippets can improve click-through rates by up to 30% in search results.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Voice Search</h4>
                    <p className="text-sm text-muted-foreground">
                      Structured data helps voice assistants understand and present your content.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Knowledge Graph</h4>
                    <p className="text-sm text-muted-foreground">
                      Helps search engines include your content in knowledge panels and featured snippets.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}