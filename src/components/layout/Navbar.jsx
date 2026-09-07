import React from 'react';
import { ShoppingBag, Sparkles, MessageCircle } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { ENV } from '../../config/env';

export const Navbar = () => {
  const { totalItems, setIsCartOpen } = useCart();

  const handleOpenWhatsAppDirect = () => {
    const cleanPhone = String(ENV.WHATSAPP_PHONE).replace(/\D/g, '');
    const message = encodeURIComponent(`✨ ¡Hola ${ENV.STORE_NAME}! Me gustaría recibir asesoría sobre sus productos de belleza.`);
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-brand-blush/60 transition-all">
      {/* Barra superior de anuncio */}
      <div className="bg-brand-wine text-brand-pearl text-xs py-1.5 px-4 text-center font-medium tracking-wider flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-brand-blush animate-pulse" />
        <span>Envíos seguros a todo el país • Asesoría personalizada por WhatsApp</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo de la marca */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-wine to-brand-wine-light flex items-center justify-center text-white font-serif font-bold text-xl shadow-glow-wine group-hover:scale-105 transition-transform">
              CP
            </div>
            <div>
              <span className="font-serif text-2xl font-extrabold tracking-tight text-brand-wine block leading-none">
                CP GLOW
              </span>
              <span className="text-[10px] tracking-[0.25em] uppercase text-brand-text-muted font-medium block mt-0.5">
                Beauty & Care
              </span>
            </div>
          </a>

          {/* Acciones de la barra de navegación */}
          <div className="flex items-center gap-3">
            {/* Botón directo de WhatsApp Asesoría */}
            <button
              onClick={handleOpenWhatsAppDirect}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold text-brand-wine bg-brand-blush/40 hover:bg-brand-blush/70 transition-colors border border-brand-blush"
              title="Hablar con una asesora en WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Asesoría WhatsApp</span>
            </button>

            {/* Botón Carrito con Contador Dinámico */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-2xl bg-brand-pearl hover:bg-brand-blush/40 text-brand-wine transition-all duration-200 border border-brand-blush/70 shadow-sm hover:shadow active:scale-95 group"
              aria-label={`Ver carrito con ${totalItems} productos`}
            >
              <ShoppingBag className="w-6 h-6 group-hover:scale-110 transition-transform" />
              
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] px-1 bg-brand-wine text-white text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-md animate-scale">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
