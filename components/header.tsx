"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Menu, 
  X, 
  Wrench, 
  FileText, 
  ImageIcon, 
  QrCode, 
  Code, 
  TrendingUp,
  Calculator,
  Star,
  Heart
} from "lucide-react"
import { useState } from "react"
import { EnhancedSearchDialog } from "@/components/enhanced-search-dialog"
import { getDomainConfig } from "@/lib/domain-config"
import { useHeaders } from "next/headers"

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // Get domain config for branding
  const host = typeof window !== "undefined" ? window.location.host : "pixoratools.com"
  const domainConfig = getDomainConfig(host)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center" style={{ backgroundColor: domainConfig.primaryColor }}>
              <Wrench className="h-5 w-5 text-white" />
            </div>
            <span className="font-heading text-xl font-bold text-foreground">{domainConfig.name}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {domainConfig.navigation.map((item) => {
              const iconMap: Record<string, any> = {
                FileText, ImageIcon, QrCode, Code, TrendingUp, Calculator
              }
              const Icon = iconMap[item.icon] || FileText
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  <Icon className={`h-4 w-4 ${item.color}`} />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Search and Actions */}
          <div className="flex items-center space-x-2">
            {/* Search Button */}
            <Button
              variant="outline"
              onClick={() => setIsSearchOpen(true)}
              className="hidden sm:flex items-center space-x-2 w-64 justify-start text-muted-foreground"
            >
              <Search className="h-4 w-4" />
              <span>Search tools...</span>
              <kbd className="ml-auto bg-muted px-1.5 py-0.5 text-xs rounded">⌘K</kbd>
            </Button>

            {/* Mobile Search */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
              className="sm:hidden"
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Mobile Menu */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden"
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t bg-background/95 backdrop-blur">
            <nav className="py-4 space-y-2">
              {domainConfig.navigation.map((item) => {
                const iconMap: Record<string, any> = {
                  FileText, ImageIcon, QrCode, Code, TrendingUp, Calculator
                }
                const Icon = iconMap[item.icon] || FileText
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  >
                    <Icon className={`h-5 w-5 ${item.color}`} />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
              
              <div className="px-4 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsSearchOpen(true)
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full justify-start"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search Tools
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>

      <EnhancedSearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </header>
  )
}