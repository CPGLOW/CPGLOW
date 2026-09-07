import React from 'react';
import { ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { Button } from '../common/Button';
import { formatCurrency } from '../../utils/formatters';

export const CartSummary = ({ subtotal, onProceedToCheckout, disabled = false }) => {
  return (
    <div className="bg-brand-pearl/60 rounded-3xl p-5 border border-brand-blush/80 space-y-4">
      {/* Detalle numérico */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-brand-text-muted">
          <span>Subtotal de productos</span>
          <span className="font-semibold text-brand-text">{formatCurrency(subtotal)}</span>
        </div>

        <div className="flex justify-between text-xs text-brand-text-muted items-center">
          <span className="flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-brand-wine" />
            <span>Envío nacional</span>
          </span>
          <span className="text-emerald-700 font-medium">Por cotizar en WhatsApp</span>
        </div>
      </div>

      {/* Línea divisoria */}
      <div className="border-t border-brand-blush/70 pt-3 flex justify-between items-baseline">
        <span className="font-serif text-base font-bold text-brand-text">Total Pedido</span>
        <span className="font-serif text-2xl font-extrabold text-brand-wine">
          {formatCurrency(subtotal)}
        </span>
      </div>

      {/* Botón de Confirmar Pedido */}
      <Button
        variant="primary"
        size="lg"
        icon={ArrowRight}
        iconPosition="right"
        onClick={onProceedToCheckout}
        disabled={disabled || subtotal <= 0}
        className="w-full shadow-glow-wine"
      >
        Confirmar Pedido
      </Button>

      <p className="text-[11px] text-center text-brand-text-muted flex items-center justify-center gap-1">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Tus datos están protegidos y el pedido se finaliza vía WhatsApp</span>
      </p>
    </div>
  );
};
