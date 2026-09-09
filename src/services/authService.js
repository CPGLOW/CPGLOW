/**
 * Capa 1: Servicio de autenticación discreto para la administración de CP GLOW
 */
const STORAGE_KEY = 'cpglow_admin_session_v1';

export const AuthService = {
  /**
   * Obtiene las credenciales configuradas
   */
  getCredentials() {
    return {
      username: import.meta.env.VITE_ADMIN_USER || 'admin',
      password: import.meta.env.VITE_ADMIN_PASSWORD || 'cpglow2026',
    };
  },

  /**
   * Valida credenciales e inicia sesión
   */
  login(username, password) {
    const creds = this.getCredentials();
    const cleanUser = String(username).trim().toLowerCase();
    const cleanPass = String(password).trim();

    if (cleanUser === creds.username.toLowerCase() && cleanPass === creds.password) {
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
