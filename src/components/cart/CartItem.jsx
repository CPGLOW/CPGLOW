import React from 'react';
import { Trash2 } from 'lucide-react';
import { QuantitySelector } from '../common/QuantitySelector';
import { formatCurrency } from '../../utils/formatters';
import { useCart } from '../../hooks/useCart';

export const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQty) => {
    updateQuantity(item.id, newQty, true);
  };

  const itemTotal = (item.precio || 0) * (item.quantity || 0);

  return (
    <div className="flex items-center gap-3.5 py-3.5 border-b border-brand-nude last:border-b-0">
      {/* Miniatura del producto */}
      <div className="w-16 h-16 rounded-2xl bg-brand-pearl overflow-hidden flex-shrink-0 border border-brand-blush/60">
        <img
          src={item.imagen}
          alt={item.nombre}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Datos del producto */}
      <div className="flex-1 min-w-0">
        <h4 className="font-serif text-sm font-bold text-brand-text truncate">
          {item.nombre}
        </h4>
        <span className="text-[11px] text-brand-text-muted block">
          {formatCurrency(item.precio)} c/u
        </span>

        {/* Control de cantidad y subtotal */}
        <div className="flex items-center justify-between mt-2">
          <QuantitySelector
            quantity={item.quantity}
            max={item.stock || 99}
            min={1}
            onChange={handleQuantityChange}
            size="sm"
          />

          <span className="font-serif text-sm font-bold text-brand-wine">
            {formatCurrency(itemTotal)}
          </span>
        </div>
      </div>

      {/* Botón eliminar */}
      <button
        onClick={() => removeFromCart(item.id)}
        className="p-2 text-brand-text-muted hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors flex-shrink-0"
        title="Eliminar del pedido"
        aria-label={`Eliminar ${item.nombre} del carrito`}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};
