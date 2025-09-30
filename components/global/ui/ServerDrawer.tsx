import AddSize from "@/app/admin/dashboard/products/_components/sizes/AddSize";
import SizeItem from "@/app/admin/dashboard/products/_components/sizes/SizeItem";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import React, { ReactNode } from "react";

function ServerDrawer({
  trigger,
  title,
  children,
  varient = "default",
  className = "",
}: {
  trigger: string | ReactNode;
  title: string;
  children: React.ReactNode;
  varient?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
  className?: string;
}) {
  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <Button size={"lg"} variant={varient} className={className}>
          {trigger}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="drawer-content">
        <div className="mx-auto w-full  ">
          <DrawerHeader className="w-fit">
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 pb-0">{children}</div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default ServerDrawer;
