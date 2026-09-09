import React from 'react';
import { MessageCircle, Heart, ShieldCheck, Sparkles, Lock } from 'lucide-react';
import { ENV } from '../../config/env';

export const Footer = ({ onOpenAdminLogin }) => {
  const handleOpenWhatsApp = () => {
    const cleanPhone = String(ENV.WHATSAPP_PHONE).replace(/\D/g, '');
    const msg = encodeURIComponent(`✨ ¡Hola ${ENV.STORE_NAME}! Quisiera información sobre sus productos.`);
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="bg-white border-t border-brand-blush/70 pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Columna Marca */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-brand-wine flex items-center justify-center text-white font-serif font-bold text-lg">
                CP
              </div>
              <span className="font-serif text-2xl font-bold text-brand-wine">
                CP GLOW
              </span>
            </div>
            <p className="text-sm text-brand-text-muted max-w-sm leading-relaxed">
              Catálogo oficial de productos para el cuidado capilar, facial y corporal. Hecho con pasión por la belleza auténtica, el brillo saludable y la atención personalizada.
            </p>
            <div className="pt-2">
              <button
                onClick={handleOpenWhatsApp}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Atención al Cliente por WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Columna Categorías */}
          <div>
            <h4 className="font-serif text-base font-bold text-brand-wine mb-3">
              Categorías
            </h4>
            <ul className="space-y-2 text-sm text-brand-text-muted">
              <li>Capilares & Reparación</li>
              <li>Skin Care Facial</li>
              <li>Maquillaje</li>
              <li>Cuidado Corporal & Brumas</li>
            </ul>
          </div>

          {/* Columna Garantía */}
          <div>
            <h4 className="font-serif text-base font-bold text-brand-wine mb-3">
              Garantía CP GLOW
            </h4>
            <ul className="space-y-2 text-sm text-brand-text-muted">
              <li className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-brand-wine" />
                <span>Productos 100% Originales</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-wine" />
                <span>Pago y Envío Seguro</span>
              </li>
              <li className="flex items-center gap-2">
                <Heart className="w-3.5 h-3.5 text-brand-wine" />
                <span>Asesoría cosmética guiada</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="pt-8 border-t border-brand-nude flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-text-muted">
          <p>© {new Date().getFullYear()} {ENV.STORE_NAME}. Todos los derechos reservados.</p>
          
          <div className="flex items-center gap-3">
            <p className="flex items-center gap-1">
              Diseñado con <Heart className="w-3.5 h-3.5 text-brand-wine fill-current" /> para realzar tu belleza
            </p>
            
            {/* Acceso discreto de administración */}
            {onOpenAdminLogin && (
              <button
                type="button"
                onClick={onOpenAdminLogin}
                className="p-1 rounded-full text-brand-text-muted/40 hover:text-brand-wine transition-colors cursor-pointer"
                title="Acceso Administración (Ctrl + Shift + A)"
                aria-label="Acceso Administración"
              >
                <Lock className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
