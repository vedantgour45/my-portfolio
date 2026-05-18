import { Inter, Space_Grotesk, Caveat } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const cursive = Caveat({
  subsets: ["latin"],
  variable: "--font-cursive",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://vedantgour.dev",
  ),
  title: "Vedant Gour — Frontend Developer",
  description:
    "Immersive portfolio of Vedant Gour — a frontend developer crafting performant web experiences with React, Next.js & TypeScript.",
  icons: {
    icon: "/assets/main-logo.png",
    shortcut: "/assets/main-logo.png",
    apple: "/assets/main-logo.png",
  },
  openGraph: {
    title: "Vedant Gour — Frontend Developer",
    description: "Frontend Engineer · React · Next.js · TypeScript.",
    images: ["/assets/profile.jpg"],
  },
};

export const viewport = {
  themeColor: "#0a0a0b",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${display.variable} ${cursive.variable} dark`}
    >
      <body className="font-sans antialiased overflow-x-hidden">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
