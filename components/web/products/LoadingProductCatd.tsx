import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

function LoadingProductCatd() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="w-full h-[200px] lg:h-[400px] lg:w-[calc(33%-2rem)] lg:min-w-[300px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-20 lg:w-[250px]" />
        <Skeleton className="h-4 w-20 lg:w-[200px]" />
      </div>
    </div>
  );
}

export default LoadingProductCatd;
