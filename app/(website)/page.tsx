import React from "react";
import HeroSection from "./_components/home/HeroSection";
import CategoriesSection from "./_components/home/CategoriesSection";
import SpecialProductsSection from "./_components/home/SpecialProductsSection";

function Home() {
  return (
    <main>
      <HeroSection />
      <CategoriesSection />
      <SpecialProductsSection />
    </main>
  );
}

export default Home;
