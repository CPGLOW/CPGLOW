import { useState, useEffect, useMemo, useCallback } from 'react';
import { ProductService } from '../services/productService';

/**
 * Capa 2: Hook para gestión de productos, filtros y búsqueda
 */
export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');

  // Carga inicial
  useEffect(() => {
    let isMounted = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await ProductService.getProducts();
        if (isMounted) {
          setProducts(data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError('No fue posible cargar el catálogo de productos.');
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  // Lista filtrada reactiva
  const filteredProducts = useMemo(() => {
    return ProductService.filterProducts(products, {
      category: selectedCategory,
      query: searchQuery,
      sortBy: sortBy,
    });
  }, [products, selectedCategory, searchQuery, sortBy]);

  // Limpiar filtros
  const resetFilters = useCallback(() => {
    setSelectedCategory('todos');
    setSearchQuery('');
    setSortBy('default');
  }, []);

  return {
    products,
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
    totalCount: products.length,
    filteredCount: filteredProducts.length,
  };
};
