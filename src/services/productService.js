import { CATEGORIES as INITIAL_CATEGORIES } from '../constants/categories';

/**
 * Capa 1: Servicio de catálogo de productos y categorías
 * Soporta persistencia física en disco (local), persistencia inmune a recargas (Vercel/producción),
 * y respaldo de contingencia.
 */
const STORAGE_PRODUCTS_KEY = 'cpglow_products_v1';
const STORAGE_CATEGORIES_KEY = 'cpglow_categories_v1';
const STORAGE_CUSTOM_ACTIVE_KEY = 'cpglow_custom_catalog_active';
const STORAGE_CUSTOM_CATS_ACTIVE_KEY = 'cpglow_custom_categories_active';

const getBaseAssetUrl = (filename) => {
  const base = import.meta.env.BASE_URL || './';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  return `${cleanBase}${filename}`;
};

export const ProductService = {
  /**
   * Obtiene la lista completa de productos.
   * Si el usuario ha modificado el catálogo, prioriza sus cambios y NO los sobreescribe en recargas.
   */
  async getProducts() {
    // 1. Prioridad: Verificar si existen datos modificados por el administrador en localStorage
    try {
      const isCustomized = localStorage.getItem(STORAGE_CUSTOM_ACTIVE_KEY);
      const cached = localStorage.getItem(STORAGE_PRODUCTS_KEY);
      if (isCustomized === 'true' && cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error al leer catálogo local personalizado:', e);
    }

    // 2. Si no hay catálogo personalizado activo, cargar el catálogo base (products.json)
    try {
      const response = await fetch(getBaseAssetUrl('products.json'), {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const products = await response.json();
        if (Array.isArray(products) && products.length > 0) {
          try {
            localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(products));
          } catch {}
          return products;
        }
      }
    } catch (err) {
      console.warn('Error al cargar /products.json, intentando respaldo local:', err);
    }

    // 3. Fallback de contingencia a cualquier dato previo en localStorage
    try {
      const cached = localStorage.getItem(STORAGE_PRODUCTS_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {}

    return [];
  },

  /**
   * Guarda los productos en localStorage (inmune a recargas en Vercel) y en disco (en desarrollo)
   */
  async saveProducts(productsList) {
    if (!Array.isArray(productsList)) return { success: false, error: 'Lista inválida' };

    // 1. Guardar en localStorage y activar bandera de personalización
    try {
      localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(productsList));
      localStorage.setItem(STORAGE_CUSTOM_ACTIVE_KEY, 'true');
    } catch (e) {
      console.warn('Error al guardar en localStorage:', e);
    }

    // 2. Intentar guardar físicamente en disco mediante el endpoint de Vite (en desarrollo local)
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productsList, null, 2),
      });

      if (response.ok) {
        return { success: true, persistedOnDisk: true };
      }
    } catch (err) {
      // Normal en entornos estáticos como Vercel
    }

    return { success: true, persistedOnDisk: false };
  },

  /**
   * Obtiene la lista de categorías (prioriza personalizadas)
   */
  async getCategories() {
    // 1. Prioridad: Verificar si existen categorías modificadas
    try {
      const isCustomized = localStorage.getItem(STORAGE_CUSTOM_CATS_ACTIVE_KEY);
      const cached = localStorage.getItem(STORAGE_CATEGORIES_KEY);
      if (isCustomized === 'true' && cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}

    // 2. Cargar archivo base categories.json
    try {
      const response = await fetch(getBaseAssetUrl('categories.json'), {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });

      if (response.ok) {
        const cats = await response.json();
        if (Array.isArray(cats) && cats.length > 0) {
          try {
            localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(cats));
          } catch {}
          return cats;
        }
      }
    } catch {}

    // 3. Fallback a localStorage o constantes iniciales
    try {
      const cached = localStorage.getItem(STORAGE_CATEGORIES_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {}

    return INITIAL_CATEGORIES;
  },

  /**
   * Guarda las categorías personalizadas
   */
  async saveCategories(categoriesList) {
    if (!Array.isArray(categoriesList)) return { success: false };

    try {
      localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(categoriesList));
      localStorage.setItem(STORAGE_CUSTOM_CATS_ACTIVE_KEY, 'true');
    } catch {}

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoriesList, null, 2),
      });

      if (response.ok) {
        return { success: true, persistedOnDisk: true };
      }
    } catch {}

    return { success: true, persistedOnDisk: false };
  },

  /**
   * Restablece el catálogo a la versión inicial original de fábrica
   */
  resetToFactory() {
    try {
      localStorage.removeItem(STORAGE_CUSTOM_ACTIVE_KEY);
      localStorage.removeItem(STORAGE_CUSTOM_CATS_ACTIVE_KEY);
      localStorage.removeItem(STORAGE_PRODUCTS_KEY);
      localStorage.removeItem(STORAGE_CATEGORIES_KEY);
    } catch {}
  },

  /**
   * Descarga el archivo products.json al ordenador para respaldo manual
   */
  exportProductsJson(productsList) {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(productsList, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'products.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  },

  /**
   * Filtra productos por categoría, término de búsqueda y orden
   */
  filterProducts(products, { category = 'todos', query = '', sortBy = 'default' }) {
    if (!Array.isArray(products)) return [];

    let filtered = [...products];

    // Filtro por categoría
    if (category && category !== 'todos') {
      filtered = filtered.filter(p => 
        p.categoria && p.categoria.toLowerCase() === category.toLowerCase()
      );
    }

    // Filtro por búsqueda (nombre, descripción o categoría)
    if (query && query.trim() !== '') {
      const cleanQuery = query.toLowerCase().trim();
      filtered = filtered.filter(p => 
        (p.nombre && p.nombre.toLowerCase().includes(cleanQuery)) ||
        (p.descripcion && p.descripcion.toLowerCase().includes(cleanQuery)) ||
        (p.categoria && p.categoria.toLowerCase().includes(cleanQuery))
      );
    }

    // Ordenamiento
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => (a.precio || 0) - (b.precio || 0));
        break;
      case 'price-desc':
        filtered.sort((a, b) => (b.precio || 0) - (a.precio || 0));
        break;
      case 'name-asc':
        filtered.sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''));
        break;
      case 'featured':
        filtered.sort((a, b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0));
        break;
      default:
        break;
    }

    return filtered;
  }
};
