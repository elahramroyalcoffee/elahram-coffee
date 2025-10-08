import React from "react";
import hero from "@/public/home/hero.svg";
import Image from "next/image";
import { BsCart2 } from "react-icons/bs";
import PrimaryButton from "@/components/web/ui/PrimaryButton";
import Link from "next/link";
import { PiCoffeeFill } from "react-icons/pi";

function HeroSection() {
  return (
    <section className="h-lvh hero-section">
      <div className="flex flex-center xl:flex-center-reset h-[calc(100vh-20vh)] md:h-[calc(100vh-15vh)] gap-20  z-10 relative text-white xl:text-black">
        <div className="hidden xl:block w-[45%]">
          <Image src={hero} alt="hero image" className="w-full" />
        </div>
        <div className="self-center flex-center flex-col xl:flex-center-reset text-center xl:text-start max-w-[600px] px-4">
          <h1 className="text-[34px] sm:text-[44px] font-bold">
            البن مزاج… وإنت مزاجك عندنا
          </h1>
          <p className=" text-[18px] sm:text-2xl mt-8 text-white/60 xl:text-gray-500 ">
            لفينا العالم واخترنا لك أفضل حبّة من البرازيل ونكهة من كولومبيا،
            وقوة من جواتيمالا. تحميصات على كيفك … وطحنات تعدل مزاجك وتظبط يومك.
          </p>
          <div className="mt-10">
            <Link href={"/categories"}>
              <PrimaryButton Icon={BsCart2} text="تسوق الآن" />
            </Link>
          </div>
        </div>
      </div>
      <p className="container max-w-[90%] bg-beige-500 xl:bg-beige-100 px-4 xl:px-[140px] py-5 rounded-lg xl:rounded-full  text-base xl:text-[23px] text-black/50 gap-2 z-10 relative flex-center flex-col xl:flex-row">
        <PiCoffeeFill className="text-brown-300" />
        <span className="text-center">
          عزيزي العميل, البضاعة المباعة ترد وتستبدل حتى لو فتحت الكيس عادي جدا
          في خلال 3 أيام
        </span>
      </p>
    </section>
  );
}

export default HeroSection;
