import React, { useState, useRef } from 'react';
import { Sparkles, SlidersHorizontal, Layers } from 'lucide-react';
import { Navbar } from './components/layout/Navbar';
import { HeroBanner } from './components/layout/HeroBanner';
import { Footer } from './components/layout/Footer';
import { CategoryFilter } from './components/catalog/CategoryFilter';
import { SearchBar } from './components/catalog/SearchBar';
import { ProductGrid } from './components/catalog/ProductGrid';
import { ProductDetailModal } from './components/catalog/ProductDetailModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { Toast } from './components/common/Toast';
import { useProducts } from './hooks/useProducts';

export const App = () => {
  const {
    filteredProducts,
    loading,
    error,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    resetFilters,
    filteredCount,
    totalCount,
  } = useProducts();

  // Estados de Modales
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const catalogRef = useRef(null);

  const handleScrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-pearl selection:bg-brand-blush selection:text-brand-wine">
      {/* 1. Header / Navbar */}
      <Navbar />

      {/* 2. Hero Banner */}
      <HeroBanner onExploreClick={handleScrollToCatalog} />

      {/* 3. Sección de Catálogo Principal */}
      <main ref={catalogRef} id="catalogo" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Cabecera del catálogo */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-brand-wine font-semibold text-xs tracking-wider uppercase mb-1">
              <Layers className="w-4 h-4" />
              <span>Colección Oficial</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-text">
              Explora Nuestro Catálogo
            </h2>
          </div>

          {/* Contador de productos */}
          <div className="text-xs sm:text-sm text-brand-text-muted">
            Mostrando <strong className="text-brand-wine font-bold">{filteredCount}</strong> de {totalCount} productos disponibles
          </div>
        </div>

        {/* Barra de Filtros y Búsqueda */}
        <div className="space-y-4 mb-8">
          {/* Fila 1: Filtros de Categorías */}
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* Fila 2: Buscador y Ordenador */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 w-full">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
              />
            </div>

            {/* Selector de ordenamiento */}
            <div className="flex items-center gap-2 self-end sm:self-auto w-full sm:w-auto">
              <div className="relative w-full sm:w-auto">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full sm:w-auto appearance-none pl-4 pr-10 py-3 rounded-full bg-white border border-brand-blush text-xs sm:text-sm font-medium text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-wine focus:border-brand-wine shadow-sm cursor-pointer"
                  aria-label="Ordenar productos por"
                >
                  <option value="default">Orden: Por Defecto</option>
                  <option value="featured">Destacados Primero</option>
                  <option value="price-asc">Precio: Menor a Mayor</option>
                  <option value="price-desc">Precio: Mayor a Menor</option>
                  <option value="name-asc">Nombre: A - Z</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-brand-wine">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mensaje de error si falla la carga */}
        {error && (
          <div className="p-4 mb-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm text-center">
            {error}
          </div>
        )}

        {/* 4. Grilla de Productos */}
        <ProductGrid
          products={filteredProducts}
          loading={loading}
          onViewDetails={handleViewDetails}
          onResetFilters={resetFilters}
        />
      </main>

      {/* 5. Footer */}
      <Footer />

      {/* 6. Modales y Overlays */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />

      <CartDrawer
        onOpenCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      {/* 7. Toast Flotante */}
      <Toast />
    </div>
  );
};
