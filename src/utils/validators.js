/**
 * Capa 1: Validaciones de formularios
 */

/**
 * Valida el nombre completo
 */
export const validateFullName = (name) => {
  if (!name || typeof name !== 'string') {
    return { isValid: false, error: 'Por favor ingresa tu nombre completo.' };
  }
  const trimmed = name.trim();
  if (trimmed.length < 3) {
    return { isValid: false, error: 'El nombre debe tener al menos 3 caracteres.' };
  }
  return { isValid: true, error: null };
};

/**
 * Valida el número de teléfono celular
 */
export const validatePhone = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return { isValid: false, error: 'Por favor ingresa tu número de celular.' };
  }
  const cleanPhone = phone.replace(/[\s\-()]/g, '');
  if (!/^\+?\d{7,15}$/.test(cleanPhone)) {
    return { isValid: false, error: 'Ingresa un número de celular válido (mínimo 7 dígitos).' };
  }
  return { isValid: true, error: null };
};
