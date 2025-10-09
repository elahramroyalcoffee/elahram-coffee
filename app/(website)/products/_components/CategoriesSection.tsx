import Image from "next/image";
import Link from "next/link";
import React from "react";
import turkish from "@/public/products/turkish.svg";
import spresso from "@/public/products/spresso.svg";
import beans from "@/public/products/beans.svg";
import coffee from "@/public/home/coffee-view.jpg";
import logo from "@/public/brownLogo.svg";

function CategoriesSection() {
  return (
    <section className="p-1 md:p-[50px] mt-[50px] container">
      <ul className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-8 ">
        <li className=" min-w-[150px]">
          <Link href={`/products`} className="flex-center flex-col gap-4">
            <div className="black-layer after:rounded-[50px] after:rounded-tr-none">
              <Image src={beans} alt="all products" />
              <Image src={logo} alt="all products" className="logo" />
            </div>
            <span className="font-cairo md:text-[31px] font-semibold">
              جميع المنتجات
            </span>
          </Link>
        </li>
        <li className=" min-w-[150px]">
          <Link
            href={`/products?category=turkish`}
            className="flex-center flex-col gap-4"
          >
            <Image src={turkish} alt="turkish category" />
            <span className="font-cairo md:text-[31px] font-semibold">
              تركي
            </span>
          </Link>
        </li>
        <li className=" min-w-[150px]">
          <Link
            href={`/products?category=spresso`}
            className="flex-center flex-col gap-4"
          >
            <Image src={spresso} alt="spresso category" />
            <span className="font-cairo md:text-[31px] font-semibold">
              إسبريسو
            </span>
          </Link>
        </li>
        <li className=" min-w-[150px]">
          <Link
            href={`/products?category=beans`}
            className="flex-center flex-col gap-4"
          >
            <Image src={beans} alt="beans category" />
            <span className="font-cairo md:text-[31px] font-semibold">
              حبوب القهوة
            </span>
          </Link>
        </li>
      </ul>
    </section>
  );
}

export default CategoriesSection;
