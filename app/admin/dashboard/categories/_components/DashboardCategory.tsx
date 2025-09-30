"use client";
import { Category } from "@/utils/database";
import Image from "next/image";
import logo from "@/public/logo.png";
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
import {
  addCategoryAction,
  deleteCategoryAction,
  editCategoryAction,
} from "@/utils/actions";
import React, { useState } from "react";
import ConfirmButtonForm from "@/components/global/form/ConfirmButtonForm";
import ImageInput from "@/components/admin/ui/ImageInput";

function DashboardCategory({ category }: { category: Category }) {
  const [openDrawer, setOpenDrawer] = useState(false);

  // console.log(category);
  return (
    <li>
      <Drawer
        direction="left"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <DrawerTrigger asChild onClick={() => setOpenDrawer(true)}>
          <div className="min-w-[350px] flex-center flex-col border rounded-lg  border-black/50 group hover:bg-gray-200 py-4 bg-transparent cursor-pointer hover:-translate-y-2 hover:shadow-xl transition h-full">
            <Image
              src={
                category.image
                  ? `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/${category.image}`
                  : logo
              }
              alt={category.title}
              width={350}
              height={200}
              className=" transition w-[350px] h-[200px] object-cover"
            />
            <span className="font-bold text-lg border-t mt-4 border-black/20">
              {category.title}
            </span>
          </div>
        </DrawerTrigger>
        <DrawerContent className="min-w-[500px]">
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader className="!text-start">
              <DrawerTitle>تعديل التصنيف: {category.title}</DrawerTitle>
            </DrawerHeader>
            <div className="p-4 pb-0"></div>
            <DrawerFooter>
              <FormProvider
                action={editCategoryAction}
                onSuccess={() => setOpenDrawer(false)}
              >
                <ImageInput
                  defaultValue={
                    category.image
                      ? `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/${category.image}`
                      : undefined
                  }
                />
                <FormGroup
                  name={"title"}
                  label={"إسم التصنيف"}
                  type={"text"}
                  required
                  defaultValue={category.title}
                />
                <input
                  type="text"
                  hidden
                  name="id"
                  defaultValue={category.id}
                />
                <SubmitButton text="تعديل" className="flex-1 mt-4 w-full" />
              </FormProvider>

              <ConfirmButtonForm title={"مسح"} action={deleteCategoryAction}>
                <input
                  type="number"
                  defaultValue={category.id}
                  hidden
                  name="id"
                />
              </ConfirmButtonForm>

              <DrawerClose asChild>
                <Button variant="outline">رجوع</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </li>
  );
}

export default DashboardCategory;
