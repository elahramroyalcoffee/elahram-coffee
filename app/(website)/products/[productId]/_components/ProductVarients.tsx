import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Equal } from "lucide-react";
import React from "react";

function ProductVarients({
  sizes,
  changeSizeHandle,
  currentItem,
  grinds,
  changeGrindHandle,
  addOns,
  changeAddOnHandle,
  showAddOnTotalPrice,
  currentAddOns,
}: any) {
  return (
    <>
      <div className="mt-[40px]">
        <Label className="text-[20px] font-semibold font-cairo text-black/50 ">
          الوزن
        </Label>
        <ul className="flex gap-6 max-w-[588px] flex-wrap mt-6">
          {sizes.map((size: any) => (
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
          {grinds.map((grind: any) => (
            <li
              onClick={() => changeGrindHandle(grind)}
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
          {addOns.map((addOn: any) => (
            <li
              key={addOn.id}
              className={`flex gap-2 items-center
                    `}
            >
              <Input
                type="number"
                className="w-14"
                max={10}
                min={0}
                placeholder="0"
                onChange={(e) => changeAddOnHandle(addOn, e.target.value)}
              />
              <span className="flex">{addOn.name}</span>
              {showAddOnTotalPrice(addOn) && (
                <>
                  <span>
                    <Equal size={12} className="text-brown-400" />
                  </span>
                  <span>
                    {
                      (currentAddOns as any).find(
                        (currAddOn: any) => currAddOn.add_ons_id == addOn.id
                      )?.total_price
                    }{" "}
                    جنيه
                  </span>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default ProductVarients;
