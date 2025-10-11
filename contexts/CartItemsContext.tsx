import { createContext, useState } from "react";

export const CartItemsContext = createContext<any>(null);

export const CartItemsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [cartItems, setCartItems] = useState<any>([]);

  const addToCartHandle = (newCartItem: any) => {
    console.log("new item");
    setCartItems([...cartItems, newCartItem]);
  };

  return (
    <CartItemsContext.Provider
      value={{ cartItems, addToCartHandle, count: cartItems.length }}
    >
      {children}
    </CartItemsContext.Provider>
  );
};
