import React, { useState, useEffect, useRef } from 'react';
import { 
  Package, 
  Image as ImageIcon, 
  Upload, 
  Plus, 
  Trash2, 
  FolderPlus, 
  Sparkles, 
  Link as LinkIcon, 
  Check, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { compressAndUploadImage } from '../../utils/imageUploader';

const COMMON_BADGES = [
  'Sin etiqueta',
  'Nuevo',
  'Más Vendido',
  'Efecto Salón',
  'Glow Natural',
  'Protección Térmica',
  'Edición Limitada',
  'Oferta Especial',
];

export const ProductEditorModal = ({
  isOpen,
  onClose,
  product = null,
  categories = [],
  onSaveProduct,
  onOpenNewCategory,
}) => {
  const isEditing = Boolean(product && product.id);

  // Estados del Formulario
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('skincare');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('10');
  const [destacado, setDestacado] = useState(false);
  const [badge, setBadge] = useState('');
  const [imagen, setImagen] = useState('');
  const [imagenes, setImagenes] = useState([]);
  const [descripcion, setDescripcion] = useState('');
  const [detalles, setDetalles] = useState('');
  const [ingredientes, setIngredientes] = useState('');

  // Estados de carga de imágenes
  const [isUploadingMain, setIsUploadingMain] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [showMainUrlInput, setShowMainUrlInput] = useState(false);

  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Referencias a inputs de archivo ocultos
  const mainFileRef = useRef(null);
  const galleryFileRef = useRef(null);

  // Sincronizar formulario al abrir o cambiar de producto
  useEffect(() => {
    if (isOpen) {
      if (product) {
        setNombre(product.nombre || '');
        setCategoria(product.categoria || (categories[1]?.slug || 'capilares'));
        setPrecio(product.precio !== undefined ? String(product.precio) : '');
        setStock(product.stock !== undefined ? String(product.stock) : '10');
        setDestacado(Boolean(product.destacado));
        setBadge(product.badge || '');
        setImagen(product.imagen || '');
        setImagenes(Array.isArray(product.imagenes) ? [...product.imagenes] : []);
        setDescripcion(product.descripcion || '');
        setDetalles(product.detalles || '');
        setIngredientes(product.ingredientes || '');
      } else {
        setNombre('');
        setCategoria(categories[1]?.slug || 'capilares');
        setPrecio('');
        setStock('15');
        setDestacado(false);
        setBadge('');
        setImagen('');
        setImagenes([]);
        setDescripcion('');
        setDetalles('');
        setIngredientes('');
      }
      setShowMainUrlInput(false);
      setError('');
    }
  }, [isOpen, product, categories]);

  // Subir imagen principal desde dispositivo
  const handleMainFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingMain(true);
    setError('');
    try {
      const uploadedUrl = await compressAndUploadImage(file);
      setImagen(uploadedUrl);
    } catch (err) {
      setError('Error al procesar la foto: ' + err.message);
    } finally {
      setIsUploadingMain(false);
      e.target.value = '';
    }
  };

  // Subir múltiples fotos para la galería desde dispositivo
  const handleGalleryFilesSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploadingGallery(true);
    setError('');
    try {
      const newUrls = await Promise.all(
        files.map(f => compressAndUploadImage(f))
      );
      setImagenes(prev => [...prev, ...newUrls]);
    } catch (err) {
      setError('Error al procesar fotos adicionales: ' + err.message);
    } finally {
      setIsUploadingGallery(false);
      e.target.value = '';
    }
  };

  // Agregar campo vacío de URL a la galería
  const handleAddGalleryUrl = () => {
    setImagenes([...imagenes, '']);
  };

  const handleUpdateGalleryImage = (index, value) => {
    const updated = [...imagenes];
    updated[index] = value;
    setImagenes(updated);
  };

  const handleRemoveGalleryImage = (index) => {
    setImagenes(imagenes.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!nombre.trim()) {
      setError('Por favor escribe el nombre del producto.');
      return;
    }
    if (!precio || Number(precio) <= 0) {
      setError('Por favor indica un precio válido mayor a 0.');
      return;
    }
    if (!imagen.trim()) {
      setError('Por favor sube o indica la imagen principal del producto.');
      return;
    }

    setSaving(true);
    try {
      const productPayload = {
        ...(product || {}),
        id: product?.id || `prod-${Date.now()}`,
        nombre: nombre.trim(),
        categoria: categoria.toLowerCase().trim(),
        precio: parseInt(precio, 10),
        stock: parseInt(stock, 10) || 0,
        destacado: Boolean(destacado),
        badge: badge === 'Sin etiqueta' ? '' : badge.trim(),
        imagen: imagen.trim(),
        imagenes: imagenes.map(img => img.trim()).filter(Boolean),
        descripcion: descripcion.trim(),
        detalles: detalles.trim(),
        ingredientes: ingredientes.trim(),
      };

      await onSaveProduct(productPayload);
      setSaving(false);
      onClose();
    } catch (err) {
      setSaving(false);
      setError('Ocurrió un error al guardar. Por favor intenta de nuevo.');
    }
  };

  const filteredCategories = categories.filter(c => c.slug !== 'todos');

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl" className="max-h-[92vh] flex flex-col p-0">
      <div className="bg-white rounded-3xl flex flex-col h-full overflow-hidden">
        {/* Cabecera del Editor */}
        <div className="p-5 sm:p-6 border-b border-brand-blush/60 bg-gradient-to-r from-brand-pearl to-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-wine text-white flex items-center justify-center shadow-sm">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-text">
                {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
              <p className="text-xs text-brand-text-muted">
                {isEditing ? 'Actualiza los datos y fotos del catálogo' : 'Agrega un nuevo producto a la tienda'}
              </p>
            </div>
          </div>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Formulario Scrolleable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Fila 1: Nombre y Categoría */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-text mb-1 uppercase tracking-wider">
                Nombre del Producto *
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Sérum Facial Antiedad 30ml"
                required
                className="w-full px-4 py-2.5 rounded-2xl bg-brand-pearl/40 border border-brand-blush/80 text-sm text-brand-text focus:ring-2 focus:ring-brand-wine focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-brand-text uppercase tracking-wider">
                  Categoría *
                </label>
                {onOpenNewCategory && (
                  <button
                    type="button"
                    onClick={onOpenNewCategory}
                    className="text-[11px] font-bold text-brand-wine hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <FolderPlus className="w-3 h-3" />
                    <span>+ Nueva</span>
                  </button>
                )}
              </div>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-brand-pearl/40 border border-brand-blush/80 text-sm text-brand-text capitalize focus:ring-2 focus:ring-brand-wine focus:bg-white focus:outline-none cursor-pointer"
              >
                {filteredCategories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fila 2: Precio, Stock y Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-text mb-1 uppercase tracking-wider">
                Precio (Pesos COP) *
              </label>
              <input
                type="number"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                placeholder="Ej: 45000"
                min="0"
                required
                className="w-full px-4 py-2.5 rounded-2xl bg-brand-pearl/40 border border-brand-blush/80 text-sm text-brand-text focus:ring-2 focus:ring-brand-wine focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-text mb-1 uppercase tracking-wider">
                Stock / Unidades
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="Ej: 15"
                min="0"
                className="w-full px-4 py-2.5 rounded-2xl bg-brand-pearl/40 border border-brand-blush/80 text-sm text-brand-text focus:ring-2 focus:ring-brand-wine focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-text mb-1 uppercase tracking-wider">
                Etiqueta / Badge
              </label>
              <select
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl bg-brand-pearl/40 border border-brand-blush/80 text-sm text-brand-text focus:ring-2 focus:ring-brand-wine focus:bg-white focus:outline-none cursor-pointer"
              >
                {COMMON_BADGES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Checkbox: Producto Destacado */}
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-brand-pearl/60 border border-brand-blush/60">
            <input
              type="checkbox"
              id="destacado"
              checked={destacado}
              onChange={(e) => setDestacado(e.target.checked)}
              className="w-4 h-4 rounded text-brand-wine focus:ring-brand-wine border-brand-blush cursor-pointer"
            />
            <label htmlFor="destacado" className="text-xs font-semibold text-brand-text cursor-pointer select-none">
              ⭐ Marcar como producto destacado (aparece con prioridad en el catálogo)
            </label>
          </div>

          {/* SECCIÓN FOTO PRINCIPAL: SUBIDA DESDE DISPOSITIVO O URL */}
          <div className="space-y-3 pt-2 border-t border-brand-nude">
            {/* Input nativo de archivo oculto */}
            <input
              type="file"
              ref={mainFileRef}
              accept="image/*"
              className="hidden"
              onChange={handleMainFileSelect}
            />

            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold text-brand-text uppercase tracking-wider">
                  Foto Principal de Portada *
                </label>
                <p className="text-[11px] text-brand-text-muted">
                  Puedes elegir una foto de la galería de tu celular o archivos de tu PC.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowMainUrlInput(!showMainUrlInput)}
                className="text-[11px] font-semibold text-brand-wine hover:underline flex items-center gap-1 cursor-pointer"
              >
                <LinkIcon className="w-3 h-3" />
                <span>{showMainUrlInput ? 'Ocultar URL' : 'O pegar enlace URL'}</span>
              </button>
            </div>

            {/* Selector interactivo de Foto Principal */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <button
                type="button"
                onClick={() => mainFileRef.current?.click()}
                disabled={isUploadingMain}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-brand-wine text-white hover:bg-brand-wine-dark text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-60"
              >
                {isUploadingMain ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Optimizando foto...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Elegir foto del celular o PC</span>
                  </>
                )}
              </button>

              {/* Vista previa de la foto seleccionada */}
              {imagen && (
                <div className="flex items-center gap-2.5 p-2 rounded-2xl bg-brand-pearl/70 border border-brand-blush flex-1 w-full sm:w-auto">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-brand-wine flex-shrink-0 bg-white shadow-sm">
                    <img
                      src={imagen}
                      alt="Vista previa portada"
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-brand-wine flex items-center gap-1 truncate">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Foto cargada con éxito</span>
                    </span>
                    <span className="text-[10px] text-brand-text-muted truncate block">
                      {imagen.startsWith('data:') ? 'Imagen desde tu dispositivo' : imagen}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setImagen('')}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                    title="Quitar foto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Input alternativo para URL si lo abrieron */}
            {showMainUrlInput && (
              <div className="mt-2">
                <input
                  type="url"
                  value={imagen}
                  onChange={(e) => setImagen(e.target.value)}
                  placeholder="https://images.unsplash.com/... o enlace de imagen externa"
                  className="w-full px-4 py-2.5 rounded-2xl bg-brand-pearl/40 border border-brand-blush/80 text-xs text-brand-text focus:ring-2 focus:ring-brand-wine focus:bg-white focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* SECCIÓN MULTI-IMAGEN: GALERÍA DE FOTOS ADICIONALES */}
          <div className="space-y-3 pt-3 border-t border-brand-nude">
            {/* Input nativo de archivo múltiple oculto */}
            <input
              type="file"
              ref={galleryFileRef}
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleGalleryFilesSelect}
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="block text-xs font-bold text-brand-text uppercase tracking-wider">
                  Galería de Fotos Adicionales (para "Ver Detalles")
                </label>
                <p className="text-[11px] text-brand-text-muted">
                  Puedes seleccionar una o varias fotos a la vez de tu celular o computadora.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => galleryFileRef.current?.click()}
                  disabled={isUploadingGallery}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-pearl text-brand-wine hover:bg-brand-blush/50 text-xs font-bold border border-brand-blush transition-colors cursor-pointer disabled:opacity-60"
                >
                  {isUploadingGallery ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  <span>Subir fotos</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddGalleryUrl}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white text-brand-text-muted hover:text-brand-wine hover:bg-brand-pearl text-xs font-semibold border border-brand-blush/80 transition-colors cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Pegar URL</span>
                </button>
              </div>
            </div>

            {/* Lista y Cuadrícula de fotos adicionales */}
            {imagenes.length === 0 ? (
              <div className="p-4 rounded-2xl bg-brand-pearl/30 border-2 border-dashed border-brand-blush/80 text-center text-xs text-brand-text-muted">
                Este producto solo tiene 1 imagen principal. Si deseas añadir más vistas o detalles, haz clic en <strong>"Subir fotos"</strong> arriba.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {imagenes.map((imgUrl, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-2 p-2 rounded-2xl bg-brand-pearl/60 border border-brand-blush/80"
                  >
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-brand-wine/50 flex-shrink-0 bg-white">
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt={`Foto adicional ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-brand-wine/50">
                          <ImageIcon className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] font-bold text-brand-wine block">
                        Foto adicional #{index + 1}
                      </span>
                      {imgUrl.startsWith('data:') ? (
                        <span className="text-[10px] text-emerald-700 font-medium truncate block">
                          ✓ Foto desde tu dispositivo
                        </span>
                      ) : (
                        <input
                          type="url"
                          value={imgUrl}
                          onChange={(e) => handleUpdateGalleryImage(index, e.target.value)}
                          placeholder="https://... URL de foto"
                          className="w-full px-2 py-1 rounded-lg bg-white border border-brand-blush/70 text-[11px] text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-wine"
                        />
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(index)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer flex-shrink-0"
                      title="Eliminar esta foto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Fila 3: Descripción */}
          <div className="pt-2 border-t border-brand-nude">
            <label className="block text-xs font-bold text-brand-text mb-1 uppercase tracking-wider">
              Descripción Breve (Aparece en la tarjeta)
            </label>
            <textarea
              rows="2"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Beneficios principales, textura y resultados..."
              className="w-full px-4 py-2.5 rounded-2xl bg-brand-pearl/40 border border-brand-blush/80 text-sm text-brand-text focus:ring-2 focus:ring-brand-wine focus:bg-white focus:outline-none"
            />
          </div>

          {/* Fila 4: Modo de uso & Detalles */}
          <div>
            <label className="block text-xs font-bold text-brand-text mb-1 uppercase tracking-wider">
              Modo de Uso & Aplicación (Aparece en "Ver Detalles")
            </label>
            <textarea
              rows="2"
              value={detalles}
              onChange={(e) => setDetalles(e.target.value)}
              placeholder="Cómo se usa, frecuencia y contenido neto (ej: 60 ml o 250 g)..."
              className="w-full px-4 py-2.5 rounded-2xl bg-brand-pearl/40 border border-brand-blush/80 text-sm text-brand-text focus:ring-2 focus:ring-brand-wine focus:bg-white focus:outline-none"
            />
          </div>

          {/* Fila 5: Ingredientes Clave */}
          <div>
            <label className="block text-xs font-bold text-brand-text mb-1 uppercase tracking-wider">
              Ingredientes Clave
            </label>
            <textarea
              rows="2"
              value={ingredientes}
              onChange={(e) => setIngredientes(e.target.value)}
              placeholder="Ej: Ácido Hialurónico, Niacinamida, Extracto de Rosas..."
              className="w-full px-4 py-2.5 rounded-2xl bg-brand-pearl/40 border border-brand-blush/80 text-sm text-brand-text focus:ring-2 focus:ring-brand-wine focus:bg-white focus:outline-none"
            />
          </div>
        </form>

        {/* Pie de Acciones FIJO */}
        <div className="p-4 sm:p-5 border-t border-brand-blush/60 bg-brand-pearl/40 flex items-center justify-end gap-3 flex-shrink-0">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onClose}
            disabled={saving || isUploadingMain || isUploadingGallery}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleSubmit}
            disabled={saving || isUploadingMain || isUploadingGallery}
            className="shadow-glow-wine px-6"
          >
            {saving ? 'Guardando...' : (isEditing ? 'Actualizar Producto' : 'Publicar Producto')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
