import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Load saved pricing mode ('retail' or 'wholesale') from localStorage
  const [pricingMode, setPricingModeState] = useState(() => {
    const saved = localStorage.getItem('sdkas_pricing_mode');
    return saved === 'wholesale' ? 'wholesale' : 'retail';
  });

  // Load saved cart items from localStorage
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('sdkas_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error loading cart from localStorage', e);
      return [];
    }
  });

  // Sync pricingMode to localStorage
  const setPricingMode = (mode) => {
    setPricingModeState(mode);
    localStorage.setItem('sdkas_pricing_mode', mode);
  };

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('sdkas_cart', JSON.stringify(cart));
  }, [cart]);

  // Helper to get applicable price per unit
  const getUnitPrice = (product, mode = pricingMode) => {
    if (!product) return 0;
    return mode === 'wholesale' ? product.wholesalePrice : product.retailPrice;
  };

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(item => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      } else {
        return [...prevCart, { product, quantity }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  // Update item quantity directly
  const updateQuantity = (productId, delta) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
  };

  // Total quantity of items in cart
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Cart subtotal based on current active pricing mode
  const cartSubtotal = cart.reduce((total, item) => {
    const price = getUnitPrice(item.product, pricingMode);
    return total + (price * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{
      cart,
      pricingMode,
      setPricingMode,
      getUnitPrice,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartSubtotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
