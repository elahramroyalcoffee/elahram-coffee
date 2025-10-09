import React from "react";
import hero from "@/public/home/hero.svg";
import Image from "next/image";
import { BsCart2 } from "react-icons/bs";
import PrimaryButton from "@/components/web/ui/PrimaryButton";
import Link from "next/link";
import { PiCoffeeFill } from "react-icons/pi";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import beans from "@/public/home/categories/1.png";
import turkish from "@/public/home/categories/2.png";
import spresso from "@/public/home/categories/3.png";

function HeroSection() {
  return (
    <section className="h-lvh hero-section">
      <div className="flex flex-center  h-[calc(100vh-20vh)] md:h-[calc(100vh-15vh)] gap-20  z-10 relative text-white ">
        <div className="hidden  w-[45%]">
          <Image src={hero} alt="hero image" className="w-full" />
        </div>
        <div className="flex-center lg:flex-between w-full container max-w-7xl gap-16 ">
          <div className="self-center flex flex-col flex-center text-center lg:text-start lg:flex-center-reset  max-w-[600px] px-4">
            <h1 className="text-[34px] sm:text-[44px] font-bold">
              البن مزاج… وإنت مزاجك عندنا
            </h1>
            <p className=" text-[18px] sm:text-2xl mt-6 text-white/60 leading-9 ">
              نستورد أجود حبوب القهوة العالمية ليتم تحميصها وطحنها بعناية ودقة
              وبخبرة <b>35 عاما</b> من شغفنا بالقهوة نفخر بحفاظنا على مذاق متميز
              وسعى دائم لارضاء كافة الأذواق من عشاق القهوة
            </p>
            <div className="mt-10">
              <Link href={"/categories"}>
                <PrimaryButton Icon={BsCart2} text="تسوق الآن" />
              </Link>
            </div>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            orientation="vertical"
            className="w-full max-w-lg h-[300px] hidden lg:grid"
          >
            <CarouselContent className="-mt-1 h-[300px]">
              <CarouselItem className="pt-2 md:basis-1/2">
                <Link className="" href={"/products?category=turkish"}>
                  <Card className="p-0 border-0">
                    <CardContent className="flex items-center justify-center p-0">
                      <Image
                        src={turkish}
                        alt="turkish category"
                        width={500}
                        height={500}
                        className="w-full h-auto object-cover"
                      />
                    </CardContent>
                  </Card>
                </Link>
              </CarouselItem>

              <CarouselItem className="pt-1 md:basis-1/2">
                <Link className="" href={"/products?category=beans"}>
                  <Card className="p-0 border-0">
                    <CardContent className="flex items-center justify-center p-0 ">
                      <Image
                        src={beans}
                        alt="beans category"
                        width={500}
                        height={500}
                        className="w-full h-auto object-cover"
                      />
                    </CardContent>
                  </Card>
                </Link>
              </CarouselItem>

              <CarouselItem className="pt-2 md:basis-1/2">
                <Link className="" href={"/products?category=spresso"}>
                  <Card className="p-0 border-0">
                    <CardContent className="flex items-center justify-center p-0">
                      <Image
                        src={spresso}
                        alt="spresso category"
                        width={500}
                        height={500}
                        className="w-full h-auto object-cover"
                      />
                    </CardContent>
                  </Card>
                </Link>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="bg-brown-600 border-brown-400" />
            <CarouselNext className="bg-brown-600 border-brown-400" />
          </Carousel>
        </div>
      </div>
      <p className="container max-w-[90%] w-full lg:w-1/2 bg-brown-100/20  px-4  py-2 rounded-lg   text-base font-semibold text-white/60  z-10 relative  h-10 overflow-hidden">
        <span className="text-center text-shadow-brown animate-banner absolute top-center right-[80%] text-nowrap flex-center  flex-row-reverse gap-2">
          <PiCoffeeFill className="text-brown-200" />
          عزيزي العميل, البضاعة المباعة ترد وتستبدل حتى لو فتحت الكيس عادي جدا
          في خلال 3 أيام
        </span>
      </p>
    </section>
  );
}

export default HeroSection;
