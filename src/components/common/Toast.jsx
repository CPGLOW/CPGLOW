import React from 'react';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCart } from '../../hooks/useCart';

export const Toast = () => {
  const { toast } = useCart();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0 z-50 animate-bounce-subtle pointer-events-none">
      <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-brand-wine text-white shadow-glow-wine border border-brand-blush/30 backdrop-blur-md">
        <div className="p-1 rounded-full bg-white/20 text-brand-blush">
          <Sparkles className="w-4 h-4" />
        </div>
        <span className="text-sm font-medium tracking-wide">
          {toast.message}
        </span>
      </div>
    </div>
  );
};
