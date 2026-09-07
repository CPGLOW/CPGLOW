import React from 'react';

export const Badge = ({
  children,
  variant = 'blush',
  size = 'sm',
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full tracking-wide';

  const sizes = {
    xs: 'text-[10px] px-2 py-0.5',
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3 py-1.5',
  };

  const variants = {
    // Rosa Blush suave con texto vino
    blush: 'bg-brand-blush/80 text-brand-wine border border-brand-blush',
    // Carmesí Vino
    wine: 'bg-brand-wine text-white shadow-sm',
    // Seda Nude
    nude: 'bg-brand-nude text-brand-text border border-brand-nude-dark/40',
    // Alerta de stock bajo
    warning: 'bg-amber-100 text-amber-900 border border-amber-200',
    // Agotado
    danger: 'bg-rose-100 text-rose-800 border border-rose-200',
    // Éxito / Disponible
    success: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
  };

  return (
    <span className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
