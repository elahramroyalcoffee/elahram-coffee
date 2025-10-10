import { createContext, useState } from "react";

export const CartItemsContext = createContext<any>(null);

export const CartItemsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCartHandle = (newCartItem: any) => {};

  return (
    <CartItemsContext.Provider value={{ cartItems, addToCartHandle }}>
      {children}
    </CartItemsContext.Provider>
  );
};
