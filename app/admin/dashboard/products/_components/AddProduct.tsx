"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import React, { useState } from "react";
import ProductForm from "./product/ProductForm";

interface AddProductProps {
  onSuccess?: () => void;
}

function AddProduct({ onSuccess }: AddProductProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    onSuccess?.();
  };

  return (
    <Drawer direction="left" open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size={"lg"} className="!w-[302px]">
          + إضافة منتج جديد
        </Button>
      </DrawerTrigger>
      <DrawerContent className="drawer-content  ">
        <DrawerHeader className="w-fit">
          <DrawerTitle>إضافة منتج جديد</DrawerTitle>
        </DrawerHeader>
        <ProductForm setOpen={handleSuccess} mode="add" />
      </DrawerContent>
    </Drawer>
  );
}

export default AddProduct;
