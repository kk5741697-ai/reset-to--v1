import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { APP_CONFIG } from "@/lib/config"
import { SecurityBanner } from "@/components/security-banner"
import Script from "next/script"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: {
    template: "%s - PixoraTools",
    default: "PixoraTools - Professional Online Tools Platform"
  },
  description:
    "Your online photo editor is here and forever free! Compress, resize, crop, convert images and more with 300+ professional tools.",
  generator: "PixoraTools",
  keywords: "image tools, pdf tools, qr generator, online tools, photo editor, image converter, pdf merger, compress image, resize image, crop image, convert image, background remover, web tools, free tools",
  robots: "index, follow",
  openGraph: {
    title: "PixoraTools - Professional Online Tools Platform",
    description: "300+ professional web tools for PDF, image, QR, code, and SEO tasks. Fast, secure, and free.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PixoraTools - Professional Online Tools",
    description: "300+ professional web tools for PDF, image, QR, code, and SEO tasks.",
  },
  verification: {
    google: "google6adf6312a96691f1",
  },
}

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    themeColor: '#3b82f6',
  }
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-adsense-account" content="ca-pub-4755003409431265" />
        <meta name="google-site-verification" content="google6adf6312a96691f1" />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4755003409431265"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-CMZ40J80GE" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-CMZ40J80GE');
          `}
        </Script>
      </head>
      <body className={`${inter.variable} ${poppins.variable} antialiased`} suppressHydrationWarning>
        <SecurityBanner />
        {children}
        <Toaster />
        
        <Script id="adsense-init" strategy="afterInteractive">
          {`
            (function() {
              // Enhanced bounce protection and quality traffic for AdSense
              let sessionStartTime = parseInt(sessionStorage.getItem('sessionStartTime') || '0');
              let pageViews = parseInt(sessionStorage.getItem('pageViews') || '0');
              let toolUsage = parseInt(sessionStorage.getItem('toolUsage') || '0');
              let fileUploads = parseInt(sessionStorage.getItem('fileUploads') || '0');
              let scrollDepth = parseInt(sessionStorage.getItem('scrollDepth') || '0');
              let timeOnPage = parseInt(sessionStorage.getItem('timeOnPage') || '0');
              let lastActivity = Date.now();
              
              if (!sessionStartTime) {
                sessionStartTime = Date.now();
                sessionStorage.setItem('sessionStartTime', sessionStartTime.toString());
              }
              
              // Enhanced user engagement tracking with rate limiting
                lastActivity = Date.now();
                lastActivity = Date.now();
                const target = e.target;
                if (target && (target.closest('[data-tool-action]') || target.closest('button'))) {
                  toolUsage++;
                  sessionStorage.setItem('toolUsage', toolUsage.toString());
                }
                
                // Track file uploads specifically
                if (target && target.closest('input[type="file"]')) {
                  fileUploads++;
                  sessionStorage.setItem('fileUploads', fileUploads.toString());
                }
              });
              
              // Track scroll depth for engagement
              let maxScroll = 0;
                lastActivity = Date.now();
                const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
                maxScroll = Math.max(maxScroll, scrollPercent);
                if (maxScroll > scrollDepth) {
                  scrollDepth = maxScroll;
                  sessionStorage.setItem('scrollDepth', scrollDepth.toString());
                }
              });
              
              // Track time on page
              setInterval(function() {
                timeOnPage += 5000;
                sessionStorage.setItem('timeOnPage', timeOnPage.toString());
              }, 5000);
              
              // Track user activity
              ['mousemove', 'keypress', 'scroll', 'click'].forEach(function(event) {
                document.addEventListener(event, function() {
                  lastActivity = Date.now();
                }, { passive: true });
              });
              
              // Handle SPA navigation for AdSense
              let currentPath = window.location.pathname;
              let rapidNavigationCount = 0;
              let lastNavigationTime = Date.now();
              
              function initAdsense() {
                const sessionDuration = Date.now() - sessionStartTime;
                const isUserActive = (Date.now() - lastActivity) < 120000; // Active within 2 minutes
                
                // Calculate comprehensive engagement score with stricter requirements
                let engagementScore = 0;
                if (sessionDuration > 45000) engagementScore += 2; // 45 seconds minimum
                if (pageViews >= 3) engagementScore += 2; // More page views required
                if (toolUsage >= 2) engagementScore += 4; // More tool usage required
                if (fileUploads > 0) engagementScore += 4; // File uploads are high value
                if (scrollDepth > 50) engagementScore += 1;
                if (timeOnPage > 90000) engagementScore += 3; // 1.5 minutes
                
                // Stricter requirements for ad display
                const shouldShowAds = engagementScore >= 7 && isUserActive && sessionDuration > 45000;
                
                if (!shouldShowAds) {
                  console.log('User engagement insufficient for ads:', { engagementScore, sessionDuration, isUserActive });
                  return;
                }
                
                try {
                  // Initialize AdSense for SPA
                  window.adsbygoogle = window.adsbygoogle || [];
                  
                  // Rate-limited ad initialization with bounce protection
                  const ads = document.querySelectorAll('.adsbygoogle:not([data-adsbygoogle-status])');
                  
                  // Stricter ad limits for tools platform
                  const maxAdsPerPage = window.innerWidth < 768 ? 1 : 2;
                  const adsToInit = Array.from(ads).slice(0, maxAdsPerPage);
                  
                  adsToInit.forEach((ad, index) => {
                    try {
                      // Longer stagger for tools platform
                      setTimeout(() => {
                        window.adsbygoogle.push({});
                      }, index * 2000); // 2 second delay between ads
                    } catch (e) {
                      console.warn('AdSense push failed:', e);
                    }
                  });
                } catch (e) {
                  
                  console.warn('AdSense initialization failed:', e);
                }
              }
              
              // Enhanced route change handling with bounce protection
              function handleRouteChange() {
                const now = Date.now();
                
                // Check for rapid navigation (bounce protection)
                if (now - lastNavigationTime < 3000) { // Less than 3 seconds
                  rapidNavigationCount++;
                  if (rapidNavigationCount > 2) {
                    // User is bouncing rapidly, delay ads significantly
                    console.log('Rapid navigation detected, delaying ads');
                    setTimeout(initAdsense, 15000); // 15 second delay
                    return;
                  }
                } else {
                  rapidNavigationCount = 0;
                }
                lastNavigationTime = now;
                
                pageViews++;
                sessionStorage.setItem('pageViews', pageViews.toString());
                
                if (window.location.pathname !== currentPath) {
                  currentPath = window.location.pathname;
                  // Much longer delay for route changes to ensure quality traffic
                  setTimeout(initAdsense, 5000);
                }
              }
              
              // Listen for navigation changes
              window.addEventListener('popstate', function() {
                handleRouteChange();
              });
              
              // Override pushState and replaceState for programmatic navigation
              const originalPushState = history.pushState;
              const originalReplaceState = history.replaceState;
              
              history.pushState = function(...args) {
                originalPushState.apply(history, args);
                handleRouteChange();
              };
              
              history.replaceState = function(...args) {
                originalReplaceState.apply(history, args);
                handleRouteChange();
              };
              
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', function() {
                  // Longer delay for initial ad loading
                  setTimeout(initAdsense, 8000);
                });
              } else {
                setTimeout(initAdsense, 8000);
              }
            })();
          `}
        </Script>
      </body>
    </html>
  )
}