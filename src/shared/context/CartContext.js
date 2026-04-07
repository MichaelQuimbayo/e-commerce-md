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
        // Create a plain object for the cart, explicitly calling getters
        const newCartItem = {
          id: product.id,
          variantId: variantId,
          name: product.name,
          price: product.price,
          image: product.primaryImage, // Explicitly get the image URL
          color: product.color,
          size: product.size,
          quantity: quantity,
          stock: product.stock,
        };
        return [...prevItems, newCartItem];
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

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
