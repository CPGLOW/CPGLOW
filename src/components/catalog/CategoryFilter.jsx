import React from 'react';
import { 
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
import { CATEGORIES as DEFAULT_CATEGORIES } from '../../constants/categories';

// Mapa ampliado de iconos de Lucide
const ICON_MAP = {
  Sparkles,
  Scissors,
  Droplets,
  Smile,
  HeartHandshake,
  Crown,
  Gem,
  Feather,
  Flower2,
  Tag,
};

export const CategoryFilter = ({
  selectedCategory = 'todos',
  categories = [],
  onSelectCategory,
  className = '',
}) => {
  const activeCategories = (categories && categories.length > 0) ? categories : DEFAULT_CATEGORIES;

  return (
    <div className={`overflow-x-auto pb-2 scrollbar-none ${className}`}>
      <div className="flex items-center gap-2.5 min-w-max">
        {activeCategories.map((cat) => {
          const isSelected = selectedCategory.toLowerCase() === cat.slug.toLowerCase();
          const Icon = ICON_MAP[cat.iconName] || Tag;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer select-none active:scale-95 ${
                isSelected
                  ? 'bg-brand-wine text-white shadow-glow-wine scale-105'
                  : 'bg-white text-brand-text hover:bg-brand-blush/40 hover:text-brand-wine border border-brand-blush/80 shadow-sm'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-brand-blush' : 'text-brand-wine'}`} />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
