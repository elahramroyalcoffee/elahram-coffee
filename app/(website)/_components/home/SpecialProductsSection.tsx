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
import { FiShoppingCart } from "react-icons/fi";
import { MdArrowOutward } from "react-icons/md";
import Link from "next/link";
import { ProductTypes } from "@/lib/types";

function SpecialProductsSection({ data, title, className = "" }: any) {
  return (
    <section className={`py-[50px] mt-[50px]  bg-brown-500/5 ${className}`}>
      <div className="container">
        <SectionHeader title={title ? title : "المنتجات المميزة"} />

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-[75%] md:max-w-[90%] lg:max-w-[93.5%] mx-auto hidden lg:grid"
          dir="ltr"
        >
          <CarouselContent>
            {data?.map((product: ProductTypes, index: number) => (
              <CarouselItem
                key={index}
                className="md:basis-1/2 lg:basis-1/3 2xl:basis-1/4"
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

        <div className="lg:hidden grid grid-cols-2 md:grid-cols-3 gap-6">
          {data?.slice(0, 6).map((product: ProductTypes, index: number) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>

        <Link href={"/products"}>
          <PrimaryButton
            className="lg:hidden mt-10 mx-auto p-4 px-6 bg-beige-50 border-brown-500 border text-brown-500 "
            Icon={MdArrowOutward}
            text="تصفح جميع المنتجات"
          />
        </Link>
      </div>
    </section>
  );
}

export default SpecialProductsSection;
