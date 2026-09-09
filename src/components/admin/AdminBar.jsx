import React from 'react';
import { Plus, FolderPlus, Download, LogOut, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';

export const AdminBar = ({
  onNewProduct,
  onNewCategory,
  onExportJson,
  onLogout,
}) => {
  return (
    <aside aria-label="Barra de herramientas de administración" className="sticky top-0 z-50 bg-brand-wine text-white shadow-luxury border-b border-brand-wine-dark py-2.5 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Identificador de Modo */}
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blush opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-blush"></span>
          </span>
          <span className="text-xs font-bold tracking-wide uppercase flex items-center gap-1.5 text-brand-blush">
            <ShieldCheck className="w-4 h-4" />
            <span>Modo Administración Activo</span>
          </span>
        </div>

        {/* Acciones Rápidas */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onNewProduct}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-brand-wine hover:bg-brand-pearl text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nuevo Producto</span>
          </button>

          <button
            type="button"
            onClick={onNewCategory}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-wine-dark/80 hover:bg-brand-wine-dark text-brand-blush border border-brand-blush/40 text-xs font-semibold transition-all active:scale-95 cursor-pointer"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>Nueva Categoría</span>
          </button>

          <button
            type="button"
            onClick={onExportJson}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-wine-dark/60 hover:bg-brand-wine-dark text-white text-xs font-medium transition-all cursor-pointer"
            title="Descargar copia de respaldo en products.json"
          >
            <Download className="w-3.5 h-3.5 text-brand-blush" />
            <span className="hidden md:inline">Descargar JSON</span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-950/60 hover:bg-rose-900 text-rose-200 text-xs font-medium transition-all ml-1 cursor-pointer"
            title="Cerrar sesión de administración"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Salir</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
