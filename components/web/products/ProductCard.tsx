import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { GoLinkExternal } from "react-icons/go";
import PrimaryButton from "../ui/PrimaryButton";
import Image from "next/image";
import Link from "next/link";
import { PiCoffeeBeanFill } from "react-icons/pi";
function ProductCard({ product, className = "" }: any) {
  return (
    <Card
      className={`bg-brown-50 sm:rounded-[50px] sm:rounded-tr-none p-0  h-full ${className}`}
    >
      <CardContent className="flex-between flex-col p-0 hover:-translate-y-1 duration-300 transition-all sm:rounded-[50px] sm:rounded-tr-none h-full">
        <Link
          href={`/products/${product.id}`}
          className=" flex flex-col aspect-square items-center justify-center p-2 lg:p-4 w-full"
        >
          <div className="max-h-[300px] w-full h-full">
            <Image
              src={`${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/${product.image}`}
              alt={product.title}
              className="rounded-lg sm:rounded-[50px] bg-brown-500/5 sm:rounded-tr-none w-full h-full object-cover"
              width={360}
              height={293}
            />
          </div>
          <div
            dir="rtl"
            className="w-full mt-4  lg:mt-6 flex  flex-col text-center items-center lg:items-start lg:text-start lg:flex-row justify-between lg:min-h-[90px]"
          >
            <div className="max-lg:w-full max-lg:flex-center max-lg:flex-col">
              <span className="text-base lg:text-xl font-cairo text-black/90 font-semibold">
                {product.title}
              </span>
              <p className="font-cairo max-md:text-sm text-gray-500/75 mt-1 lg:mt-2  clamp-text max-w-[90%]">
                {product.description}
              </p>
            </div>
            <span className="flex flex-col items-center text-base lg:text-xl text-brown-800/80 font-semibold font-cairo min-w-max mt-3 lg:mt-9">
              <span>{product.product_sizes[0].price} جنيه</span>
            </span>
          </div>
        </Link>
        <Link
          href={`/products/${product.id}`}
          dir="rtl"
          className="mt-4 justify-self-end mb-2 lg:mb-4"
        >
          <PrimaryButton
            className="py-3 px-3 sm:py-4 sm:px-4 lg:px-6 gap-2 "
            text="زيارة المنتج"
            Icon={PiCoffeeBeanFill}
          />
        </Link>
      </CardContent>
    </Card>
  );
}

export default ProductCard;
