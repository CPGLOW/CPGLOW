import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-xl',
  className = '',
}) => {
  // Bloquear scroll del body al abrir el modal
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
      {/* Backdrop con desenfoque elegante */}
      <div
        className="fixed inset-0 bg-brand-text/50 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Contenedor Modal */}
      <div
        className={`relative w-full ${maxWidth} max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-brand-blush/80 overflow-hidden z-10 flex flex-col animate-slide-up ${className}`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header si existe título */}
        {(title || subtitle) && (
          <div className="px-6 pt-5 pb-4 border-b border-brand-nude flex items-start justify-between bg-brand-pearl/50 flex-shrink-0">
            <div>
              {title && (
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-brand-wine">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs sm:text-sm text-brand-text-muted mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-brand-text-muted hover:text-brand-wine hover:bg-brand-blush/40 transition-colors cursor-pointer"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        )}

        {/* Botón de cierre flotante si no hay header con título (Siempre visible, con fondo y sombra) */}
        {!title && !subtitle && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-30 p-2.5 rounded-full bg-white/95 backdrop-blur-md text-brand-wine shadow-lg hover:bg-brand-wine hover:text-white transition-all border border-brand-blush/80 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-wine"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        )}

        {/* Contenido */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          {children}
        </div>
      </div>
    </div>
  );
};
