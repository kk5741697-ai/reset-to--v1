export interface AppConfig {
  enableAds: boolean
  adsensePublisherId?: string
  enableAutoAds: boolean
  enableBounceProtection: boolean
  minSessionTime: number
  minPageViews: number
  minToolUsage: number
  enableAnalytics: boolean
  enableSearch: boolean
  maxFileSize: number // MB
  maxFiles: number
  supportEmail: string
  apiUrl?: string
}

export const APP_CONFIG: AppConfig = {
  enableAds: true,
  adsensePublisherId: process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || "ca-pub-4755003409431265",
  enableAutoAds: false,
  enableBounceProtection: true,
  minSessionTime: 30000, // 30 seconds minimum before showing ads
  minPageViews: 2, // Minimum page views before showing ads
  minToolUsage: 1, // Minimum tool interactions before showing ads
  enableAnalytics: true,
  enableSearch: true,
  maxFileSize: 100,
  maxFiles: 20,
  supportEmail: "support@pixoratools.com",
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
}

export function getConfig(): AppConfig {
  return APP_CONFIG
}