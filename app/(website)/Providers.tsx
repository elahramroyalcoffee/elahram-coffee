import { CartCountProvider } from "@/contexts/CartCountContext";
import { CartItemsProvider } from "@/contexts/CartItemsContext";
import React from "react";

function Providers({ children }: any) {
  return (
    <CartCountProvider>
      <CartItemsProvider>{children}</CartItemsProvider>
    </CartCountProvider>
  );
}

export default Providers;
