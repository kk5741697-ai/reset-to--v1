"use client"

import { useEffect, useRef, useState } from "react"
import { APP_CONFIG } from "@/lib/config"

interface AdBannerProps {
  adSlot?: string
  adFormat?: "auto" | "rectangle" | "vertical" | "horizontal" | "fluid"
  fullWidthResponsive?: boolean
  className?: string
  style?: React.CSSProperties
  mobileOptimized?: boolean
  sticky?: boolean
}

export function AdBanner({
  adSlot = "1234567890",
  adFormat = "auto",
  fullWidthResponsive = true,
  className = "",
  style = {},
  mobileOptimized = false,
  sticky = false
}: AdBannerProps) {
  const [isClient, setIsClient] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [shouldShowAd, setShouldShowAd] = useState(false)
  const [userEngagement, setUserEngagement] = useState(0)
  const [userEngagement, setUserEngagement] = useState(0)
  const adRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    setIsClient(true)
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    // Enhanced bounce protection for AdSense policy compliance
    let sessionStartTime = parseInt(sessionStorage.getItem('sessionStartTime') || '0')
    let pageViews = parseInt(sessionStorage.getItem('pageViews') || '0')
    let toolUsage = parseInt(sessionStorage.getItem('toolUsage') || '0')
    let fileUploads = parseInt(sessionStorage.getItem('fileUploads') || '0')
    let timeOnPage = parseInt(sessionStorage.getItem('timeOnPage') || '0')
    let fileUploads = parseInt(sessionStorage.getItem('fileUploads') || '0')
    let timeOnPage = parseInt(sessionStorage.getItem('timeOnPage') || '0')
    
    if (!sessionStartTime) {
      sessionStartTime = Date.now()
      sessionStorage.setItem('sessionStartTime', sessionStartTime.toString())
    }
    
    const currentTime = Date.now()
    const sessionDuration = currentTime - sessionStartTime
    
    // Calculate engagement score
    let engagementScore = 0
    if (sessionDuration > APP_CONFIG.minSessionTime) engagementScore += 2
    if (pageViews >= APP_CONFIG.minPageViews) engagementScore += 2
    if (toolUsage >= APP_CONFIG.minToolUsage) engagementScore += 3
    if (fileUploads > 0) engagementScore += 3
    if (timeOnPage > 60000) engagementScore += 2 // 1 minute on page
    
    // Only show ads if user has meaningful engagement
    const shouldShow = engagementScore >= 4 && sessionDuration > APP_CONFIG.minSessionTime
    if (toolUsage >= APP_CONFIG.minToolUsage) engagementScore += 3
    if (fileUploads > 0) engagementScore += 3
    if (timeOnPage > 60000) engagementScore += 2 // 1 minute on page
    
    // Only show ads if user has meaningful engagement
    const shouldShow = engagementScore >= 4 && sessionDuration > APP_CONFIG.minSessionTime
    
    setShouldShowAd(shouldShow)
    setUserEngagement(engagementScore)
    setUserEngagement(engagementScore)
    
    // Track page view
    pageViews++
    sessionStorage.setItem('pageViews', pageViews.toString())
    
    // Enhanced tracking for better engagement detection
    const trackToolUsage = () => {
      toolUsage++
      sessionStorage.setItem('toolUsage', toolUsage.toString())
    }
    
    const trackFileUpload = () => {
      fileUploads++
      sessionStorage.setItem('fileUploads', fileUploads.toString())
    }
    
    const trackTimeOnPage = () => {
      timeOnPage += 5000
      sessionStorage.setItem('timeOnPage', timeOnPage.toString())
    }
    
    const trackFileUpload = () => {
      fileUploads++
      sessionStorage.setItem('fileUploads', fileUploads.toString())
    }
    
    const trackTimeOnPage = () => {
      timeOnPage += 5000
      sessionStorage.setItem('timeOnPage', timeOnPage.toString())
    }
    
    // Listen for file uploads and tool actions
    document.addEventListener('change', (e) => {
      if (e.target instanceof HTMLInputElement && e.target.type === 'file') {
        trackFileUpload()
      }
    })
    
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      if (target.closest('[data-tool-action]') || 
          target.closest('button[type="submit"]') ||
          target.textContent?.includes('Process') ||
          target.textContent?.includes('Generate') ||
          target.textContent?.includes('Convert')) {
        trackFileUpload()
      }
    })
    
    // Track time on page
    const timeTracker = setInterval(trackTimeOnPage, 5000)
    
    return () => {
      clearInterval(timeTracker)
    }
    
    // Track time on page
    const timeTracker = setInterval(trackTimeOnPage, 5000)
    
    return () => {
      clearInterval(timeTracker)
    }
  }, [])
  useEffect(() => {
    if (isClient && adRef.current && APP_CONFIG.enableAds && APP_CONFIG.adsensePublisherId && shouldShowAd) {
      try {
        (window as any).adsbygoogle = (window as any).adsbygoogle || []
        ;(window as any).adsbygoogle.push({})
      } catch (error) {
        console.warn('AdSense initialization failed:', error)
      }
    }
  }, [isClient, shouldShowAd])

  // Don't render if ads are disabled
  if (!APP_CONFIG.enableAds || !APP_CONFIG.adsensePublisherId || !shouldShowAd) {
    return null
  }

  if (!isClient) {
    return (
      <div className={`min-h-[90px] bg-gray-50 rounded-lg ${className}`} style={style}>
        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
          Advertisement
        </div>
      </div>
    )
  }

  if (process.env.NODE_ENV === "development") {
    return (
      <div className={`bg-gray-100 border border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-600 text-sm min-h-[90px] flex items-center justify-center ${className}`}>
        <div>
          <div className="text-gray-700 font-medium mb-1">AdSense Ad Space</div>
          <div className="text-xs text-gray-500">Slot: {adSlot}</div>
          <div className="text-xs text-gray-400 mt-1">Publisher: ca-pub-4755003409431265</div>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={adRef}
      className={`ad-container ${isMobile ? 'min-h-[60px]' : 'min-h-[90px]'} flex items-center justify-center ${sticky ? 'sticky top-4' : ''} ${className}`} 
      style={style}
    >
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          textAlign: "center",
          minHeight: isMobile ? "60px" : "90px",
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