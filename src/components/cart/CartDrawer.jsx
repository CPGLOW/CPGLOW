import React, { useEffect } from 'react';
import { X, ShoppingBag, Trash2, ArrowLeft } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { CartItem } from './CartItem';
import { CartSummary } from './CartSummary';
import { Button } from '../common/Button';

export const CartDrawer = ({ onOpenCheckout }) => {
  const { cart, isCartOpen, setIsCartOpen, clearCart, subtotal, totalItems } = useCart();

  // Bloquear scroll
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-text/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div 
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-brand-blush/80 animate-slide-up overscroll-contain"
          data-lenis-prevent="true"
        >
          {/* Header del Carrito */}
          <div className="p-6 bg-brand-pearl/50 border-b border-brand-nude flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-brand-wine text-white shadow-sm">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-brand-wine">
                  Tu Carrito
                </h3>
                <span className="text-xs text-brand-text-muted">
                  {totalItems} {totalItems === 1 ? 'producto seleccionado' : 'productos seleccionados'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="p-2 text-brand-text-muted hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
                  title="Vaciar todo el carrito"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-brand-text-muted hover:text-brand-wine hover:bg-brand-blush/50 rounded-full transition-colors"
                aria-label="Cerrar carrito"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Contenido: Lista de Productos con scroll nativo protegido */}
          <div className="flex-1 overflow-y-auto p-6 space-y-2 overscroll-contain" data-lenis-prevent="true">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 rounded-full bg-brand-pearl text-brand-wine/50 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-10 h-10 stroke-1" />
                </div>
                <h4 className="font-serif text-lg font-bold text-brand-wine mb-1">
                  Tu carrito está vacío
                </h4>
                <p className="text-xs text-brand-text-muted max-w-xs mb-6">
                  Descubre nuestras líneas capilares, skin care, maquillaje y corporales para consentirte.
                </p>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setIsCartOpen(false)}
                >
                  Comenzar a Comprar
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-brand-nude">
                {cart.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>

          {/* Footer del Carrito con Resumen */}
          {cart.length > 0 && (
            <div className="p-6 bg-white border-t border-brand-nude">
              <CartSummary
                subtotal={subtotal}
                onProceedToCheckout={() => {
                  setIsCartOpen(false);
                  onOpenCheckout();
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
