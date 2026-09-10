import { CATEGORIES as INITIAL_CATEGORIES } from '../constants/categories';
import { db, isFirebaseConfigured } from './firebase';
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';

/**
 * Capa 1: Servicio de catálogo de productos y categorías de CP GLOW
 * Sincronización en la Nube (Firebase Firestore) + Persistencia Local (LocalStorage) + Fallback Estático
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
   * 1. Si Firebase está activo, consulta Firestore en la nube (con auto-migración de datos base).
   * 2. Si no, consulta caché local persistente o archivo base products.json.
   */
  async getProducts() {
    // 1. Intentar cargar desde Firebase Firestore (Base de Datos en la Nube)
    if (isFirebaseConfigured && db) {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        if (!querySnapshot.empty) {
          const firestoreProducts = querySnapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          }));

          // Actualizar caché de contingencia local
          try {
            localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(firestoreProducts));
            localStorage.setItem(STORAGE_CUSTOM_ACTIVE_KEY, 'true');
          } catch {}

          return firestoreProducts;
        }

        // Si la colección de Firestore está vacía (primer uso), realizar auto-seed inicial
        console.info('[CP GLOW Firebase] Colección de productos vacía. Sembrando catálogo inicial en Firestore...');
        const initialProducts = await this.fetchStaticProducts();
        if (initialProducts.length > 0) {
          await this.syncAllProductsToFirestore(initialProducts);
          return initialProducts;
        }
      } catch (firestoreErr) {
        console.warn('[CP GLOW Firebase] Error al consultar Firestore, usando respaldo:', firestoreErr);
      }
    }

    // 2. Si no hay Firebase o falló la conexión: Usar datos locales guardados
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
      console.warn('Error al leer catálogo local:', e);
    }

    // 3. Cargar catálogo estático inicial desde products.json
    return await this.fetchStaticProducts();
  },

  /**
   * Carga el archivo products.json estático
   */
  async fetchStaticProducts() {
    try {
      const response = await fetch(getBaseAssetUrl('products.json'), {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/json',
        },
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
      console.warn('Error al cargar /products.json:', err);
    }

    // Fallback de emergencia
    try {
      const cached = localStorage.getItem(STORAGE_PRODUCTS_KEY);
      if (cached) return JSON.parse(cached);
    } catch {}

    return [];
  },

  /**
   * Guarda los productos en Firestore (en la nube), en localStorage y en disco local si está en desarrollo
   */
  async saveProducts(productsList) {
    if (!Array.isArray(productsList)) return { success: false, error: 'Lista inválida' };

    // 1. Guardar de inmediato en localStorage para respuesta instantánea en UI
    try {
      localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(productsList));
      localStorage.setItem(STORAGE_CUSTOM_ACTIVE_KEY, 'true');
    } catch (e) {
      console.warn('Error al guardar en localStorage:', e);
    }

    // 2. Si Firebase está activo, sincronizar en la nube en Firestore
    if (isFirebaseConfigured && db) {
      try {
        await this.syncAllProductsToFirestore(productsList);
      } catch (fbErr) {
        console.warn('[CP GLOW Firebase] No se pudo sincronizar en Firestore:', fbErr);
      }
    }

    // 3. Si está en entorno local Vite dev, persistir en disco físico
    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productsList, null, 2),
      });
    } catch (err) {
      // Normal en entornos estáticos como Vercel
    }

    return { success: true };
  },

  /**
   * Sincroniza la lista completa de productos en Firestore
   */
  async syncAllProductsToFirestore(productsList) {
    if (!isFirebaseConfigured || !db || !Array.isArray(productsList)) return;

    // Obtener documentos existentes para detectar eliminaciones
    const currentSnap = await getDocs(collection(db, 'products'));
    const currentDocIds = new Set(currentSnap.docs.map((d) => d.id));
    const newDocIds = new Set(productsList.map((p) => p.id));

    // Guardar / Actualizar productos en Firestore
    const savePromises = productsList.map((product) => {
      const cleanProduct = {
        id: product.id,
        nombre: product.nombre || '',
        precio: Number(product.precio) || 0,
        categoria: product.categoria || 'todos',
        descripcion: product.descripcion || '',
        imagen: product.imagen || '',
        imagenes: Array.isArray(product.imagenes) ? product.imagenes : [],
        destacado: Boolean(product.destacado),
        stock: Number(product.stock) || 0,
        updatedAt: Date.now(),
      };
      return setDoc(doc(db, 'products', product.id), cleanProduct);
    });

    // Eliminar de Firestore productos que fueron borrados
    const deletePromises = [];
    for (const oldId of currentDocIds) {
      if (!newDocIds.has(oldId)) {
        deletePromises.push(deleteDoc(doc(db, 'products', oldId)));
      }
    }

    await Promise.all([...savePromises, ...deletePromises]);
  },

  /**
   * Suscripción en tiempo real a productos mediante Firestore
   */
  subscribeToProducts(callback) {
    if (!isFirebaseConfigured || !db) return null;
    try {
      const unsubscribe = onSnapshot(
        collection(db, 'products'),
        (snapshot) => {
          if (!snapshot.empty) {
            const list = snapshot.docs.map((docSnap) => ({
              id: docSnap.id,
              ...docSnap.data(),
            }));
            try {
              localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(list));
              localStorage.setItem(STORAGE_CUSTOM_ACTIVE_KEY, 'true');
            } catch {}
            callback(list);
          }
        },
        (error) => {
          console.warn('[CP GLOW Firebase] Error en suscripción a productos:', error);
        }
      );
      return unsubscribe;
    } catch (e) {
      console.warn('[CP GLOW Firebase] No fue posible activar listener en tiempo real:', e);
      return null;
    }
  },

  /**
   * Obtiene la lista de categorías
   */
  async getCategories() {
    // 1. Si Firebase está activo, cargar categorías de Firestore
    if (isFirebaseConfigured && db) {
      try {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        if (!querySnapshot.empty) {
          const cats = querySnapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          }));
          try {
            localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(cats));
            localStorage.setItem(STORAGE_CUSTOM_CATS_ACTIVE_KEY, 'true');
          } catch {}
          return cats;
        }

        // Sembrado inicial de categorías en Firestore si está vacía
        const initialCategories = await this.fetchStaticCategories();
        if (initialCategories.length > 0) {
          await this.syncAllCategoriesToFirestore(initialCategories);
          return initialCategories;
        }
      } catch (err) {
        console.warn('[CP GLOW Firebase] Error al leer categorías en Firestore:', err);
      }
    }

    // 2. Caché local personalizada
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

    // 3. Archivo estático categories.json
    return await this.fetchStaticCategories();
  },

  /**
   * Carga el archivo categories.json estático
   */
  async fetchStaticCategories() {
    try {
      const response = await fetch(getBaseAssetUrl('categories.json'), {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
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

    try {
      const cached = localStorage.getItem(STORAGE_CATEGORIES_KEY);
      if (cached) return JSON.parse(cached);
    } catch {}

    return INITIAL_CATEGORIES;
  },

  /**
   * Guarda categorías en Firestore, en localStorage y en disco
   */
  async saveCategories(categoriesList) {
    if (!Array.isArray(categoriesList)) return { success: false };

    try {
      localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(categoriesList));
      localStorage.setItem(STORAGE_CUSTOM_CATS_ACTIVE_KEY, 'true');
    } catch {}

    if (isFirebaseConfigured && db) {
      try {
        await this.syncAllCategoriesToFirestore(categoriesList);
      } catch (err) {
        console.warn('[CP GLOW Firebase] Error al guardar categorías en Firestore:', err);
      }
    }

    try {
      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoriesList, null, 2),
      });
    } catch {}

    return { success: true };
  },

  /**
   * Sincroniza categorías en Firestore
   */
  async syncAllCategoriesToFirestore(categoriesList) {
    if (!isFirebaseConfigured || !db || !Array.isArray(categoriesList)) return;

    const promises = categoriesList.map((cat) => {
      const cleanCat = {
        id: cat.id,
        slug: cat.slug || '',
        name: cat.name || '',
        iconName: cat.iconName || 'Sparkles',
        description: cat.description || '',
      };
      return setDoc(doc(db, 'categories', cat.id), cleanCat);
    });

    await Promise.all(promises);
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
      filtered = filtered.filter(
        (p) => p.categoria && p.categoria.toLowerCase() === category.toLowerCase()
      );
    }

    // Filtro por búsqueda (nombre, descripción o categoría)
    if (query && query.trim() !== '') {
      const cleanQuery = query.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
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
  },
};
