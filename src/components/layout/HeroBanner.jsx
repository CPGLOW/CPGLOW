import React from 'react';
import { Sparkles, ShieldCheck, Heart, ArrowDown, Star, MessageCircle, Droplets, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button';
import { ENV } from '../../config/env';

export const HeroBanner = ({ onExploreClick }) => {
  const handleOpenWhatsApp = () => {
    const cleanPhone = String(ENV.WHATSAPP_PHONE).replace(/\D/g, '');
    const msg = encodeURIComponent(`✨ ¡Hola ${ENV.STORE_NAME}! Quisiera asesoría sobre sus productos.`);
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="relative w-full overflow-hidden border-b border-brand-blush/60">
      {/* 1. Fondo Cinemático Panorámico Completo (Edge-to-Edge) */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={`${import.meta.env.BASE_URL || './'}hero_banner_cpglow.jpg`}
          alt="CP GLOW — Colección Exclusiva de Cosmética y Cuidado"
          className="w-full h-full object-cover object-[75%_center] lg:object-[right_center] scale-100 animate-fade-in transition-transform duration-1000"
        />

        {/* Capa 1: Filtro de Luz y Contraste Calibrado (Permite apreciar más la foto) */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-pearl/90 via-brand-pearl/60 to-transparent hidden lg:block" />

        {/* Capa 2: Filtro vertical equilibrado para pantallas móviles */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-pearl/88 via-brand-pearl/68 to-brand-pearl/85 lg:hidden" />

        {/* Capa 3: Suave viñeta de terciopelo vino en los bordes para profundidad */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-pearl via-transparent to-brand-wine/10 pointer-events-none" />
      </div>

      {/* 2. Contenido Editorial Inmersivo Sobre el Banner */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 min-h-[580px] lg:min-h-[660px] flex flex-col justify-center">
        <div className="max-w-2xl lg:max-w-3xl space-y-6 text-center lg:text-left">
          
          {/* Badge Flotante Superior */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-brand-wine/30 text-brand-wine shadow-sm">
            <Sparkles className="w-4 h-4 text-brand-wine fill-brand-wine/20" />
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">
              Colección Exclusiva de Belleza & Cuidado
            </span>
          </div>

          {/* Título Principal Monumental */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-extrabold text-brand-wine tracking-tight leading-[1.1]">
            Realza tu luz propia <br />
            <span className="text-gradient-wine italic font-normal">
              con el cuidado que mereces
            </span>
          </h1>

          {/* Párrafo descriptivo con tipografía legible */}
          <p className="text-base sm:text-lg lg:text-xl text-brand-text-muted leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
            Tratamientos capilares de alta nutrición, rutinas de skin care iluminadoras y delicias corporales creadas para consentir tu ritual diario con fórmulas selectas.
          </p>

          {/* Acciones principales */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
            <Button
              variant="primary"
              size="lg"
              icon={ArrowDown}
              iconPosition="right"
              onClick={onExploreClick}
              className="w-full sm:w-auto shadow-glow-wine px-9 py-4 text-base font-bold"
            >
              Explorar Catálogo
            </Button>

            <button
              type="button"
              onClick={handleOpenWhatsApp}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/90 hover:bg-white text-brand-wine border-2 border-brand-blush font-bold text-sm shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Asesoría por WhatsApp</span>
            </button>
          </div>

          {/* Insignias de Confianza Integradas */}
          <div className="pt-8 border-t border-brand-wine/15 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs font-semibold text-brand-text">
            <div className="flex items-center gap-2 bg-white/75 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-brand-blush/80 shadow-xs">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>Fórmulas de Alta Gama</span>
            </div>

            <div className="flex items-center gap-2 bg-white/75 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-brand-blush/80 shadow-xs">
              <Heart className="w-3.5 h-3.5 text-brand-wine fill-brand-wine/20" />
              <span>Amor por tu Piel & Cabello</span>
            </div>

            <div className="flex items-center gap-2 bg-white/75 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-brand-blush/80 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Atención 100% Personalizada</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
