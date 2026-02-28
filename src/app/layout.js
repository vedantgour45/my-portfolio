import { Inter, Space_Grotesk, Dancing_Script } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing-script",
  display: "swap",
});

export const metadata = {
  title: "Vedant Gour | Personal Portfolio",
  description:
    "A modern-day interactive portfolio experience featuring gesture control, GSAP animations, and immersive smooth scroll.",
  icons: {
    icon: "/assets/main-logo.png",
    shortcut: "/assets/main-logo.png",
    apple: "/assets/main-logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${dancingScript.variable} dark`}
    >
      <body className="font-sans antialiased overflow-x-hidden bg-black text-white">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
