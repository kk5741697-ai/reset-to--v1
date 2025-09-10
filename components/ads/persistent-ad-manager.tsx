"use client"

import { useState, useEffect, useRef } from "react"
import { APP_CONFIG } from "@/lib/config"

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
  isVisible: boolean
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
    // Enhanced bounce protection for AdSense compliance
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
    const shouldShow = timeOnPage > 15000 || // 15 seconds on page
                      pageViews > 2 || // Multiple page views
                      toolUsage > 0 // Used tools
    
    setShouldShowAd(shouldShow)
    
    // Track page view
    sessionStorage.setItem('pageViews', (pageViews + 1).toString())
  }, [])

  useEffect(() => {
    if (!shouldShowAd || !adRef.current) return

    const existingAd = globalAdState.get(adKey)
    
    // Check if we're transitioning from upload to tool interface
    const isToolInterfaceTransition = position === "before-canvas" || position === "after-canvas"
    const hasUploadAd = globalAdState.has(`${toolName}-before-upload-banner`) || 
                       globalAdState.has(`${toolName}-after-upload-banner`)
    
    if (isToolInterfaceTransition && hasUploadAd) {
      // Move existing ad from upload page to tool interface
      const uploadAdKey = globalAdState.has(`${toolName}-before-upload-banner`) ? 
                         `${toolName}-before-upload-banner` : 
                         `${toolName}-after-upload-banner`
      
      const uploadAd = globalAdState.get(uploadAdKey)
      if (uploadAd?.element && uploadAd.isLoaded) {
        // Hide the upload ad and show it in the new position
        uploadAd.isVisible = false
        
        // Create reference to the same ad content
        globalAdState.set(adKey, {
          element: uploadAd.element,
          isLoaded: true,
          position,
          isVisible: true
        })
        
        // Show the ad in the new position without reloading
        if (adRef.current) {
          adRef.current.innerHTML = uploadAd.element.innerHTML
          adRef.current.className = uploadAd.element.className
        }
        return
      }
    }
    
    if (existingAd?.element && existingAd.isLoaded && existingAd.isVisible) {
      // Reuse existing ad element without reloading
      if (adRef.current && existingAd.element) {
        adRef.current.innerHTML = existingAd.element.innerHTML
        adRef.current.className = existingAd.element.className
      }
      return
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
        
        // Initialize ad only once
        try {
          (window as any).adsbygoogle = (window as any).adsbygoogle || []
          ;(window as any).adsbygoogle.push({})
          
          // Store in global state
          globalAdState.set(adKey, {
            element: adElement,
            isLoaded: true,
            position,
            isVisible: true
          })
        } catch (error) {
          console.warn('AdSense initialization failed:', error)
        }
      }
    }
  }, [shouldShowAd, adKey, position, adSlot, toolName])

  // Handle tool interface transitions
  useEffect(() => {
    const handleToolTransition = (event: CustomEvent) => {
      const { from, to, toolName: eventToolName } = event.detail
      
      if (eventToolName === toolName) {
        if (from === "upload" && to === "interface") {
          // Moving from upload to tool interface
          if (position === "before-canvas" || position === "after-canvas") {
            // This ad should now be visible in the tool interface
            const adState = globalAdState.get(adKey)
            if (adState) {
              adState.isVisible = true
            }
          }
        } else if (from === "interface" && to === "upload") {
          // Moving back to upload page
          if (position === "before-upload" || position === "after-upload") {
            // This ad should now be visible on the upload page
            const adState = globalAdState.get(adKey)
            if (adState) {
              adState.isVisible = true
            }
          }
        }
      }
    }

    window.addEventListener('tool-transition', handleToolTransition as EventListener)
    return () => window.removeEventListener('tool-transition', handleToolTransition as EventListener)
  }, [adKey, position, toolName])

  if (!shouldShowAd || !APP_CONFIG.enableAds) {
    return null
  }

  return (
    <div 
      ref={adRef}
      className={`ad-container min-h-[90px] flex items-center justify-center ${className}`}
      data-ad-position={position}
      data-tool-name={toolName}
    />
  )
}

// Utility function to trigger tool transitions
export function triggerToolTransition(from: string, to: string, toolName: string) {
  const event = new CustomEvent('tool-transition', {
    detail: { from, to, toolName }
  })
  window.dispatchEvent(event)
}