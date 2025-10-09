import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import "./theme.css";
import { Toaster } from "@/components/ui/sonner";
import { Cairo } from "next/font/google";
import { Tajawal } from "next/font/google";
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

const cairo = Cairo({
  subsets: ["arabic", "latin"],
});
const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Al Ahram Admin Dashboard",
  description: "Secure admin dashboard for Al Ahram coffee shop management",
  other: {
    referrer: "strict-origin-when-cross-origin",
    "format-detection": "telephone=no",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${cairo.className} ${tajawal.className} antialiased`}
        suppressHydrationWarning
      >
        {children}
        <Toaster duration={5000} />
      </body>
    </html>
  );
}
