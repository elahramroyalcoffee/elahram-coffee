import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CategoryTypes } from "@/lib/types";
import React, { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { useDebounce } from "@/hooks/useDebounce";

function ProductsFilter({
  filters,
  setFilters,
  categories,
  defaultSearch,
}: any) {
  const { debouncedValue, handleSearch } = useDebounce();

  useEffect(() => {
    setFilters({ ...filters, search: debouncedValue });
  }, [debouncedValue]);

  return (
    <div className="bg-beige-100/50 shadow-sm p-8 rounded-lg h-fit  top-20  md:sticky  max-sm:w-fit max-sm:mx-auto">
      <div>
        <Label htmlFor="search" className="text-xl font-semibold font-cairo">
          بحث عن منتج
        </Label>
        <Input
          type="text"
          name="search"
          id="search"
          placeholder="بحث"
          className="mt-2 w-[200px]"
          onChange={handleSearch}
        />
      </div>

      <div className="mt-10 font-cairo">
        <Label
          htmlFor="all-categories"
          className="text-xl font-semibold font-cairo"
        >
          التصنيفات
        </Label>
        <RadioGroup
          defaultValue={defaultSearch().toString()}
          dir="rtl"
          className="mt-6 flex flex-col gap-5"
          onValueChange={(categorySearch) =>
            setFilters({ ...filters, page: 1, category: categorySearch })
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="all"
              id="all-categories"
              className=" cursor-pointer"
            />
            <Label htmlFor="all-categories" className=" cursor-pointer">
              جميع المنتجات
            </Label>
          </div>
          {categories?.map((category: CategoryTypes, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem
                value={category.id.toString()}
                id={`category-${category.id}`}
                className=" cursor-pointer"
              />
              <Label
                htmlFor={`category-${category.id}`}
                className="cursor-pointer"
              >
                {category.title}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}

export default ProductsFilter;
