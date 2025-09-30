import { Label } from "@/components/ui/label";
import { CategoriesTypes, CategoryTypes } from "@/lib/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

interface FilterProductsProps {
  categories: CategoryTypes[];
  onFilter: (categoryId: number | null) => void;
  currentCategoryId: number | null;
}

function FilterProducts({
  categories,
  onFilter,
  currentCategoryId,
}: FilterProductsProps) {
  return (
    <div className="flex gap-2 items-center">
      <Label htmlFor="">بحث بتصنيف معين</Label>
      <select
        className="w-fit border rounded px-2 py-1"
        value={currentCategoryId || ""}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          const value = e.target.value;
          onFilter(value ? parseInt(value) : null);
        }}
      >
        <option value="">الجميع</option>
        {categories.map((category: CategoryTypes) => (
          <option value={category.id} key={category.id}>
            {category.title}
          </option>
        ))}
      </select>
    </div>
  );
}

export default FilterProducts;
