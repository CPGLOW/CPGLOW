import { useState, useEffect, useMemo, useCallback } from 'react';
import { ProductService } from '../services/productService';

/**
 * Capa 2: Hook para gestión de productos, categorías, filtros y CRUD reactivo
 */
export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');

  // Carga inicial de productos y categorías con escucha en tiempo real
  useEffect(() => {
    let isMounted = true;
    let unsubscribeLive = null;

    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const [productsData, categoriesData] = await Promise.all([
          ProductService.getProducts(),
          ProductService.getCategories(),
        ]);

        if (isMounted) {
          setProducts(productsData);
          setCategories(categoriesData);
          setLoading(false);
        }

        // Si Firebase está activo, escuchar cambios en vivo (para que clientes vean cambios sin recargar)
        unsubscribeLive = ProductService.subscribeToProducts((liveProducts) => {
          if (isMounted && Array.isArray(liveProducts)) {
            setProducts(liveProducts);
          }
        });
      } catch (err) {
        if (isMounted) {
          setError('No fue posible cargar el catálogo de productos.');
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
      if (typeof unsubscribeLive === 'function') {
        unsubscribeLive();
      }
    };
  }, []);

  // Agregar nuevo producto
  const addProduct = useCallback(async (productData) => {
    const newProduct = {
      ...productData,
      id: productData.id || `prod-${Date.now()}`,
      precio: Number(productData.precio) || 0,
      stock: Number(productData.stock) || 0,
      destacado: Boolean(productData.destacado),
      imagenes: Array.isArray(productData.imagenes) ? productData.imagenes.filter(Boolean) : [],
    };

    const updated = [newProduct, ...products];
    setProducts(updated);
    await ProductService.saveProducts(updated);
    return newProduct;
  }, [products]);

  // Actualizar producto existente
  const updateProduct = useCallback(async (updatedProductData) => {
    const cleanProduct = {
      ...updatedProductData,
      precio: Number(updatedProductData.precio) || 0,
      stock: Number(updatedProductData.stock) || 0,
      destacado: Boolean(updatedProductData.destacado),
      imagenes: Array.isArray(updatedProductData.imagenes) ? updatedProductData.imagenes.filter(Boolean) : [],
    };

    const updated = products.map((p) => (p.id === cleanProduct.id ? cleanProduct : p));
    setProducts(updated);
    await ProductService.saveProducts(updated);
    return cleanProduct;
  }, [products]);

  // Eliminar producto
  const deleteProduct = useCallback(async (productId) => {
    const updated = products.filter((p) => p.id !== productId);
    setProducts(updated);
    await ProductService.saveProducts(updated);
    return true;
  }, [products]);

  // Agregar nueva categoría
  const addCategory = useCallback(async (categoryData) => {
    const slug = categoryData.name
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '-');

    const newCategory = {
      id: `cat-${slug}-${Date.now()}`,
      slug: slug,
      name: categoryData.name.trim(),
      iconName: categoryData.iconName || 'Sparkles',
      description: categoryData.description || `Línea de productos ${categoryData.name}`,
    };

    const updated = [...categories, newCategory];
    setCategories(updated);
    await ProductService.saveCategories(updated);
    return newCategory;
  }, [categories]);

  // Descargar respaldo JSON
  const exportProductsJson = useCallback(() => {
    ProductService.exportProductsJson(products);
  }, [products]);

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
    categories,
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
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    exportProductsJson,
  };
};
