import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Eco-fuel Analytics - Pencatat Pengeluaran Bensin",
  description: "Aplikasi tracking konsumsi BBM dan emisi CO2 untuk lingkungan yang lebih hijau",
  keywords: ["fuel tracker", "BBM", "bensin", "CO2", "emisi", "tracking", "pengeluaran", "eco-friendly"],
  authors: [{ name: "Eco-fuel Team" }],
  creator: "Eco-fuel Analytics",
  publisher: "Eco-fuel Analytics",
  applicationName: "Eco-fuel Analytics",
  generator: "Next.js",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Eco-fuel",
  },
  formatDetection: {
    telephone: false
  },
  openGraph: {
    type: "website",
    siteName: "Eco-fuel Analytics",
    title: "Eco-fuel Analytics - Pencatat Pengeluaran Bensin",
    description: "Aplikasi tracking konsumsi BBM dan emisi CO2 untuk lingkungan yang lebih hijau",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eco-fuel Analytics",
    description: "Track konsumsi BBM dan emisi CO2",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.svg", sizes: "192x192", type: "image/svg+xml" },
      { url: "/icons/icon-512x512.svg", sizes: "512x512", type: "image/svg+xml" }
    ],
    shortcut: "/icons/icon-192x192.svg",
    apple: [
      { url: "/icons/apple-touch-icon-180x180.svg", sizes: "180x180", type: "image/svg+xml" }
    ]
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "Eco-fuel",
    "application-name": "Eco-fuel Analytics",
    "msapplication-TileColor": "#059669",
    "msapplication-TileImage": "/icons/ms-icon-144x144.svg"
  }
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/svg+xml" sizes="192x192" href="/icons/icon-192x192.svg" />
        <link rel="icon" type="image/svg+xml" sizes="512x512" href="/icons/icon-512x512.svg" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon-180x180.svg" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Eco-fuel" />
        <meta name="application-name" content="Eco-fuel Analytics" />
        <meta name="msapplication-TileColor" content="#059669" />
        <meta name="msapplication-TileImage" content="/icons/ms-icon-144x144.svg" />
      </head>
      <body className={inter.className} suppressHydrationWarning={true}>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
          {children}
        </div>
      </body>
    </html>
  );
}
