import React from "react";
import hero from "@/public/home/hero.svg";
import Image from "next/image";
import { BsCart2 } from "react-icons/bs";
import PrimaryButton from "@/components/web/ui/PrimaryButton";
import Link from "next/link";

function Home() {
  return (
    <section className="flex  h-lvh gap-20">
      <div className="">
        <Image src={hero} alt="hero image" />
      </div>
      <div className="self-center -mt-20 max-w-[600px]">
        <h1 className="text-[44px] font-bold">البن مزاج… وإنت مزاجك عندنا</h1>
        <p className="text-gray-500 text-2xl mt-8">
          لفينا العالم واخترنا لك أفضل حبّة من البرازيل ونكهة من كولومبيا، وقوة
          من جواتيمالا. تحميصات على كيفك … وطحنات تعدل مزاجك وتظبط يومك.
        </p>
        <div className="mt-10">
          <Link href={"/categories"}>
            <PrimaryButton Icon={BsCart2} text="تسوق الآن" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Home;
