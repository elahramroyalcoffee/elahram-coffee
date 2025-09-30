"use client";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { AddOnsTypes } from "@/lib/types";
import { getData } from "@/utils/helpers";
import AddOnItem from "./AddOnItem";
import AddAddOn from "./AddAddOn";
import { useEffect, useState } from "react";

function AddOnsDrawer() {
  const [addOns, setAddOns] = useState<AddOnsTypes>([]);
  const [open, setOpen] = useState(false);

  const fetchData = () => {
    getData("add_ons")
      .then((data: any) => setAddOns(data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (!open) return;
    fetchData();
  }, [open]);

  if (!addOns) return <>لا يوجد نتائج</>;

  return (
    <Drawer direction="left" open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size={"lg"}>الإضافات</Button>
      </DrawerTrigger>
      <DrawerContent className="min-w-[700px]">
        <div className="mx-auto w-full">
          <DrawerHeader className="w-fit">
            <DrawerTitle>تعديل الإضافات المستخدمة</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <ul className="flex flex-col gap-4">
              {addOns.map((addOn) => (
                <AddOnItem
                  key={addOn.id}
                  addOn={addOn}
                  mode="edit"
                  onSuccess={() => {
                    fetchData();
                    // setOpen(false);
                  }}
                />
              ))}
              <AddAddOn
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

export default AddOnsDrawer;
