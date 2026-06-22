import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from "@/components/theme-provider";
import { SplashScreen } from "@/components/ui/splash-screen";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://coding-junction.in'),
  title: {
    default: "Coding Junction | UIT Burdwan",
    template: "%s | Coding Junction",
  },
  description: "Coding Junction is the official tech community of University Institute of Technology, Burdwan. Join us for hackathons, workshops, and open source development.",
  keywords: ["Coding Junction", "UIT Burdwan", "Tech Community", "Hackathon", "Open Source", "Coding Club"],
  authors: [{ name: "Coding Junction" }],
  creator: "Coding Junction",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://coding-junction.in",
    title: "Coding Junction | UIT Burdwan",
    description: "The official tech community of University Institute of Technology, Burdwan. Join us for hackathons, workshops, and open source development.",
    siteName: "Coding Junction",
  },
  twitter: {
    card: "summary_large_image",
    title: "Coding Junction | UIT Burdwan",
    description: "The official tech community of University Institute of Technology, Burdwan. Join us for hackathons, workshops, and open source development.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/CodingJunction_withoutText_neonBackground.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/CodingJunction_withoutText_neonBackground.png',
  },
  verification: {
    google: "2DqIo8ZkJd2Nn5PHUbNYz0eLGp7HCBERQiDyG97LyI0",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Coding Junction",
              "url": "https://coding-junction.in",
              "logo": "https://coding-junction.in/CodingJunction_withText_blackBackground.png",
              "sameAs": [
                "https://github.com/your-org",
                "https://linkedin.com/company/your-org"
              ]
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Coding Junction",
              "url": "https://coding-junction.in",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://coding-junction.in/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider>
            <SplashScreen />
            {children}
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
