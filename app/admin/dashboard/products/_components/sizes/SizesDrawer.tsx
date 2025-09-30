"use client";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { getData } from "@/utils/helpers";
import SizeItem from "./SizeItem";
import AddSize from "./AddSize";
import { useEffect, useState } from "react";
import { SizesTypes } from "@/lib/types";

function SizesDrawer() {
  const [sizes, setSizes] = useState<SizesTypes>([]);
  const [open, setOpen] = useState(false);

  const fetchData = () => {
    getData("sizes")
      .then((data: any) => setSizes(data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (!open) return;
    fetchData();
  }, [open]);

  if (!sizes) return <>لا يوجد نتائج</>;
  return (
    <Drawer direction="left" open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size={"lg"}>الأحجام</Button>
      </DrawerTrigger>
      <DrawerContent className="min-w-[500px]">
        <div className="mx-auto w-full  ">
          <DrawerHeader className="w-fit">
            <DrawerTitle>تعديل الأحجام المستخدمة</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <ul className="flex flex-col gap-4">
              {sizes.map((size) => (
                <SizeItem
                  key={size.id}
                  size={size}
                  mode="edit"
                  onSuccess={() => {
                    fetchData();
                    // setOpen(false);
                  }}
                />
              ))}
              <AddSize
                onSuccess={() => {
                  fetchData();
                  // setOpen(false);
                }}
              />
            </ul>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default SizesDrawer;
