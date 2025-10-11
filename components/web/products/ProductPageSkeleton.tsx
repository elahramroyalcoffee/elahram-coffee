import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

function ProductPageSkeleton() {
  return (
    <div className="pt-[180px]">
      <div className="container flex-center  flex-col-reverse lg:flex-row items-center lg:items-start gap-12 w-full">
        <div>
          <Skeleton className="h-6 w-full min-w-[200px] lg:min-w-[500px]" />
          <Skeleton className="h-6 w-full min-w-[150px] lg:min-w-[500px] mt-6" />
          <Skeleton className="h-6 w-full min-w-[220px] lg:min-w-[500px] mt-6" />
          <Skeleton className="h-6 w-full min-w-[120px] lg:min-w-[400px] mt-14" />
        </div>
        <div>
          <Skeleton className="w-full min-w-[120px] lg:min-w-[400px] h-full min-h-[120px] lg:min-h-[400px] " />
        </div>
      </div>
    </div>
  );
}

export default ProductPageSkeleton;
