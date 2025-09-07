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
              // Ultimate bounce protection and quality traffic for AdSense
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
              
              // Enhanced user engagement tracking
              document.addEventListener('click', function(e) {
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
              window.addEventListener('scroll', function() {
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
              
              // Enhanced error handling for image processing
              window.addEventListener('error', function(e) {
                if (e.message && e.message.includes('out of memory')) {
                  console.warn('Memory error detected, cleaning up...');
                  // Clean up blob URLs
                  const images = document.querySelectorAll('img[src^="blob:"]');
                  images.forEach(img => {
                    if (img.src) URL.revokeObjectURL(img.src);
                  });
                  
                  // Force garbage collection if available
                  if ('gc' in window && typeof window.gc === 'function') {
                    window.gc();
                  }
                }
              });
              
              // Enhanced processing state management
              let isProcessing = false;
              document.addEventListener('click', function(e) {
                const target = e.target;
                if (target && target.textContent && 
                    (target.textContent.includes('Process') || target.textContent.includes('Generate'))) {
                  isProcessing = true;
                  setTimeout(() => { isProcessing = false; }, 30000); // Reset after 30s
                }
              });
              
              // Warn before navigation during processing
              window.addEventListener('beforeunload', function(e) {
                if (isProcessing) {
                  e.preventDefault();
                  e.returnValue = 'Processing in progress. Are you sure you want to leave?';
                  return e.returnValue;
                }
              });
              
              // Handle SPA navigation for AdSense
              let currentPath = window.location.pathname;
              
              function initAdsense() {
                const sessionDuration = Date.now() - sessionStartTime;
                const isUserActive = (Date.now() - lastActivity) < 120000; // Active within 2 minutes
                
                // Calculate comprehensive engagement score
                let engagementScore = 0;
                if (sessionDuration > 30000) engagementScore += 2; // 30 seconds
                if (pageViews >= 2) engagementScore += 2;
                if (toolUsage >= 1) engagementScore += 3;
                if (fileUploads > 0) engagementScore += 3;
                if (scrollDepth > 50) engagementScore += 1;
                if (timeOnPage > 60000) engagementScore += 2; // 1 minute
                
                const shouldShowAds = engagementScore >= 5 && isUserActive && sessionDuration > 30000;
                
                if (!shouldShowAds) {
                  console.log('User engagement insufficient for ads:', { engagementScore, sessionDuration, isUserActive });
                  return;
                }
                
                try {
                  // Initialize AdSense for SPA
                  window.adsbygoogle = window.adsbygoogle || [];
                  
                  // Rate-limited ad initialization
                  const ads = document.querySelectorAll('.adsbygoogle:not([data-adsbygoogle-status])');
                  
                  // Limit concurrent ads to prevent policy violations
                  const maxAdsPerPage = window.innerWidth < 768 ? 2 : 3;
                  const adsToInit = Array.from(ads).slice(0, maxAdsPerPage);
                  
                  adsToInit.forEach((ad, index) => {
                    try {
                      // Stagger ad initialization to prevent rapid requests
                      setTimeout(() => {
                        window.adsbygoogle.push({});
                      }, index * 1000); // 1 second delay between ads
                    } catch (e) {
                      console.warn('AdSense push failed:', e);
                    }
                  });
                  
                } catch (e) {
                  console.warn('AdSense initialization failed:', e);
                }
              }
              
              // Handle route changes for SPA
              function handleRouteChange() {
                pageViews++;
                sessionStorage.setItem('pageViews', pageViews.toString());
                
                if (window.location.pathname !== currentPath) {
                  currentPath = window.location.pathname;
                  // Longer delay for route changes to ensure quality traffic
                  setTimeout(initAdsense, 3000);
                }
              }
              
              // Detect rapid page bouncing and disable ads temporarily
              let rapidNavigationCount = 0;
              let lastNavigationTime = Date.now();
              
              function checkRapidNavigation() {
                const now = Date.now();
                if (now - lastNavigationTime < 2000) { // Less than 2 seconds
                  rapidNavigationCount++;
                  if (rapidNavigationCount > 3) {
                    // User is bouncing rapidly, disable ads for 30 seconds
                    console.log('Rapid navigation detected, temporarily disabling ads');
                    const ads = document.querySelectorAll('.adsbygoogle');
                    ads.forEach(ad => ad.style.display = 'none');
                    
                    setTimeout(() => {
                      ads.forEach(ad => ad.style.display = 'block');
                      rapidNavigationCount = 0;
                    }, 30000);
                  }
                } else {
                  rapidNavigationCount = 0;
                }
                lastNavigationTime = now;
              }
              
              // Listen for navigation changes
              window.addEventListener('popstate', function() {
                checkRapidNavigation();
                handleRouteChange();
              });
              
              // Override pushState and replaceState for programmatic navigation
              const originalPushState = history.pushState;
              const originalReplaceState = history.replaceState;
              
              history.pushState = function(...args) {
                originalPushState.apply(history, args);
                checkRapidNavigation();
                handleRouteChange();
              };
              
              history.replaceState = function(...args) {
                originalReplaceState.apply(history, args);
                checkRapidNavigation();
                handleRouteChange();
              };
              
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', function() {
                  // Delay initial ad loading to ensure quality engagement
                  setTimeout(initAdsense, 5000);
                });
              } else {
                setTimeout(initAdsense, 5000);
              }
            })();
          `}
        </Script>
      </body>
    </html>
  )
}