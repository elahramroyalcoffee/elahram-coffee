import React from "react";
import HeroSection from "./_components/home/HeroSection";
import CategoriesSection from "./_components/home/CategoriesSection";
import SpecialProductsSection from "./_components/home/SpecialProductsSection";
import AboutUsSection from "./_components/home/AboutUsSection";

function Home() {
  return (
    <main className="bg-beige-50">
      <HeroSection />
      <CategoriesSection />
      <SpecialProductsSection />
      <AboutUsSection />
    </main>
  );
}

export default Home;
