"use client"

import { useEffect, useRef, useState } from "react"
import { APP_CONFIG } from "@/lib/config"
import { persistentAdManager } from "./persistent-ad-manager"

interface AdBannerProps {
  adSlot?: string
  adFormat?: "auto" | "rectangle" | "vertical" | "horizontal" | "fluid"
  fullWidthResponsive?: boolean
  className?: string
  style?: React.CSSProperties
  mobileOptimized?: boolean
  sticky?: boolean
  persistAcrossPages?: boolean
}

export function AdBanner({
  adSlot = "1234567890",
  adFormat = "auto",
  fullWidthResponsive = true,
  className = "",
  style = {},
  mobileOptimized = false,
  sticky = false,
  persistAcrossPages = false
}: AdBannerProps) {
  const [isClient, setIsClient] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [shouldShowAd, setShouldShowAd] = useState(false)
  const adRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    setIsClient(true)
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    // Use persistent ad manager for engagement tracking
    const manager = persistentAdManager
    const engagement = manager['calculateEngagementScore']?.() || 0
    const sessionTime = Date.now() - manager['state'].userEngagement.sessionStart
    
    setShouldShowAd(engagement >= 15 && sessionTime > 60000)
  }, [])
  
  useEffect(() => {
    if (isClient && shouldShowAd && adRef.current && persistAcrossPages) {
      // Check if ad is already loaded to prevent duplicate loading
      if (!persistentAdManager.isAdLoaded(adSlot)) {
        // Try to restore existing ad first
        const restoredAd = persistentAdManager.restoreAd(adSlot)
        if (restoredAd) {
          adRef.current.appendChild(restoredAd)
          return
        }
      }
    }
    
    if (isClient && adRef.current && APP_CONFIG.enableAds && APP_CONFIG.adsensePublisherId && shouldShowAd && !persistentAdManager.isAdLoaded(adSlot)) {
      try {
        // Additional delay for ad initialization
        setTimeout(() => {
          (window as any).adsbygoogle = (window as any).adsbygoogle || []
          ;(window as any).adsbygoogle.push({})
          
          // Preserve ad for cross-page persistence
          if (persistAcrossPages && adRef.current) {
            persistentAdManager.preserveAd(adSlot, adRef.current)
          }
        }, 1000)
      } catch (error) {
        console.warn('AdSense initialization failed:', error)
      }
    }
  }, [isClient, shouldShowAd, adSlot, persistAcrossPages])

  // Don't render if ads are disabled
  if (!APP_CONFIG.enableAds || !APP_CONFIG.adsensePublisherId || !shouldShowAd) {
    return null
  }

  if (!isClient) {
    return (
      <div className={`min-h-[100px] bg-gray-50 rounded-lg ${className}`} style={style}>
        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
          Loading...
        </div>
      </div>
    )
  }

  if (process.env.NODE_ENV === "development") {
    return (
      <div className={`bg-gray-100 border border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-600 text-sm min-h-[100px] flex items-center justify-center ${className}`}>
        <div>
          <div className="text-gray-700 font-medium mb-1">AdSense Ad Space</div>
          <div className="text-xs text-gray-500">Slot: {adSlot}</div>
          <div className="text-xs text-gray-400 mt-1">Publisher: ca-pub-4755003409431265</div>
          <div className="text-xs text-gray-400 mt-1">Engagement: {persistentAdManager['calculateEngagementScore']?.() || 0}/15</div>
          <div className="text-xs text-gray-400 mt-1">Persistent: {persistAcrossPages ? 'Yes' : 'No'}</div>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={adRef}
      className={`ad-container ${isMobile ? 'min-h-[80px]' : 'min-h-[100px]'} flex items-center justify-center ${sticky ? 'sticky top-4' : ''} ${className}`} 
      style={style}
    >
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          textAlign: "center",
          minHeight: isMobile ? "80px" : "100px",
          width: "100%",
          ...style
        }}
        data-ad-client="ca-pub-4755003409431265"
        data-ad-slot={adSlot}
        data-ad-format={mobileOptimized && isMobile ? "fluid" : adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
        data-ad-channel={isMobile ? "mobile" : "desktop"}
        data-adtest={process.env.NODE_ENV === "development" ? "on" : "off"}
      />
    </div>
  )
}