"use client"

import { useState, useEffect, useRef } from "react"
import { APP_CONFIG } from "@/lib/config"

interface PersistentAdState {
  adSlots: Map<string, HTMLElement>
  loadedAds: Set<string>
  userEngagement: {
    sessionStart: number
    pageViews: number
    toolUsage: number
    fileUploads: number
    timeOnPage: number
    scrollDepth: number
    lastActivity: number
  }
}

class PersistentAdManager {
  private static instance: PersistentAdManager
  private state: PersistentAdState
  private engagementThreshold = 15 // Increased threshold
  private minSessionTime = 60000 // 60 seconds minimum
  
  private constructor() {
    this.state = {
      adSlots: new Map(),
      loadedAds: new Set(),
      userEngagement: {
        sessionStart: Date.now(),
        pageViews: 0,
        toolUsage: 0,
        fileUploads: 0,
        timeOnPage: 0,
        scrollDepth: 0,
        lastActivity: Date.now()
      }
    }
    
    this.initializeTracking()
  }
  
  static getInstance(): PersistentAdManager {
    if (!this.instance) {
      this.instance = new PersistentAdManager()
    }
    return this.instance
  }
  
  private initializeTracking(): void {
    if (typeof window === "undefined") return
    
    // Track page views
    this.state.userEngagement.pageViews++
    
    // Track user interactions
    document.addEventListener('click', (e) => {
      this.state.userEngagement.lastActivity = Date.now()
      
      const target = e.target as HTMLElement
      if (target.closest('[data-tool-action]') || 
          target.closest('button') ||
          target.textContent?.includes('Process') ||
          target.textContent?.includes('Generate') ||
          target.textContent?.includes('Convert')) {
        this.state.userEngagement.toolUsage++
        this.evaluateAdDisplay()
      }
    })
    
    // Track file uploads (highest value action)
    document.addEventListener('change', (e) => {
      if (e.target instanceof HTMLInputElement && e.target.type === 'file') {
        this.state.userEngagement.fileUploads++
        this.state.userEngagement.lastActivity = Date.now()
        this.evaluateAdDisplay()
      }
    })
    
    // Track scroll depth
    let maxScroll = 0
    window.addEventListener('scroll', () => {
      this.state.userEngagement.lastActivity = Date.now()
      const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100)
      maxScroll = Math.max(maxScroll, scrollPercent)
      this.state.userEngagement.scrollDepth = maxScroll
    }, { passive: true })
    
    // Track time on page
    setInterval(() => {
      if (document.visibilityState === 'visible') {
        this.state.userEngagement.timeOnPage += 10000
      }
    }, 10000)
  }
  
  private evaluateAdDisplay(): void {
    const engagement = this.calculateEngagementScore()
    const sessionTime = Date.now() - this.state.userEngagement.sessionStart
    const isUserActive = (Date.now() - this.state.userEngagement.lastActivity) < 180000
    
    if (engagement >= this.engagementThreshold && 
        sessionTime > this.minSessionTime && 
        isUserActive) {
      this.initializeAds()
    }
  }
  
  private calculateEngagementScore(): number {
    const { pageViews, toolUsage, fileUploads, timeOnPage, scrollDepth } = this.state.userEngagement
    const sessionTime = Date.now() - this.state.userEngagement.sessionStart
    
    let score = 0
    if (sessionTime > 45000) score += 2
    if (sessionTime > 90000) score += 3
    if (pageViews >= 2) score += 3
    if (toolUsage >= 1) score += 4
    if (fileUploads > 0) score += 6
    if (timeOnPage > 60000) score += 3
    if (scrollDepth > 50) score += 2
    
    return score
  }
  
  private initializeAds(): void {
    if (!APP_CONFIG.enableAds || this.state.loadedAds.size > 0) return
    
    try {
      window.adsbygoogle = window.adsbygoogle || []
      
      const ads = document.querySelectorAll('.adsbygoogle:not([data-adsbygoogle-status])')
      const maxAds = window.innerWidth < 768 ? 1 : 2
      
      Array.from(ads).slice(0, maxAds).forEach((ad, index) => {
        setTimeout(() => {
          try {
            window.adsbygoogle.push({})
            this.state.loadedAds.add(ad.getAttribute('data-ad-slot') || 'unknown')
          } catch (e) {
            console.warn('AdSense push failed:', e)
          }
        }, index * 3000)
      })
    } catch (e) {
      console.warn('AdSense initialization failed:', e)
    }
  }
  
  // Persist ads across page transitions
  preserveAd(adSlot: string, element: HTMLElement): void {
    this.state.adSlots.set(adSlot, element.cloneNode(true) as HTMLElement)
  }
  
  restoreAd(adSlot: string): HTMLElement | null {
    return this.state.adSlots.get(adSlot) || null
  }
  
  isAdLoaded(adSlot: string): boolean {
    return this.state.loadedAds.has(adSlot)
  }
}

export const persistentAdManager = PersistentAdManager.getInstance()

interface PersistentAdBannerProps {
  adSlot: string
  adFormat?: "auto" | "rectangle" | "horizontal" | "fluid"
  className?: string
  mobileOptimized?: boolean
  persistAcrossPages?: boolean
}

export function PersistentAdBanner({
  adSlot,
  adFormat = "auto",
  className = "",
  mobileOptimized = false,
  persistAcrossPages = true
}: PersistentAdBannerProps) {
  const [isClient, setIsClient] = useState(false)
  const [shouldShow, setShouldShow] = useState(false)
  const adRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    setIsClient(true)
    
    // Check if we should show ads based on engagement
    const manager = persistentAdManager
    const engagement = manager['calculateEngagementScore']?.() || 0
    const sessionTime = Date.now() - manager['state'].userEngagement.sessionStart
    
    setShouldShow(engagement >= 15 && sessionTime > 60000)
  }, [])
  
  useEffect(() => {
    if (isClient && shouldShow && adRef.current && persistAcrossPages) {
      // Try to restore existing ad first
      const restoredAd = persistentAdManager.restoreAd(adSlot)
      if (restoredAd && !persistentAdManager.isAdLoaded(adSlot)) {
        adRef.current.appendChild(restoredAd)
      }
    }
  }, [isClient, shouldShow, adSlot, persistAcrossPages])
  
  if (!APP_CONFIG.enableAds || !isClient || !shouldShow) {
    return null
  }
  
  if (process.env.NODE_ENV === "development") {
    return (
      <div className={`bg-gray-100 border border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500 text-sm min-h-[100px] flex items-center justify-center ${className}`}>
        <div>
          <div className="text-gray-600 font-medium mb-1">Persistent AdSense Ad</div>
          <div className="text-xs text-gray-400">Slot: {adSlot}</div>
          <div className="text-xs text-gray-400">Engagement Score: {persistentAdManager['calculateEngagementScore']?.() || 0}/15</div>
        </div>
      </div>
    )
  }
  
  return (
    <div ref={adRef} className={`ad-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          textAlign: "center",
          minHeight: mobileOptimized && window.innerWidth < 768 ? "80px" : "100px",
          width: "100%"
        }}
        data-ad-client="ca-pub-4755003409431265"
        data-ad-slot={adSlot}
        data-ad-format={mobileOptimized && window.innerWidth < 768 ? "fluid" : adFormat}
        data-full-width-responsive="true"
        data-adtest={process.env.NODE_ENV === "development" ? "on" : "off"}
      />
    </div>
  )
}