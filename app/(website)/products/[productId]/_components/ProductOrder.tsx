import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AddOnsTypes,
  GrindsTypes,
  GrindTypes,
  ProductTypes,
  SizesTypes,
  SizeTypes,
} from "@/lib/types";
import { Equal, MinusIcon, PlusIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import ProductVarients from "./ProductVarients";
import PrimaryButton from "@/components/web/ui/PrimaryButton";
import { FiShoppingCart } from "react-icons/fi";

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
    // add_ons: [],
  };

  const [currentItem, setCurrentItem] = useState(initCurrentItem);
  const [currentAddOns, setCurrentAddOns] = useState([]);
  const [totalPrice, setTotalPrice] = useState(
    currentItem.quantity * currentItem.unit_price || 0
  );

  // Get Total Price
  useEffect(() => {
    let totalPriceCount = 0;
    totalPriceCount += currentItem.quantity * currentItem.unit_price;
    totalPriceCount += currentAddOns.reduce((pre, curr: any) => {
      return pre + curr.total_price;
    }, 0);
    setTotalPrice(totalPriceCount);
  }, [currentAddOns, currentItem]);

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

  const changeGrindHandle = (grind: GrindTypes) => {
    setCurrentItem({
      ...currentItem,
      grind_id: grind.id,
    });
  };

  const changeAddOnHandle = (addOn: any, quantity: any) => {
    console.log(addOn, quantity);
    let boxOfCurrentAddOns: any = currentAddOns.slice();
    const newAddOn = {
      add_ons_id: addOn.id,
      add_ons_name: addOn.name,
      unit_price: +addOn.price,
      quantity: +quantity,
      total_price: +quantity * +addOn.price,
    };
    console.log(newAddOn);

    const isExist = !!boxOfCurrentAddOns.find(
      (currAddOn: any) => currAddOn.add_ons_id == addOn.id
    );

    if (isExist) {
      boxOfCurrentAddOns = boxOfCurrentAddOns.map((currAddOn: any) => {
        if (currAddOn.add_ons_id == addOn.id) {
          console.log("HERE");
          return newAddOn;
        } else {
          return currAddOn;
        }
      });
    } else {
      boxOfCurrentAddOns.push(newAddOn);
    }

    setCurrentAddOns(boxOfCurrentAddOns);
  };

  const showAddOnTotalPrice = (addOn: any) => {
    return (
      !!(currentAddOns as any).find(
        (currAddOn: any) => currAddOn.add_ons_id == addOn.id
      ) &&
      (currentAddOns as any).find(
        (currAddOn: any) => currAddOn.add_ons_id == addOn.id
      )?.total_price > 0
    );
  };
  // console.log(currentItem);
  // console.log(totalPrice);
  console.log(currentAddOns);
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

        <ProductVarients
          sizes={sizes}
          changeSizeHandle={changeSizeHandle}
          currentItem={currentItem}
          grinds={grinds}
          changeGrindHandle={changeGrindHandle}
          addOns={addOns}
          changeAddOnHandle={changeAddOnHandle}
          showAddOnTotalPrice={showAddOnTotalPrice}
          currentAddOns={currentAddOns}
        />

        <div className="mt-[65px] flex items-center gap-15">
          <div className="flex max-w-[140px] items-center justify-between gap-2 px-6 py-3  rounded-full border border-brown-500 ">
            <PlusIcon className="text-black/50 font-bold cursor-pointer" />
            <Input
              value={currentItem.quantity}
              type="text"
              className="w-12 border-none text-center !text-xl font-cairo text-brown-500"
            />
            <MinusIcon className="text-black/50 font-bold cursor-pointer" />
          </div>
          <div>
            {/* Add to cart button */}
            <PrimaryButton text="أضف الي عربة التسوق" Icon={FiShoppingCart} />
          </div>
        </div>
      </div>
      <div>{/* Gallery */}</div>
    </div>
  );
}

export default ProductOrder;
