// Enhanced configuration for AdSense compliance and multi-domain support
export const APP_CONFIG = {
  // AdSense Configuration
  enableAds: true,
  adsensePublisherId: "ca-pub-4755003409431265",
  enableAutoAds: false, // Disabled for better control
  
  // Bounce Protection Settings (Critical for AdSense approval)
  minSessionTime: 45000, // 45 seconds minimum before showing ads
  minPageViews: 3, // Minimum page views before ads
  minToolUsage: 2, // Minimum tool interactions before ads
  maxAdsPerPage: 2, // Further reduced for tools platform
  adRefreshInterval: 90000, // 90 seconds between refreshes
  
  // Quality Traffic Settings
  enableBounceProtection: true,
  enableEngagementTracking: true,
  enableQualityMetrics: true,
  enableFileUploadTracking: true,
  enableTimeOnPageTracking: true,
  
  // Content Quality Settings
  enableRichContent: true,
  enableEducationalContent: true,
  enableUniqueContent: true,
  enableToolSpecificContent: true,
  
  // Multi-domain Configuration
  domains: {
    "pixoratools.com": {
      name: "PixoraTools",
      category: "all",
      primaryColor: "#3b82f6",
      description: "Professional online tools platform with 300+ utilities",
      enabledCategories: ["PDF", "IMAGE", "QR", "TEXT", "SEO", "UTILITIES"],
    },
    "pixorapdf.com": {
      name: "PixoraPDF", 
      category: "pdf",
      primaryColor: "#dc2626",
      description: "Professional PDF tools for merging, splitting, and converting",
      enabledCategories: ["PDF"],
    },
    "pixoraimg.com": {
      name: "PixoraIMG",
      category: "image", 
      primaryColor: "#7c3aed",
      description: "Advanced image editing and optimization tools",
      enabledCategories: ["IMAGE"],
    },
    "pixoraqrcode.com": {
      name: "PixoraQR",
      category: "qr",
      primaryColor: "#059669", 
      description: "QR code and barcode generation tools",
      enabledCategories: ["QR"],
    },
    "pixoracode.com": {
      name: "PixoraCode",
      category: "code",
      primaryColor: "#ea580c",
      description: "Code formatting and development tools", 
      enabledCategories: ["TEXT"],
    },
    "pixoraseo.com": {
      name: "PixoraSEO",
      category: "seo", 
      primaryColor: "#0891b2",
      description: "SEO analysis and optimization tools",
      enabledCategories: ["SEO"],
    },
  },
  
  // Tool Configuration
  maxFileSize: 100 * 1024 * 1024, // 100MB
  maxFiles: 20,
  supportedFormats: {
    image: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    pdf: ["application/pdf"],
    text: ["text/plain", "application/json", "text/html", "text/css"],
  },
}

export function getDomainConfig(hostname: string) {
  const cleanHost = hostname.split(':')[0]
  return APP_CONFIG.domains[cleanHost] || APP_CONFIG.domains["pixoratools.com"]
}