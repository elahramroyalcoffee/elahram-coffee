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
import { ProductTypes } from "@/lib/types";

async function SpecialProductsSection() {
  const data = await getProducts();

  console.log(data);
  return (
    <section className="py-[50px] mt-[50px]  bg-beige-100">
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
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1 ">
                  <Card className="bg-beige-200 rounded-[50px] rounded-tr-none">
                    <CardContent className="flex flex-col aspect-square items-center justify-center p-4">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/${product.image}`}
                        alt={product.title}
                        className="rounded-[50px] rounded-tr-none max-h-[293px] object-contain"
                        width={360}
                        height={293}
                      />
                      <div>
                        <div>
                          <span>{product.title}</span>
                          <p>{product.description}</p>
                        </div>
                        {/* <span>{product}</span> */}
                      </div>
                    </CardContent>
                  </Card>
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
