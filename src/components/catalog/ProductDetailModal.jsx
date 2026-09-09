import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Sparkles, 
  Check, 
  ShieldCheck, 
  Heart, 
  ChevronLeft, 
  ChevronRight,
  Images
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { QuantitySelector } from '../common/QuantitySelector';
import { formatCurrency } from '../../utils/formatters';
import { useCart } from '../../hooks/useCart';

export const ProductDetailModal = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Combina imagen principal con galería adicional
  const allImages = React.useMemo(() => {
    if (!product) return [];
    const list = [product.imagen, ...(Array.isArray(product.imagenes) ? product.imagenes : [])]
      .filter(Boolean)
      .map(s => String(s).trim());
    return [...new Set(list)];
  }, [product]);

  // Reset al cambiar de producto o abrir
  useEffect(() => {
    if (isOpen) {
      setActiveImageIndex(0);
      setQuantity(1);
    }
  }, [isOpen, product]);

  if (!product) return null;

  const isOutOfStock = (product.stock || 0) <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const currentImage = allImages[activeImageIndex] || product.imagen;
  const hasMultipleImages = allImages.length > 1;

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const handleAdd = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    onClose();
    setQuantity(1);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-3xl" className="!p-0 h-[90vh] md:h-[580px] max-h-[640px]">
      <div className="flex flex-col md:flex-row h-full w-full overflow-hidden bg-white">
        {/* Columna Izquierda / Superior: Galería de Imágenes */}
        <div className="w-full md:w-1/2 h-64 sm:h-72 md:h-full relative bg-brand-pearl flex-shrink-0 flex flex-col justify-between overflow-hidden border-b md:border-b-0 md:border-r border-brand-nude">
          {/* Contenedor de la Imagen Principal */}
          <div className="relative flex-1 w-full h-full overflow-hidden group">
            <img
              src={currentImage}
              alt={`${product.nombre} - Foto ${activeImageIndex + 1}`}
              className="w-full h-full object-cover object-center transition-all duration-500 hover:scale-105"
            />
            
            {/* Sombra sutil interna */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10 pointer-events-none" />

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

            {/* Contador de fotos si tiene más de 1 */}
            {hasMultipleImages && (
              <div className="absolute top-3 right-3 z-10">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-medium">
                  <Images className="w-3 h-3 text-brand-blush" />
                  <span>{activeImageIndex + 1} / {allImages.length}</span>
                </span>
              </div>
            )}

            {/* Flechas de Navegación si tiene múltiples imágenes */}
            {hasMultipleImages && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 text-brand-wine hover:bg-white shadow-md flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-110 active:scale-95"
                  aria-label="Foto anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 text-brand-wine hover:bg-white shadow-md flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-110 active:scale-95"
                  aria-label="Foto siguiente"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Tira de Miniaturas (Thumbnails) para seleccionar fotos con 1 clic */}
          {hasMultipleImages && (
            <div className="p-2.5 bg-brand-pearl/90 backdrop-blur-sm border-t border-brand-blush/60 overflow-x-auto scrollbar-none flex items-center gap-2 z-10">
              {allImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-brand-wine shadow-glow-wine scale-105'
                      : 'border-white/80 opacity-70 hover:opacity-100 hover:border-brand-blush'
                  }`}
                  aria-label={`Ver foto ${idx + 1}`}
                >
                  <img
                    src={imgUrl}
                    alt={`Miniatura ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Columna Derecha: Panel de Información y Compra */}
        <div className="w-full md:w-1/2 flex flex-col flex-1 min-h-0 bg-white">
          {/* Zona de Texto Desplazable */}
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

          {/* Barra Inferior de Compra FIJA */}
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
