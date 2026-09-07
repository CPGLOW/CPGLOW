import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { StorageService } from '../services/storageService';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  // Inicialización desde localStorage
  const [cart, setCart] = useState(() => StorageService.getCartItems());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Sincronizar cambios a storage
  useEffect(() => {
    StorageService.saveCartItems(cart);
  }, [cart]);

  // Mostrar toast auto-ocultable
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(prev => (prev?.id === toast?.id ? null : prev));
    }, 3000);
  }, [toast]);

  // Agregar al carrito
  const addToCart = useCallback((product, quantity = 1) => {
    if (!product || quantity <= 0) return;

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => item.id === product.id);
      
      if (existingIndex > -1) {
        const updated = [...prevCart];
        const newQty = updated[existingIndex].quantity + quantity;
        
        // Validar no sobrepasar stock si existe límite
        const maxStock = product.stock || 999;
        const finalQty = Math.min(newQty, maxStock);
        
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: finalQty,
        };
        return updated;
      } else {
        const finalQty = Math.min(quantity, product.stock || 999);
        return [...prevCart, { ...product, quantity: finalQty }];
      }
    });

    showToast(`¡Añadido! ${quantity}x ${product.nombre}`);
  }, [showToast]);

  // Actualizar cantidad directa o por delta
  const updateQuantity = useCallback((productId, value, isAbsolute = false) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === productId) {
          let newQty = isAbsolute ? value : item.quantity + value;
          const maxStock = item.stock || 999;
          
          if (newQty <= 0) {
            return null; // Marcado para filtrar
          }
          if (newQty > maxStock) {
            newQty = maxStock;
          }
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(Boolean);
    });
  }, []);

  // Eliminar producto
  const removeFromCart = useCallback((productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  }, []);

  // Vaciar carrito
  const clearCart = useCallback(() => {
    setCart([]);
    StorageService.clearCart();
  }, []);

  // Totales calculados (Memoizados para rendimiento)
  const totalItems = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.quantity || 0), 0);
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + ((item.precio || 0) * (item.quantity || 0)), 0);
  }, [cart]);

  const value = useMemo(() => ({
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    totalItems,
    subtotal,
    toast,
    setToast,
    showToast,
  }), [cart, addToCart, updateQuantity, removeFromCart, clearCart, isCartOpen, totalItems, subtotal, toast, showToast]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
