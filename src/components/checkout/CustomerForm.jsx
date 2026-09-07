import React from 'react';
import { User, Phone, MapPin, FileText } from 'lucide-react';

export const CustomerForm = ({
  formData,
  errors,
  onChange,
}) => {
  return (
    <div className="space-y-4">
      {/* Campo: Nombre Completo */}
      <div>
        <label className="block text-xs font-semibold text-brand-text mb-1">
          Nombre completo <span className="text-brand-wine">*</span>
        </label>
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-wine/70 pointer-events-none">
            <User className="w-4 h-4" />
          </div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="Ej. Valentina Gómez"
            className={`w-full pl-10 pr-4 py-2.5 rounded-2xl bg-brand-pearl/50 border text-sm text-brand-text placeholder-brand-text-muted/60 focus:outline-none focus:ring-2 transition-all ${
              errors.name
                ? 'border-rose-400 focus:ring-rose-400'
                : 'border-brand-blush focus:ring-brand-wine focus:border-brand-wine'
            }`}
          />
        </div>
        {errors.name && (
          <p className="text-[11px] text-rose-600 mt-1 pl-1 font-medium">
            {errors.name}
          </p>
        )}
      </div>

      {/* Campo: Teléfono Celular */}
      <div>
        <label className="block text-xs font-semibold text-brand-text mb-1">
          Número de Celular (WhatsApp) <span className="text-brand-wine">*</span>
        </label>
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-wine/70 pointer-events-none">
            <Phone className="w-4 h-4" />
          </div>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            placeholder="Ej. 3123456789"
            className={`w-full pl-10 pr-4 py-2.5 rounded-2xl bg-brand-pearl/50 border text-sm text-brand-text placeholder-brand-text-muted/60 focus:outline-none focus:ring-2 transition-all ${
              errors.phone
                ? 'border-rose-400 focus:ring-rose-400'
                : 'border-brand-blush focus:ring-brand-wine focus:border-brand-wine'
            }`}
          />
        </div>
        {errors.phone && (
          <p className="text-[11px] text-rose-600 mt-1 pl-1 font-medium">
            {errors.phone}
          </p>
        )}
      </div>

      {/* Campo: Dirección y Ciudad (Opcional) */}
      <div>
        <label className="block text-xs font-semibold text-brand-text mb-1">
          Ciudad y Dirección de Envío <span className="text-brand-text-muted font-normal">(Opcional)</span>
        </label>
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-wine/70 pointer-events-none">
            <MapPin className="w-4 h-4" />
          </div>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={(e) => onChange('address', e.target.value)}
            placeholder="Ej. Medellín, Cra 43A # 1-50 Apto 402"
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-brand-pearl/50 border border-brand-blush text-sm text-brand-text placeholder-brand-text-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-wine focus:border-brand-wine transition-all"
          />
        </div>
      </div>

      {/* Campo: Notas Adicionales (Opcional) */}
      <div>
        <label className="block text-xs font-semibold text-brand-text mb-1">
          Indicaciones adicionales <span className="text-brand-text-muted font-normal">(Opcional)</span>
        </label>
        <div className="relative">
          <div className="absolute left-3.5 top-3 text-brand-wine/70 pointer-events-none">
            <FileText className="w-4 h-4" />
          </div>
          <textarea
            name="notes"
            rows="2"
            value={formData.notes}
            onChange={(e) => onChange('notes', e.target.value)}
            placeholder="Ej. Si tienen empaque para regalo o instrucciones de entrega..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-brand-pearl/50 border border-brand-blush text-sm text-brand-text placeholder-brand-text-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-wine focus:border-brand-wine transition-all resize-none"
          />
        </div>
      </div>
    </div>
  );
};
