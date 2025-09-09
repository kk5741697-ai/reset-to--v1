"use client"

import { useState, useEffect, useRef } from "react"
import { APP_CONFIG } from "@/lib/config"
import { AdBanner } from "./ad-banner"

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
  private engagementThreshold = 20 // Increased threshold for better quality
  private minSessionTime = 90000 // 90 seconds minimum
  
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
    
    // Track user interactions with higher weight for file uploads
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
        this.state.userEngagement.fileUploads += 3 // Higher weight
        this.state.userEngagement.lastActivity = Date.now()
        this.evaluateAdDisplay()
      }
    })
    
    // Track scroll depth for engagement
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
        this.state.userEngagement.timeOnPage += 15000
      }
    }, 15000)
  }
  
  private evaluateAdDisplay(): void {
    const engagement = this.calculateEngagementScore()
    const sessionTime = Date.now() - this.state.userEngagement.sessionStart
    const isUserActive = (Date.now() - this.state.userEngagement.lastActivity) < 300000
    
    if (engagement >= this.engagementThreshold && 
        sessionTime > this.minSessionTime && 
        isUserActive) {
      this.initializeAds()
    }
  }
  
  calculateEngagementScore(): number {
    const { pageViews, toolUsage, fileUploads, timeOnPage, scrollDepth } = this.state.userEngagement
    const sessionTime = Date.now() - this.state.userEngagement.sessionStart
    
    let score = 0
    if (sessionTime > 60000) score += 3
    if (sessionTime > 120000) score += 4
    if (pageViews >= 2) score += 4
    if (toolUsage >= 1) score += 5
    if (fileUploads > 0) score += 8 // Highest weight for file uploads
    if (timeOnPage > 90000) score += 4
    if (scrollDepth > 60) score += 3
    
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
        }, index * 4000) // Longer delay between ads
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
  // Use regular AdBanner for now
  return (
    <AdBanner
      adSlot={adSlot}
      adFormat={adFormat}
      className={className}
      mobileOptimized={mobileOptimized}
    />
  )
}