import React from 'react';
import { Sparkles, SearchX } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { Button } from '../common/Button';

export const ProductGrid = ({
  products = [],
  loading = false,
  onViewDetails,
  onResetFilters,
  isAdmin = false,
  onEditProduct,
  onDeleteProduct,
}) => {
  // Estado de carga (Skeletons elegantes)
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-3xl overflow-hidden border border-brand-blush/40 p-4 animate-pulse space-y-4 shadow-card"
          >
            <div className="aspect-square bg-brand-pearl rounded-2xl w-full" />
            <div className="h-4 bg-brand-nude/70 rounded-full w-1/3" />
            <div className="h-6 bg-brand-blush/40 rounded-full w-3/4" />
            <div className="h-4 bg-brand-nude/50 rounded-full w-full" />
            <div className="pt-2 flex justify-between items-center">
              <div className="h-6 bg-brand-nude rounded-full w-1/4" />
              <div className="h-9 bg-brand-blush/60 rounded-full w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Estado vacío: Sin resultados
  if (products.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-white/60 rounded-3xl border border-brand-blush/80 max-w-lg mx-auto shadow-sm my-8">
        <div className="w-16 h-16 rounded-full bg-brand-blush/50 text-brand-wine flex items-center justify-center mx-auto mb-4">
          <SearchX className="w-8 h-8" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-brand-wine mb-2">
          No encontramos productos
        </h3>
        <p className="text-sm text-brand-text-muted mb-6 leading-relaxed">
          No hay productos que coincidan con tu búsqueda o filtro seleccionado en este momento.
        </p>
        <Button variant="secondary" onClick={onResetFilters}>
          Restablecer Filtros
        </Button>
      </div>
    );
  }

  // Grilla activa de productos
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onViewDetails={onViewDetails}
          isAdmin={isAdmin}
          onEdit={onEditProduct}
          onDelete={onDeleteProduct}
        />
      ))}
    </div>
  );
};
