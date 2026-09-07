/**
 * Capa 1: Servicio de almacenamiento local seguro con fallback en memoria
 */
const STORAGE_KEYS = {
  CART: 'cpglow_cart_items_v1',
  CUSTOMER_CACHE: 'cpglow_customer_cache_v1',
};

// Fallback en memoria si localStorage está deshabilitado o bloqueado
const memoryFallback = new Map();

const isStorageAvailable = () => {
  try {
    const testKey = '__cpglow_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

export const StorageService = {
  /**
   * Obtiene los elementos del carrito guardados
   */
  getCartItems: () => {
    try {
      if (isStorageAvailable()) {
        const raw = window.localStorage.getItem(STORAGE_KEYS.CART);
        return raw ? JSON.parse(raw) : [];
      }
      return memoryFallback.get(STORAGE_KEYS.CART) || [];
    } catch (error) {
      console.error('Error al leer el carrito de storage:', error);
      return [];
    }
  },

  /**
   * Guarda los elementos del carrito
   */
  saveCartItems: (items) => {
    try {
      if (isStorageAvailable()) {
        window.localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
      } else {
        memoryFallback.set(STORAGE_KEYS.CART, items);
      }
    } catch (error) {
      console.error('Error al guardar el carrito en storage:', error);
    }
  },

  /**
   * Limpia el carrito persistido
   */
  clearCart: () => {
    try {
      if (isStorageAvailable()) {
        window.localStorage.removeItem(STORAGE_KEYS.CART);
      } else {
        memoryFallback.delete(STORAGE_KEYS.CART);
      }
    } catch (error) {
      console.error('Error al limpiar el carrito en storage:', error);
    }
  },

  /**
   * Guarda datos de contacto del cliente para conveniencia
   */
  saveCustomerData: (data) => {
    try {
      if (isStorageAvailable()) {
        window.localStorage.setItem(STORAGE_KEYS.CUSTOMER_CACHE, JSON.stringify(data));
      }
    } catch (e) {}
  },

  /**
   * Recupera datos previos del cliente
   */
  getCustomerData: () => {
    try {
      if (isStorageAvailable()) {
        const raw = window.localStorage.getItem(STORAGE_KEYS.CUSTOMER_CACHE);
        return raw ? JSON.parse(raw) : null;
      }
    } catch (e) {}
    return null;
  }
};
