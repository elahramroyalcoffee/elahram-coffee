"use client";
import ImageInput from "@/components/admin/ui/ImageInput";
import FormGroup from "@/components/global/form/FormGroup";
import FormProvider from "@/components/global/form/FormProvider";
import SubmitButton from "@/components/global/form/SubmitButton";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { addCategoryAction } from "@/utils/actions";
import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";

function AddCategory() {
  const [openDrawer, setOpenDrawer] = useState(false);

  return (
    <div className="mb-6">
      <Drawer
        direction="left"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <DrawerTrigger asChild onClick={() => setOpenDrawer(true)}>
          <Button className="flex-center w-fit">
            <IoMdAdd />
            <span>إضافة تصنيف جديد</span>
          </Button>
        </DrawerTrigger>
        <DrawerContent className="min-w-[500px]">
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader className="!text-start">
              <DrawerTitle>إضافة تصنيف جديد</DrawerTitle>
            </DrawerHeader>
            <div className="p-4 pb-0"></div>
            <DrawerFooter>
              <FormProvider
                action={addCategoryAction}
                onSuccess={() => setOpenDrawer(false)}
              >
                <ImageInput />
                <FormGroup
                  name={"title"}
                  label={"إسم التصنيف"}
                  type={"text"}
                  required
                />
                <SubmitButton text="إضافة" className="w-full mt-4" />
              </FormProvider>
              <DrawerClose asChild>
                <Button variant="outline">رجوع</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default AddCategory;
