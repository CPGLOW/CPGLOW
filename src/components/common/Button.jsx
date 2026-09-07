import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon: Icon = null,
  iconPosition = 'left',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  const sizes = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-7 py-3.5 gap-2.5 font-semibold',
  };

  const variants = {
    // Primario: Carmesí Vino #99182A
    primary: 'bg-brand-wine text-white hover:bg-brand-wine-dark focus:ring-brand-wine shadow-glow-wine hover:shadow-lg',
    
    // Secundario: Rosa Blush #F8CCD7 con texto vino
    secondary: 'bg-brand-blush text-brand-wine hover:bg-brand-blush-dark focus:ring-brand-blush font-semibold',
    
    // Suave: Seda Nude #F1DFD1
    nude: 'bg-brand-nude text-brand-wine hover:bg-brand-nude-dark focus:ring-brand-nude',
    
    // Delineado
    outline: 'border border-brand-wine text-brand-wine hover:bg-brand-blush-light focus:ring-brand-wine',
    
    // Botón especial WhatsApp
    whatsapp: 'bg-[#25D366] text-white hover:bg-[#1EBE5D] focus:ring-[#25D366] shadow-md hover:shadow-lg font-semibold',
    
    // Ghost
    ghost: 'text-brand-wine hover:bg-brand-blush-light focus:ring-brand-wine',
  };

  return (
    <button
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : (
        Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />
      )}
      
      <span>{children}</span>
      
      {!loading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
    </button>
  );
};
