import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { GoLinkExternal } from "react-icons/go";
import PrimaryButton from "../ui/PrimaryButton";
import Image from "next/image";
import Link from "next/link";
function ProductCard({ product, className = "" }: any) {
  return (
    <Card
      className={`bg-brown-50 rounded-[50px] rounded-tr-none p-0  h-full ${className}`}
    >
      <Link
        href={`/products/${product.id}`}
        className=" hover:-translate-y-1 duration-300 transition-all rounded-[50px] rounded-tr-none "
      >
        <CardContent className="flex flex-col aspect-square items-center justify-center p-4 ">
          <div className="max-h-[300px] w-full h-full">
            <Image
              src={`${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/${product.image}`}
              alt={product.title}
              className="rounded-[50px] bg-brown-500/5 rounded-tr-none w-full h-full object-cover"
              width={360}
              height={293}
            />
          </div>
          <div
            dir="rtl"
            className="w-full  mt-6 flex items-start justify-between min-h-[90px]"
          >
            <div className="">
              <span className="text-xl font-cairo text-black/90 font-semibold">
                {product.title}
              </span>
              <p className="font-cairo text-gray-500/75 mt-2  clamp-text">
                {product.description}
              </p>
            </div>
            <span className="flex flex-col items-center text-xl text-brown-800/80 font-semibold font-cairo min-w-max mt-9">
              <span>{product.product_sizes[0].price} جنيه</span>
            </span>
          </div>
          <div dir="rtl" className="mt-8 justify-self-end">
            <PrimaryButton
              className="py-4 px-4 sm:py-4 sm:px-6"
              text="الدخول لصفحة المنتج"
              Icon={GoLinkExternal}
            />
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}

export default ProductCard;
