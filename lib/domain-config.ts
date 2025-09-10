export interface DomainConfig {
  host: string
  name: string
  category: string
  primaryColor: string
  logo: string
  enabledCategories: string[]
  seoDefaults: {
    title: string
    description: string
    keywords: string[]
  }
  navigation: Array<{
    name: string
    href: string
    icon: string
    color: string
  }>
}

export const DOMAIN_CONFIGS: Record<string, DomainConfig> = {
  "pixoratools.com": {
    host: "pixoratools.com",
    name: "PixoraTools",
    category: "all",
    primaryColor: "#3b82f6",
    logo: "/logos/pixora-tools.svg",
    enabledCategories: ["PDF", "IMAGE", "QR", "CODE", "SEO", "NETWORK", "UTILITIES"],
    seoDefaults: {
      title: "PixoraTools - Professional Online Tools Platform",
      description: "300+ professional web tools for PDF, image, QR, code, SEO, and utility operations. Fast, secure, and free.",
      keywords: ["online tools", "web tools", "PDF tools", "image tools", "QR generator", "code formatter"]
    },
    navigation: [
      { name: "PDF Tools", href: "/pdf-tools", icon: "FileText", color: "text-red-600" },
      { name: "Image Tools", href: "/image-tools", icon: "ImageIcon", color: "text-blue-600" },
      { name: "QR Tools", href: "/qr-tools", icon: "QrCode", color: "text-green-600" },
      { name: "Code Tools", href: "/code-tools", icon: "Code", color: "text-yellow-600" },
      { name: "SEO Tools", href: "/seo-tools", icon: "TrendingUp", color: "text-cyan-600" },
      { name: "Utilities", href: "/utilities", icon: "Calculator", color: "text-purple-600" }
    ]
  },
  "pixorapdf.com": {
    host: "pixorapdf.com",
    name: "PixoraPDF",
    category: "pdf",
    primaryColor: "#dc2626",
    logo: "/logos/pixora-pdf.svg",
    enabledCategories: ["PDF"],
    seoDefaults: {
      title: "PixoraPDF - Professional PDF Tools Online",
      description: "Merge, split, compress, convert, and edit PDF files online. Fast, secure, and free PDF tools.",
      keywords: ["PDF tools", "merge PDF", "split PDF", "compress PDF", "PDF converter", "PDF editor"]
    },
    navigation: [
      { name: "Merge PDF", href: "/pdf-merge", icon: "FileText", color: "text-red-600" },
      { name: "Split PDF", href: "/pdf-split", icon: "Scissors", color: "text-red-600" },
      { name: "Compress PDF", href: "/pdf-compress", icon: "Archive", color: "text-red-600" },
      { name: "Convert PDF", href: "/pdf-convert", icon: "RefreshCw", color: "text-red-600" }
    ]
  },
  "pixoraimg.com": {
    host: "pixoraimg.com",
    name: "PixoraIMG",
    category: "image",
    primaryColor: "#7c3aed",
    logo: "/logos/pixora-img.svg",
    enabledCategories: ["IMAGE"],
    seoDefaults: {
      title: "PixoraIMG - Professional Image Tools Online",
      description: "Resize, compress, convert, crop, and edit images online. Support for JPG, PNG, WebP, and more.",
      keywords: ["image tools", "resize image", "compress image", "image converter", "photo editor", "crop image"]
    },
    navigation: [
      { name: "Compress Image", href: "/image-compress", icon: "Archive", color: "text-purple-600" },
      { name: "Resize Image", href: "/image-resize", icon: "Maximize", color: "text-purple-600" },
      { name: "Crop Image", href: "/image-crop", icon: "Crop", color: "text-purple-600" },
      { name: "Convert Image", href: "/image-convert", icon: "RefreshCw", color: "text-purple-600" }
    ]
  },
  "pixoraqrcode.com": {
    host: "pixoraqrcode.com",
    name: "PixoraQRCode",
    category: "qr",
    primaryColor: "#059669",
    logo: "/logos/pixora-qr.svg",
    enabledCategories: ["QR"],
    seoDefaults: {
      title: "PixoraQRCode - QR Code & Barcode Generator",
      description: "Generate custom QR codes with logos, colors, and tracking. Support for WiFi, vCard, URL, and more.",
      keywords: ["QR code generator", "barcode generator", "custom QR codes", "QR scanner", "WiFi QR", "vCard QR"]
    },
    navigation: [
      { name: "QR Generator", href: "/qr-code-generator", icon: "QrCode", color: "text-green-600" },
      { name: "WiFi QR", href: "/wifi-qr-generator", icon: "Wifi", color: "text-green-600" },
      { name: "vCard QR", href: "/vcard-qr-generator", icon: "User", color: "text-green-600" },
      { name: "Bulk QR", href: "/bulk-qr-generator", icon: "Grid", color: "text-green-600" }
    ]
  },
  "pixoracode.com": {
    host: "pixoracode.com",
    name: "PixoraCode",
    category: "code",
    primaryColor: "#ea580c",
    logo: "/logos/pixora-code.svg",
    enabledCategories: ["CODE"],
    seoDefaults: {
      title: "PixoraCode - Code Formatting & Development Tools",
      description: "Format, beautify, minify, and validate JSON, HTML, CSS, JavaScript, and more. Developer tools online.",
      keywords: ["code formatter", "JSON beautifier", "HTML formatter", "CSS minifier", "developer tools", "code validator"]
    },
    navigation: [
      { name: "JSON Formatter", href: "/json-formatter", icon: "Braces", color: "text-orange-600" },
      { name: "HTML Formatter", href: "/html-formatter", icon: "Code", color: "text-orange-600" },
      { name: "CSS Minifier", href: "/css-minifier", icon: "Palette", color: "text-orange-600" },
      { name: "JS Minifier", href: "/js-minifier", icon: "FileCode", color: "text-orange-600" }
    ]
  },
  "pixoraseo.com": {
    host: "pixoraseo.com",
    name: "PixoraSEO",
    category: "seo",
    primaryColor: "#0891b2",
    logo: "/logos/pixora-seo.svg",
    enabledCategories: ["SEO"],
    seoDefaults: {
      title: "PixoraSEO - SEO Analysis & Optimization Tools",
      description: "Analyze, optimize, and monitor your website SEO. Meta tag generator, sitemap creator, and more.",
      keywords: ["SEO tools", "meta tag generator", "SEO analysis", "sitemap generator", "SEO optimization", "keyword density"]
    },
    navigation: [
      { name: "Meta Generator", href: "/seo-meta-generator", icon: "TrendingUp", color: "text-cyan-600" },
      { name: "Sitemap Generator", href: "/sitemap-generator", icon: "Map", color: "text-cyan-600" },
      { name: "Keyword Density", href: "/keyword-density-checker", icon: "Search", color: "text-cyan-600" },
      { name: "Schema Markup", href: "/schema-markup-generator", icon: "Code", color: "text-cyan-600" }
    ]
  }
}

export function getDomainConfig(host: string): DomainConfig {
  const cleanHost = host.split(":")[0]
  return DOMAIN_CONFIGS[cleanHost] || DOMAIN_CONFIGS["pixoratools.com"]
}

export function isGlobalDomain(host: string): boolean {
  const cleanHost = host.split(":")[0]
  return cleanHost === "localhost" || cleanHost === "pixoratools.com"
}