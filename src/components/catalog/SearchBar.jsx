import React from 'react';
import { Search, X } from 'lucide-react';

export const SearchBar = ({
  value = '',
  onChange,
  placeholder = 'Buscar por nombre, beneficio o ingrediente...',
  className = '',
}) => {
  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative flex items-center">
        <div className="absolute left-4 pointer-events-none text-brand-text-muted">
          <Search className="w-5 h-5 text-brand-wine/70" />
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-11 pr-10 py-3 rounded-full bg-white/90 border border-brand-blush text-brand-text placeholder-brand-text-muted/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-wine focus:border-brand-wine shadow-sm transition-all"
        />

        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute right-3.5 p-1 rounded-full text-brand-text-muted hover:text-brand-wine hover:bg-brand-blush/40 transition-colors"
            aria-label="Limpiar búsqueda"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
