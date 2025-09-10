"use client"

import { useEffect, useRef, useState } from "react"
import { APP_CONFIG } from "@/lib/config"

interface PersistentAdContainerProps {
  adSlot: string
  position: "before-upload" | "after-upload" | "before-canvas" | "after-canvas"
  toolName: string
  className?: string
  isVisible?: boolean
}

// Global ad state to prevent reloading
const globalAdState = new Map<string, {
  element: HTMLElement | null
  isLoaded: boolean
  isVisible: boolean
}>()

export function PersistentAdContainer({ 
  adSlot, 
  position, 
  toolName, 
  className = "",
  isVisible = true 
}: PersistentAdContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [shouldShowAd, setShouldShowAd] = useState(false)
  const adKey = `${toolName}-${adSlot}-${position}`

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
    const shouldShow = timeOnPage > 20000 || // 20 seconds on page
                      pageViews > 2 || // Multiple page views
                      toolUsage > 0 // Used tools
    
    setShouldShowAd(shouldShow && APP_CONFIG.enableAds && !!APP_CONFIG.adsensePublisherId)
    
    // Track page view
    sessionStorage.setItem('pageViews', (pageViews + 1).toString())
  }, [])

  useEffect(() => {
    if (!shouldShowAd || !containerRef.current || !isVisible) return

    const existingAd = globalAdState.get(adKey)
    
    if (existingAd?.element && existingAd.isLoaded) {
      // Reuse existing ad without reloading
      if (containerRef.current && existingAd.element.parentNode !== containerRef.current) {
        // Move existing ad to new container
        containerRef.current.appendChild(existingAd.element)
        existingAd.isVisible = true
      }
      return
    }

    // Create new ad only if none exists
    if (!existingAd || !existingAd.isLoaded) {
      const adElement = document.createElement('ins')
      adElement.className = 'adsbygoogle'
      adElement.style.display = 'block'
      adElement.style.textAlign = 'center'
      adElement.style.minHeight = '90px'
      adElement.setAttribute('data-ad-client', 'ca-pub-4755003409431265')
      adElement.setAttribute('data-ad-slot', adSlot)
      adElement.setAttribute('data-ad-format', 'auto')
      adElement.setAttribute('data-full-width-responsive', 'true')
      adElement.setAttribute('data-adtest', process.env.NODE_ENV === 'development' ? 'on' : 'off')
      
      if (containerRef.current) {
        containerRef.current.appendChild(adElement)
        
        // Initialize ad only once
        try {
          (window as any).adsbygoogle = (window as any).adsbygoogle || []
          ;(window as any).adsbygoogle.push({})
          
          // Store in global state
          globalAdState.set(adKey, {
            element: adElement,
            isLoaded: true,
            isVisible: true
          })
        } catch (error) {
          console.warn('AdSense initialization failed:', error)
        }
      }
    }
  }, [shouldShowAd, adKey, isVisible])

  // Handle visibility changes without reloading ads
  useEffect(() => {
    const adState = globalAdState.get(adKey)
    if (adState?.element) {
      adState.element.style.display = isVisible ? 'block' : 'none'
      adState.isVisible = isVisible
    }
  }, [isVisible, adKey])

  if (!shouldShowAd) {
    return null
  }

  if (process.env.NODE_ENV === "development") {
    return (
      <div className={`bg-gray-100 border border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500 text-sm min-h-[90px] flex items-center justify-center ${className}`}>
        <div>
          <div className="text-gray-600 font-medium mb-1">AdSense Ad Space</div>
          <div className="text-xs text-gray-400">{adSlot} - {position}</div>
          <div className="text-xs text-gray-400 mt-1">Tool: {toolName}</div>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      className={`ad-container min-h-[90px] flex items-center justify-center ${className}`}
      data-ad-position={position}
      data-tool-name={toolName}
      data-ad-key={adKey}
      style={{ display: isVisible ? 'block' : 'none' }}
    />
  )
}