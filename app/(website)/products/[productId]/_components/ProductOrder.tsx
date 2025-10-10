import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AddOnsTypes,
  GrindsTypes,
  ProductTypes,
  SizesTypes,
  SizeTypes,
} from "@/lib/types";
import React, { useRef, useState } from "react";

function ProductOrder({ data }: any) {
  const product: ProductTypes = data.product;
  const sizes: SizesTypes = data.sizes;
  const grinds: GrindsTypes = data.grinds;
  const addOns: AddOnsTypes = data.add_ons;

  const initCurrentItem = {
    product_id: product.id,
    // size_id: product.product_sizes[0]?.size.id,
    size_id: sizes[0]?.id,
    quantity: 1,
    unit_price: product.product_sizes.find(
      (ps: any) => ps.size.id == sizes[0]?.id
    ).price,
    grind_id: grinds[0]?.id,
    add_ons: [],
  };

  const [currentItem, setCurrentItem] = useState(initCurrentItem);
  const [totalPrice, setTotalPrice] = useState(
    currentItem.quantity * currentItem.unit_price || 0
  );
  // Calc total price into use effect to get the total dependency on currentItem change.

  const changeSizeHandle = (size: SizeTypes) => {
    const newUnitPrice = product.product_sizes.find(
      (ps: any) => ps.size.id == size.id
    ).price;
    setCurrentItem({
      ...currentItem,
      size_id: size.id,
      unit_price: newUnitPrice,
    });
  };

  console.log(currentItem);
  console.log(totalPrice);
  return (
    <div className="container">
      <div>
        <div>
          <h1 className="text-[44px] font-bold">{product.title}</h1>
          <span className="flex text-black/50 text-[35px] mt-4">
            {currentItem.quantity * currentItem.unit_price || 0} جنيه
          </span>
          <span className="text-gray-600 font-cairo mt-6 inline-block">
            {product.description}
          </span>
        </div>

        <div className="mt-[40px]">
          <Label className="text-[20px] font-semibold font-cairo text-black/50 ">
            الوزن
          </Label>
          <ul className="flex gap-6 max-w-[588px] flex-wrap mt-6">
            {sizes.map((size) => (
              <li
                key={size.id}
                onClick={() => changeSizeHandle(size)}
                className={`flex-center py-4 px-14  rounded-full border border-brown-500 cursor-pointer 
                  hover:bg-brown-500 hover:text-beige-50 transition duration-300 font-semibold
                  ${
                    currentItem.size_id == size.id
                      ? "bg-brown-500 text-beige-50"
                      : "bg-white text-brown-500"
                  }`}
              >
                <span className="flex">{size.weight} جم</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-[32px]">
          <Label className="text-[20px] font-semibold font-cairo text-black/50 ">
            الطحنة
          </Label>
          <ul className="flex gap-6 max-w-[588px] flex-wrap mt-6">
            {grinds.map((grind) => (
              <li
                key={grind.id}
                className={`flex-center py-4 px-14  rounded-full border border-brown-500 cursor-pointer 
                  hover:bg-brown-500 hover:text-beige-50 transition duration-300 font-semibold
                  ${
                    currentItem.grind_id == grind.id
                      ? "bg-brown-500 text-beige-50"
                      : "bg-white text-brown-500"
                  }`}
              >
                <span className="flex">{grind.name}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-[32px]">
          <Label className="text-[20px] font-semibold font-cairo text-black/50 ">
            الإضافات
          </Label>
          <ul className="flex flex-col gap-6 max-w-[588px] flex-wrap mt-6">
            {addOns.map((addOn) => (
              <li
                key={addOn.id}
                className={`flex gap-2
                  `}
              >
                <Input type="number" className="w-14" max={10} min={0} />
                <span className="flex">{addOn.name}</span>-
                <span>{addOn.price} جنيه</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div>{/* Gallery */}</div>
    </div>
  );
}

export default ProductOrder;
