import { Loader } from "lucide-react";
import React from "react";

function Loading() {
  return (
    <div>
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    </div>
  );
}

export default Loading;
