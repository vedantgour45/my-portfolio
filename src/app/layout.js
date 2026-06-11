import { Inter, Space_Grotesk, Caveat } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";
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
  title: "Vedant Gour - Personal Portfolio",
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
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#050507" },
    { media: "(prefers-color-scheme: light)", color: "#f7f6f3" },
  ],
};

// Runs before first paint so a saved light theme never flashes dark.
const themeInitScript = `(function(){try{var t=localStorage.getItem("theme");var d=t?t==="dark":true;var c=document.documentElement.classList;c.toggle("dark",d);c.toggle("light",!d);}catch(e){}})();`;

export default function RootLayout({ children }) {
  return (
    <ViewTransitions>
      <html
        lang="en"
        suppressHydrationWarning
        className={`${inter.variable} ${display.variable} ${cursive.variable} dark`}
      >
        <body className="font-sans antialiased overflow-x-hidden">
          <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <ClientLayout>{children}</ClientLayout>
        </body>
      </html>
    </ViewTransitions>
  );
}
