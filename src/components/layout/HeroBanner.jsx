import React from 'react';
import { Sparkles, ShieldCheck, Heart, ArrowDown } from 'lucide-react';
import { Button } from '../common/Button';

export const HeroBanner = ({ onExploreClick }) => {
  return (
    <section className="relative overflow-hidden bg-radial-glow py-10 sm:py-16 border-b border-brand-blush/40">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-10 -left-20 w-72 h-72 rounded-full bg-brand-blush/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-20 w-80 h-80 rounded-full bg-brand-nude/60 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge superior */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-brand-blush shadow-sm mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4 text-brand-wine" />
            <span className="text-xs sm:text-sm font-semibold text-brand-wine tracking-wide uppercase">
              Colección Exclusiva de Belleza
            </span>
          </div>

          {/* Título Principal de la Marca */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-brand-wine tracking-tight leading-[1.15] mb-5">
            Realza tu luz propia con el cuidado que mereces
          </h1>

          {/* Subtítulo */}
          <p className="text-base sm:text-lg text-brand-text-muted leading-relaxed mb-8 max-w-2xl mx-auto">
            Productos capilares de alta nutrición, rutinas de skin care iluminadoras y delicias corporales para tu ritual diario.
          </p>

          {/* Botones de acción */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              icon={ArrowDown}
              iconPosition="right"
              onClick={onExploreClick}
              className="shadow-glow-wine"
            >
              Explorar Catálogo
            </Button>
          </div>

          {/* Pilares de confianza */}
          <div className="mt-12 pt-8 border-t border-brand-blush/40 grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
            <div className="flex items-center justify-center gap-2 p-2">
              <div className="w-8 h-8 rounded-full bg-brand-blush/50 flex items-center justify-center text-brand-wine">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-brand-text">Fórmulas Premium</span>
            </div>

            <div className="flex items-center justify-center gap-2 p-2">
              <div className="w-8 h-8 rounded-full bg-brand-blush/50 flex items-center justify-center text-brand-wine">
                <Heart className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-brand-text">Amor por tu Piel</span>
            </div>

            <div className="col-span-2 md:col-span-1 flex items-center justify-center gap-2 p-2">
              <div className="w-8 h-8 rounded-full bg-brand-blush/50 flex items-center justify-center text-brand-wine">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-brand-text">Compra 100% Segura</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
