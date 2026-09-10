import React, { useState } from 'react';
import { Lock, User, KeyRound, Eye, EyeOff, Sparkles } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { AuthService } from '../../services/authService';

export const AdminLoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = AuthService.login(username, password);
    setLoading(false);

    if (result.success) {
      setUsername('');
      setPassword('');
      setError('');
      if (onLoginSuccess) onLoginSuccess();
      onClose();
    } else {
      setError(result.error || 'Credenciales inválidas');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="p-6 sm:p-8 bg-white rounded-3xl">
        {/* Cabecera */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-brand-pearl text-brand-wine border border-brand-blush flex items-center justify-center mx-auto mb-3 shadow-glow">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-brand-text">
            Acceso de Administración
          </h2>
          <p className="text-xs text-brand-text-muted mt-1">
            Panel exclusivo para la gestión del catálogo de CP GLOW
          </p>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs text-center font-medium">
            {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-brand-text mb-1 uppercase tracking-wider">
              Usuario
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu usuario"
                required
                autoFocus
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-brand-pearl/40 border border-brand-blush/80 text-sm text-brand-text placeholder:text-brand-text-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-wine focus:bg-white transition-all"
              />
              <User className="w-4 h-4 text-brand-wine/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-text mb-1 uppercase tracking-wider">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-10 py-3 rounded-2xl bg-brand-pearl/40 border border-brand-blush/80 text-sm text-brand-text placeholder:text-brand-text-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-wine focus:bg-white transition-all"
              />
              <KeyRound className="w-4 h-4 text-brand-wine/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-text-muted hover:text-brand-wine transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={loading}
              className="w-full py-3 shadow-glow-wine text-sm font-semibold"
            >
              {loading ? 'Verificando...' : 'Iniciar Sesión'}
            </Button>
          </div>
        </form>

        {/* Nota de seguridad sin exponer claves */}
        <div className="mt-6 pt-4 border-t border-brand-nude/70 text-center">
          <p className="text-[11px] text-brand-text-muted">
            Acceso restringido para administración autorizada.
          </p>
        </div>
      </div>
    </Modal>
  );
};
