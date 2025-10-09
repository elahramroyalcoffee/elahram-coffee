import SectionHeader from "@/components/web/ui/SectionHeader";
import React from "react";
import turkish from "@/public/home/categories/turkish.svg";
import spresso from "@/public/home/categories/spresso.svg";
import beans from "@/public/home/categories/beans.svg";
import Image from "next/image";
import Link from "next/link";

function CategoriesSection() {
  return (
    <section className="py-[50px] container">
      <SectionHeader title="التصنيفات" />

      <ul className="flex-center gap-26 flex-wrap">
        <li className=" min-w-[200px]">
          <Link
            href={`/products?category=turkish`}
            className="flex-center flex-col gap-8"
          >
            <Image src={turkish} alt="turkish category" />
            <span className="font-cairo text-[31px] font-semibold">تركي</span>
          </Link>
        </li>
        <li className=" min-w-[200px]">
          <Link
            href={`/products?category=spresso`}
            className="flex-center flex-col gap-8"
          >
            <Image src={spresso} alt="spresso category" />
            <span className="font-cairo text-[31px] font-semibold">
              إسبريسو
            </span>
          </Link>
        </li>
        <li className=" min-w-[200px]">
          <Link
            href={`/products?category=beans`}
            className="flex-center flex-col gap-8"
          >
            <Image src={beans} alt="beans category" />
            <span className="font-cairo text-[31px] font-semibold">
              حبوب القهوة
            </span>
          </Link>
        </li>
      </ul>
    </section>
  );
}

export default CategoriesSection;
