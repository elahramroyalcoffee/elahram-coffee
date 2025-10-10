import React from "react";
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import BackToTop from "@/components/global/ui/BackToTop";

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <Header />
      {children}
      <BackToTop />
      <Footer />
    </main>
  );
}

export default RootLayout;
