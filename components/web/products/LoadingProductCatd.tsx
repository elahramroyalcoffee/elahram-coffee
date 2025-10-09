import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

function LoadingProductCatd() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[400px] w-[calc(33%-2rem)] min-w-[300px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}

export default LoadingProductCatd;
