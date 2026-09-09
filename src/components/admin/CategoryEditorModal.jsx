import React, { useState } from 'react';
import { 
  FolderPlus, 
  Sparkles, 
  Scissors, 
  Droplets, 
  Smile, 
  HeartHandshake, 
  Crown, 
  Gem, 
  Feather, 
  Flower2, 
  Tag 
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

const AVAILABLE_ICONS = [
  { name: 'Sparkles', label: 'Brillo', Icon: Sparkles },
  { name: 'Droplets', label: 'Gotas', Icon: Droplets },
  { name: 'Flower2', label: 'Flor', Icon: Flower2 },
  { name: 'Scissors', label: 'Tijeras', Icon: Scissors },
  { name: 'Smile', label: 'Sonrisa', Icon: Smile },
  { name: 'Crown', label: 'Corona', Icon: Crown },
  { name: 'Gem', label: 'Gema', Icon: Gem },
  { name: 'HeartHandshake', label: 'Cuidado', Icon: HeartHandshake },
  { name: 'Feather', label: 'Pluma', Icon: Feather },
  { name: 'Tag', label: 'Etiqueta', Icon: Tag },
];

export const CategoryEditorModal = ({ isOpen, onClose, onSaveCategory }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Sparkles');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor ingresa el nombre de la categoría');
      return;
    }

    onSaveCategory({
      name: name.trim(),
      description: description.trim(),
      iconName: selectedIcon,
    });

    setName('');
    setDescription('');
    setSelectedIcon('Sparkles');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="p-6 sm:p-7 bg-white rounded-3xl">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-brand-pearl text-brand-wine border border-brand-blush flex items-center justify-center">
            <FolderPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-brand-text">
              Nueva Categoría
            </h3>
            <p className="text-xs text-brand-text-muted">
              Se agregará de inmediato al filtro superior del catálogo
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 text-rose-800 text-xs font-medium border border-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-brand-text mb-1 uppercase tracking-wider">
              Nombre de la Categoría *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Perfumería, Accesorios, Aromas..."
              required
              className="w-full px-4 py-2.5 rounded-2xl bg-brand-pearl/40 border border-brand-blush/80 text-sm text-brand-text placeholder:text-brand-text-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-wine focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-text mb-1 uppercase tracking-wider">
              Descripción Corta (Opcional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Fragancias exclusivas y esencias florales"
              className="w-full px-4 py-2.5 rounded-2xl bg-brand-pearl/40 border border-brand-blush/80 text-sm text-brand-text placeholder:text-brand-text-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-wine focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-text mb-2 uppercase tracking-wider">
              Ícono Representativo
            </label>
            <div className="grid grid-cols-5 gap-2">
              {AVAILABLE_ICONS.map(({ name: iconKey, label, Icon }) => (
                <button
                  key={iconKey}
                  type="button"
                  onClick={() => setSelectedIcon(iconKey)}
                  className={`p-2 rounded-2xl flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                    selectedIcon === iconKey
                      ? 'bg-brand-wine text-white border-brand-wine shadow-sm'
                      : 'bg-white text-brand-text hover:bg-brand-pearl border-brand-blush/60'
                  }`}
                  title={label}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[9px] font-medium leading-none truncate w-full text-center">
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
            >
              Crear Categoría
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
