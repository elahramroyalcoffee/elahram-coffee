import { createContext, useState } from "react";

export const CartCountContext = createContext<any>(null);

export function CartCountProvider({ children }: any) {
  const [count, setCount] = useState(0);

  return (
    <CartCountContext.Provider value={{ count, setCount }}>
      {children}
    </CartCountContext.Provider>
  );
}
