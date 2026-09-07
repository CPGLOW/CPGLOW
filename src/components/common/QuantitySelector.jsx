import React from 'react';
import { Minus, Plus } from 'lucide-react';

export const QuantitySelector = ({
  quantity = 1,
  max = 99,
  min = 1,
  onChange,
  size = 'md',
  disabled = false,
  className = '',
}) => {
  const handleDecrement = (e) => {
    e.stopPropagation();
    if (quantity > min) {
      onChange(quantity - 1);
    }
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    if (quantity < max) {
      onChange(quantity + 1);
    }
  };

  const sizeStyles = {
    sm: 'h-7 text-xs',
    md: 'h-9 text-sm',
    lg: 'h-11 text-base',
  };

  const btnSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  return (
    <div
      className={`inline-flex items-center rounded-full bg-brand-nude/60 border border-brand-blush/60 p-0.5 shadow-inner ${sizeStyles[size]} ${className}`}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || quantity <= min}
        className={`flex items-center justify-center rounded-full text-brand-wine hover:bg-white active:scale-95 transition-all disabled:opacity-30 disabled:hover:bg-transparent ${btnSizes[size]}`}
        aria-label="Disminuir cantidad"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>

      <span className="w-8 text-center font-semibold text-brand-text select-none">
        {quantity}
      </span>

      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || quantity >= max}
        className={`flex items-center justify-center rounded-full text-brand-wine hover:bg-white active:scale-95 transition-all disabled:opacity-30 disabled:hover:bg-transparent ${btnSizes[size]}`}
        aria-label="Aumentar cantidad"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
