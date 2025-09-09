"use client"

import { useState, useEffect, useRef } from "react"
import { AdBanner } from "./ad-banner"

interface PersistentAdManagerProps {
  toolName: string
  adSlot: string
  className?: string
  position: "before-upload" | "after-upload" | "before-canvas" | "after-canvas"
}

// Global ad state to persist ads across tool interface changes
const globalAdState = new Map<string, {
  element: HTMLElement | null
  isLoaded: boolean
  position: string
}>()

export function PersistentAdManager({ 
  toolName, 
  adSlot, 
  className = "", 
  position 
}: PersistentAdManagerProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [shouldShowAd, setShouldShowAd] = useState(false)
  const adRef = useRef<HTMLDivElement>(null)
  const adKey = `${toolName}-${adSlot}`

  useEffect(() => {
    // Enhanced bounce protection
    const sessionStartTime = parseInt(sessionStorage.getItem('sessionStartTime') || '0')
    const pageViews = parseInt(sessionStorage.getItem('pageViews') || '0')
    const toolUsage = parseInt(sessionStorage.getItem('toolUsage') || '0')
    const timeOnPage = Date.now() - (parseInt(sessionStorage.getItem('pageLoadTime') || '0'))
    
    if (!sessionStartTime) {
      sessionStorage.setItem('sessionStartTime', Date.now().toString())
    }
    
    if (!sessionStorage.getItem('pageLoadTime')) {
      sessionStorage.setItem('pageLoadTime', Date.now().toString())
    }
    
    // Only show ads if user has engaged meaningfully
    const shouldShow = timeOnPage > 20000 || // 20 seconds on page
                      pageViews > 2 || // Multiple page views
                      toolUsage > 0 // Used tools
    
    setShouldShowAd(shouldShow)
    
    // Track page view
    sessionStorage.setItem('pageViews', (pageViews + 1).toString())
  }, [])

  useEffect(() => {
    if (!shouldShowAd || !adRef.current) return

    const existingAd = globalAdState.get(adKey)
    
    if (existingAd?.element && existingAd.isLoaded) {
      // Reuse existing ad element instead of creating new one
      if (position === "before-canvas" || position === "after-canvas") {
        // Move existing ad to new position without reloading
        const adElement = existingAd.element.cloneNode(true) as HTMLElement
        adRef.current.appendChild(adElement)
        return
      }
    }

    // Only create new ad if none exists
    if (!existingAd || !existingAd.isLoaded) {
      const adElement = document.createElement('div')
      adElement.className = 'adsbygoogle'
      adElement.style.display = 'block'
      adElement.setAttribute('data-ad-client', 'ca-pub-4755003409431265')
      adElement.setAttribute('data-ad-slot', adSlot)
      adElement.setAttribute('data-ad-format', 'auto')
      adElement.setAttribute('data-full-width-responsive', 'true')
      
      if (adRef.current) {
        adRef.current.appendChild(adElement)
        
        // Initialize ad
        try {
          (window as any).adsbygoogle = (window as any).adsbygoogle || []
          ;(window as any).adsbygoogle.push({})
          
          // Store in global state
          globalAdState.set(adKey, {
            element: adElement,
            isLoaded: true,
            position
          })
        } catch (error) {
          console.warn('AdSense initialization failed:', error)
        }
      }
    }
  }, [shouldShowAd, adKey, position, adSlot])

  if (!shouldShowAd) {
    return null
  }

  return (
    <div 
      ref={adRef}
      className={`ad-container min-h-[90px] flex items-center justify-center ${className}`}
    />
  )
}