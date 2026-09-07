import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

/**
 * Capa 2: Hook facade para el carrito de compras
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser utilizado dentro de un <CartProvider>');
  }
  return context;
};
