import React, { useState } from 'react';
import { ShoppingBag, Eye, Sparkles, Pencil, Trash2, Images } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { QuantitySelector } from '../common/QuantitySelector';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { useCart } from '../../hooks/useCart';

export const ProductCard = ({ 
  product, 
  onViewDetails,
  isAdmin = false,
  onEdit,
  onDelete,
}) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);

  const isOutOfStock = (product.stock || 0) <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const hasMultipleImages = Array.isArray(product.imagenes) && product.imagenes.length > 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, quantity);
    setQuantity(1);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    if (onEdit) onEdit(product);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (window.confirm(`¿Estás segura de que deseas eliminar "${product.nombre}" del catálogo?`)) {
      if (onDelete) onDelete(product.id);
    }
  };

  return (
    <div
      onClick={() => onViewDetails(product)}
      className="group relative bg-white rounded-3xl overflow-hidden border border-brand-blush/70 shadow-card hover:shadow-luxury hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Botones de Administración Flotantes (Solo visibles para la dueña) */}
      {isAdmin && (
        <div 
          className="absolute top-3 right-3 z-30 flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1 rounded-2xl shadow-lg border border-brand-blush"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={handleEditClick}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-brand-wine text-white text-xs font-semibold hover:bg-brand-wine-dark transition-colors shadow-sm cursor-pointer"
            title="Editar producto"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Editar</span>
          </button>
          <button
            type="button"
            onClick={handleDeleteClick}
            className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Eliminar producto"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Contenedor de Imagen con Relación de Aspecto Elegante */}
      <div className="relative aspect-square w-full overflow-hidden bg-brand-pearl/60">
        {/* Placeholder mientras carga */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-brand-pearl animate-pulse flex items-center justify-center text-brand-blush">
            <Sparkles className="w-8 h-8 opacity-40" />
          </div>
        )}

        <img
          src={product.imagen}
          alt={product.nombre}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
        />

        {/* Indicador discreto si tiene más de 1 imagen */}
        {hasMultipleImages && !isAdmin && (
          <div className="absolute top-3 right-3 z-10">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-[10px] font-medium">
              <Images className="w-2.5 h-2.5 text-brand-blush" />
              <span>+{product.imagenes.length}</span>
            </span>
          </div>
        )}

        {/* Overlay sutil al hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-brand-wine text-xs font-semibold shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5" />
            <span>Ver detalles</span>
          </span>
        </div>

        {/* Badges superiores (Destacado, Más vendido, Stock) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <Badge variant="wine" size="xs">
              {product.badge}
            </Badge>
          )}
          {product.destacado && !product.badge && (
            <Badge variant="wine" size="xs">
              Destacado
            </Badge>
          )}
          {isOutOfStock ? (
            <Badge variant="danger" size="xs">
              Agotado
            </Badge>
          ) : isLowStock ? (
            <Badge variant="warning" size="xs">
              Últimas {product.stock} unid.
            </Badge>
          ) : null}
        </div>
      </div>

      {/* Cuerpo de la Tarjeta */}
      <div className="p-5 flex flex-col flex-grow justify-between bg-gradient-to-b from-white to-brand-pearl/30">
        <div>
          {/* Categoría */}
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-wine/70 block mb-1">
            {product.categoria}
          </span>

          {/* Nombre del Producto */}
          <h3 className="font-serif text-base sm:text-lg font-bold text-brand-text leading-snug line-clamp-2 group-hover:text-brand-wine transition-colors mb-2">
            {product.nombre}
          </h3>

          {/* Breve descripción */}
          <p className="text-xs text-brand-text-muted line-clamp-2 mb-4 leading-relaxed">
            {product.descripcion}
          </p>
        </div>

        {/* Sección de Precio, Cantidad y Botón de Compra */}
        <div className="pt-3 border-t border-brand-nude/70">
          <div className="flex items-baseline justify-between mb-3">
            <span className="text-xs text-brand-text-muted font-medium">Precio</span>
            <span className="font-serif text-xl sm:text-2xl font-bold text-brand-wine">
              {formatCurrency(product.precio)}
            </span>
          </div>

          {/* Acciones de Compra */}
          <div
            className="flex items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Selector de cantidad */}
            <QuantitySelector
              quantity={quantity}
              max={product.stock || 1}
              min={1}
              onChange={setQuantity}
              disabled={isOutOfStock}
              size="sm"
            />

            {/* Botón Añadir */}
            <Button
              variant="primary"
              size="sm"
              icon={ShoppingBag}
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className="flex-1 text-xs sm:text-sm py-2"
            >
              {isOutOfStock ? 'Agotado' : 'Agregar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
