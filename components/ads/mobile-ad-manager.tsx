"use client"

import { useEffect, useState } from "react"
import { AdBanner } from "./ad-banner"

interface MobileAdManagerProps {
  toolName: string
  showBottomBanner?: boolean
  showSidebarAd?: boolean
}

export function MobileAdManager({
  toolName,
  showBottomBanner = true,
  showSidebarAd = true
}: MobileAdManagerProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (!isMobile) return null

  return (
    <>
      {showBottomBanner && (
        <div className="mobile-bottom-ad">
          <AdBanner
            adSlot={`${toolName}-mobile-bottom`}
            adFormat="fluid"
            mobileOptimized={true}
          />
        </div>
      )}
      
      {showSidebarAd && (
        <div className="mobile-sidebar-ad">
          <AdBanner
            adSlot={`${toolName}-mobile-sidebar`}
            adFormat="auto"
            mobileOptimized={true}
          />
        </div>
      )}
    </>
  )
}