import React from "react";
import HeroSection from "./_components/home/HeroSection";
import CategoriesSection from "./_components/home/CategoriesSection";
import SpecialProductsSection from "./_components/home/SpecialProductsSection";
import AboutUsSection from "./_components/home/AboutUsSection";
import { getProducts } from "@/utils/web/fetchData";

async function Home() {
  const data = await getProducts();

  return (
    <main className="bg-beige-50">
      <HeroSection />
      <CategoriesSection />
      <SpecialProductsSection data={data} />
      <AboutUsSection />
    </main>
  );
}

export default Home;
