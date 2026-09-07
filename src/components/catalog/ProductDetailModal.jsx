import React, { useState } from 'react';
import { ShoppingBag, Sparkles, Check, ShieldCheck, Heart } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { QuantitySelector } from '../common/QuantitySelector';
import { formatCurrency } from '../../utils/formatters';
import { useCart } from '../../hooks/useCart';

export const ProductDetailModal = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const isOutOfStock = (product.stock || 0) <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleAdd = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    onClose();
    setQuantity(1);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-3xl" className="!p-0 h-[88vh] md:h-[560px] max-h-[620px]">
      <div className="flex flex-col md:flex-row h-full w-full overflow-hidden bg-white">
        {/* Columna Izquierda / Superior: Imagen SIEMPRE INTACTA Y FIJA */}
        <div className="w-full md:w-1/2 h-52 sm:h-64 md:h-full relative bg-brand-pearl flex-shrink-0 overflow-hidden border-b md:border-b-0 md:border-r border-brand-nude">
          <img
            src={product.imagen}
            alt={product.nombre}
            className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
          />
          
          {/* Sombra sutil interna para contraste */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />

          {/* Badges superiores sobre la imagen */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product.badge && (
              <Badge variant="wine" size="xs">{product.badge}</Badge>
            )}
            {isOutOfStock ? (
              <Badge variant="danger" size="xs">Agotado</Badge>
            ) : isLowStock ? (
              <Badge variant="warning" size="xs">¡Solo {product.stock} disponibles!</Badge>
            ) : null}
          </div>
        </div>

        {/* Columna Derecha: Panel de Información y Compra */}
        <div className="w-full md:w-1/2 flex flex-col flex-1 min-h-0 bg-white">
          {/* Zona de Texto Desplazable (Scroll Lateral Interno) */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 pr-3 sm:pr-4">
            <div>
              {/* Categoría */}
              <span className="text-[11px] font-bold uppercase tracking-widest text-brand-wine/80 block mb-1">
                {product.categoria}
              </span>

              {/* Nombre del Producto */}
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-text leading-snug">
                {product.nombre}
              </h2>

              {/* Precio Destacado */}
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-serif text-2xl sm:text-3xl font-extrabold text-brand-wine">
                  {formatCurrency(product.precio)}
                </span>
                {product.stock > 0 && (
                  <span className="text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    En stock ({product.stock} disponibles)
                  </span>
                )}
              </div>
            </div>

            {/* Descripción */}
            <div className="text-xs sm:text-sm text-brand-text-muted leading-relaxed">
              <p>{product.descripcion}</p>
            </div>

            {/* Detalles / Modo de uso */}
            {product.detalles && (
              <div className="p-3.5 rounded-2xl bg-brand-pearl/80 border border-brand-blush/60 space-y-1">
                <div className="flex items-center gap-1.5 text-brand-wine font-bold text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-brand-wine" />
                  <span>Modo de uso & Aplicación:</span>
                </div>
                <p className="text-xs text-brand-text-muted leading-relaxed">
                  {product.detalles}
                </p>
              </div>
            )}

            {/* Ingredientes clave */}
            {product.ingredientes && (
              <div className="p-3 rounded-2xl bg-brand-nude/30 border border-brand-nude text-xs text-brand-text-muted leading-relaxed">
                <span className="font-bold text-brand-text block mb-0.5">Ingredientes clave:</span>
                {product.ingredientes}
              </div>
            )}
          </div>

          {/* Barra Inferior de Compra FIJA (Siempre a la vista sin desplazarse) */}
          <div className="p-4 sm:p-5 border-t border-brand-nude bg-brand-pearl/40 flex-shrink-0">
            <div className="flex items-center justify-between gap-3 mb-3">
              <span className="text-xs font-semibold text-brand-text">
                Cantidad:
              </span>
              <QuantitySelector
                quantity={quantity}
                max={product.stock || 1}
                min={1}
                onChange={setQuantity}
                disabled={isOutOfStock}
                size="md"
              />
            </div>

            <Button
              variant="primary"
              size="md"
              icon={ShoppingBag}
              disabled={isOutOfStock}
              onClick={handleAdd}
              className="w-full text-sm sm:text-base py-3 shadow-glow-wine"
            >
              {isOutOfStock ? 'Producto Agotado' : `Agregar por ${formatCurrency(product.precio * quantity)}`}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
