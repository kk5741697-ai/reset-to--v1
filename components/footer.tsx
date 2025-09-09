import Link from "next/link"
import { Wrench } from "lucide-react"
import { PersistentAdManager } from "@/components/ads/persistent-ad-manager"

const footerLinks = {
  "Tool Categories": [
    { name: "QR & Barcode Tools", href: "/qr-tools" },
    { name: "Text & Code Tools", href: "/text-tools" },
    { name: "Image Tools", href: "/image-tools" },
    { name: "PDF Tools", href: "/pdf-tools" },
    { name: "SEO Tools", href: "/seo-tools" },
    { name: "Converters", href: "/converters" },
    { name: "Utilities", href: "/utilities" },
  ],
  "Popular Tools": [
    { name: "QR Code Generator", href: "/qr-code-generator" },
    { name: "JSON Formatter", href: "/json-formatter" },
    { name: "Image Resizer", href: "/image-resizer" },
    { name: "PDF Merger", href: "/pdf-merger" },
    { name: "Password Generator", href: "/password-generator" },
  ],
  Company: [
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "API Documentation", href: "/api-docs" },
  ],
  Support: [
    { name: "Help Center", href: "/help" },
    { name: "Feature Requests", href: "/feature-requests" },
    { name: "Bug Reports", href: "/bug-reports" },
    { name: "Status Page", href: "/status" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-sidebar border-t">
      <div className="container mx-auto px-4 py-12">
        {/* Ad Banner in Footer */}
        <div className="mb-8">
          <PersistentAdManager 
            toolName="footer"
            adSlot="footer-banner"
            position="after-canvas"
            className="max-w-4xl mx-auto"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Wrench className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-heading text-xl font-bold text-sidebar-foreground">PixoraTools</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Professional online tools platform with 300+ utilities for developers, designers, and businesses.
              Trusted by millions worldwide for secure, fast, and reliable file processing.
            </p>
            <p className="text-xs text-muted-foreground">© 2024 WebTools Pro. All rights reserved.</p>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-heading font-semibold text-sidebar-foreground mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Additional Footer Content */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600 mb-2">2M+</div>
              <div className="text-sm font-medium text-gray-900">Monthly Active Users</div>
              <div className="text-xs text-gray-500">Trusted worldwide</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600 mb-2">50M+</div>
              <div className="text-sm font-medium text-gray-900">Files Processed</div>
              <div className="text-xs text-gray-500">Since 2020</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600 mb-2">99.9%</div>
              <div className="text-sm font-medium text-gray-900">Uptime</div>
              <div className="text-xs text-gray-500">Reliable service</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
