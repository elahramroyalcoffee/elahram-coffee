"use client";
import React from "react";
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import BackToTop from "@/components/global/ui/BackToTop";
import Providers from "./Providers";

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-beige-50">
      <Providers>
        <Header />
        {children}
        <BackToTop />
        <Footer />
      </Providers>
    </main>
  );
}

export default RootLayout;
