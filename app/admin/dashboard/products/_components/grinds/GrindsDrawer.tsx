"use client";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { GrindsTypes } from "@/lib/types";
import { getData } from "@/utils/helpers";
import GrindItem from "./GrindItem";
import AddGrind from "./AddGrind";
import { useEffect, useState } from "react";

function GrindsDrawer() {
  const [grinds, setGrinds] = useState<GrindsTypes>([]);
  const [open, setOpen] = useState(false);

  const fetchData = () => {
    getData("grinds")
      .then((data: any) => setGrinds(data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (!open) return;
    fetchData();
  }, [open]);

  if (!grinds) return <>لا يوجد نتائج</>;

  return (
    <Drawer direction="left" open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size={"lg"}>الطحنات</Button>
      </DrawerTrigger>
      <DrawerContent className="min-w-[500px]">
        <div className="mx-auto w-full">
          <DrawerHeader className="w-fit">
            <DrawerTitle>تعديل الطحنات المستخدمة</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <ul className="flex flex-col gap-4">
              {grinds.map((grind) => (
                <GrindItem
                  key={grind.id}
                  grind={grind}
                  mode="edit"
                  onSuccess={() => {
                    fetchData();
                    // setOpen(false);
                  }}
                />
              ))}
              <AddGrind
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

export default GrindsDrawer;
