import { ENV } from '../config/env';

/**
 * Capa 1: Formateador de moneda con estilo local
 * @param {number} amount
 * @returns {string} Ejemplo: "$ 45.000"
 */
export const formatCurrency = (amount) => {
  if (typeof amount !== 'number') {
    amount = Number(amount) || 0;
  }
  
  // Formateador con separador de miles
  const formatted = new Intl.NumberFormat('es-CO', {
    maximumFractionDigits: 0,
  }).format(amount);
  
  return `${ENV.CURRENCY_SYMBOL} ${formatted}`;
};

/**
 * Truncar texto con puntos suspensivos
 */
export const truncateText = (text, maxLength = 80) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
};

/**
 * Formatear número de teléfono para visualización limpia
 */
export const formatPhoneDisplay = (phone) => {
  if (!phone) return '';
  const clean = phone.replace(/\D/g, '');
  if (clean.length === 10) {
    return `${clean.slice(0, 3)} ${clean.slice(3, 6)} ${clean.slice(6)}`;
  }
  return clean;
};
