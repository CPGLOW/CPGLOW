/**
 * Capa 0: Configuración centralizada de variables de entorno
 */
export const ENV = {
  // Número de WhatsApp receptor (código de país sin signos ni espacios)
  // Por defecto Colombia (+57 312 345 6789). Se puede cambiar en .env
  WHATSAPP_PHONE: import.meta.env.VITE_WHATSAPP_PHONE || '573008318310',

  // Nombre de la marca
  STORE_NAME: import.meta.env.VITE_STORE_NAME || 'CP GLOW',

  // Slogan de la marca
  STORE_SLOGAN: import.meta.env.VITE_STORE_SLOGAN || 'Belleza, Brillo y Cuidado Exclusivo',

  // Moneda por defecto
  CURRENCY: import.meta.env.VITE_CURRENCY || 'COP',

  // Símbolo de moneda
  CURRENCY_SYMBOL: import.meta.env.VITE_CURRENCY_SYMBOL || '$',
};
