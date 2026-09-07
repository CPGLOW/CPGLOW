/**
 * Capa 1: Servicio de catálogo de productos
 * Carga de forma desacoplada los productos desde /products.json
 */

export const ProductService = {
  /**
   * Obtiene la lista completa de productos desde el archivo público products.json
   */
  async getProducts() {
    try {
      const response = await fetch('/products.json', {
        headers: {
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} al cargar productos`);
      }

      const products = await response.json();
      return Array.isArray(products) ? products : [];
    } catch (error) {
      console.error('Error en ProductService.getProducts:', error);
      throw error;
    }
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

    // Filtro por búsqueda (nombre o descripción)
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
        // Orden por defecto
        break;
    }

    return filtered;
  }
};
