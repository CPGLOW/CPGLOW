/**
 * Capa 1: Servicio de autenticación discreto para la administración de CP GLOW
 * Utiliza hash criptográfico SHA-256 para no exponer contraseñas en texto plano en repositorios
 */
const STORAGE_KEY = 'cpglow_admin_session_v1';

// Hash criptográfico SHA-256 de la contraseña por defecto
const DEFAULT_PASS_HASH = '20d71702fcd2d33d3308db313b448ce8dc34d998b4b93ae834e5d018ad23c531';

async function computeSha256(text) {
  if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
    return text;
  }
  const msgBuffer = new TextEncoder().encode(text);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export const AuthService = {
  /**
   * Obtiene el usuario configurado
   */
  getCredentials() {
    return {
      username: import.meta.env.VITE_ADMIN_USER || 'cpglow-2026',
      password: import.meta.env.VITE_ADMIN_PASSWORD || '',
    };
  },

  /**
   * Valida credenciales de forma asíncrona y segura
   */
  async login(username, password) {
    const creds = this.getCredentials();
    const cleanUser = String(username).trim().toLowerCase();
    const cleanPass = String(password).trim();

    if (cleanUser !== creds.username.toLowerCase()) {
      return { success: false, error: 'Usuario o contraseña incorrectos' };
    }

    let isMatch = false;

    // 1. Si existe variable de entorno con contraseña definida
    if (creds.password) {
      isMatch = (cleanPass === creds.password);
    } else {
      // 2. Si no hay variable (ej: código público en GitHub), verifica contra el hash SHA-256
      const hashed = await computeSha256(cleanPass);
      isMatch = (hashed === DEFAULT_PASS_HASH);
    }

    if (isMatch) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          authenticated: true,
          timestamp: Date.now(),
        }));
      } catch (e) {
        console.warn('No se pudo guardar la sesión en localStorage:', e);
      }
      return { success: true };
    }

    return { success: false, error: 'Usuario o contraseña incorrectos' };
  },

  /**
   * Verifica si la sesión de administración está activa
   */
  isAuthenticated() {
    try {
      const session = localStorage.getItem(STORAGE_KEY);
      if (!session) return false;
      const parsed = JSON.parse(session);
      return Boolean(parsed && parsed.authenticated);
    } catch {
      return false;
    }
  },

  /**
   * Cierra la sesión
   */
  logout() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Error al cerrar sesión:', e);
    }
  },
};
