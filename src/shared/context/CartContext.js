import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const getVariantId = (product) => {
    return `${product.id}-${product.color}-${product.size}`;
  };

  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const variantId = getVariantId(product);
      const existingItem = prevItems.find((item) => item.variantId === variantId);

      if (existingItem) {
        return prevItems.map((item) =>
          item.variantId === variantId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { ...product, variantId, quantity }];
      }
    });
  };

  const removeFromCart = (variantId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.variantId !== variantId));
  };

  const updateQuantity = (variantId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(variantId);
    } else {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.variantId === variantId ? { ...item, quantity } : item
        )
      );
    }
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
