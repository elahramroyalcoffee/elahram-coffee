import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import SectionHeader from "@/components/web/ui/SectionHeader";
import { getProducts } from "@/utils/web/fetchData";
import React from "react";
import Image from "next/image";
import PrimaryButton from "@/components/web/ui/PrimaryButton";
import { GoLinkExternal } from "react-icons/go";
import ProductCard from "@/components/web/products/ProductCard";

async function SpecialProductsSection() {
  const data = await getProducts();

  console.log(data);

  return (
    <section className="py-[50px] mt-[50px]  bg-brown-500/5">
      <div className="container">
        <SectionHeader title="المنتجات المميزة" />

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full "
          dir="ltr"
        >
          <CarouselContent>
            {data?.map((product, index) => (
              <CarouselItem
                key={index}
                className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <div className="p-1 h-full">
                  <ProductCard product={product} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="border-2 text-brown-600 border-brown-400" />
          <CarouselNext className="border-2 text-brown-600 border-brown-400" />
        </Carousel>
      </div>
    </section>
  );
}

export default SpecialProductsSection;
