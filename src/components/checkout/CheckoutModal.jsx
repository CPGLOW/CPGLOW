import React, { useState, useEffect } from 'react';
import { MessageCircle, CheckCircle, ShieldCheck, Sparkles, ShoppingBag } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { CustomerForm } from './CustomerForm';
import { formatCurrency } from '../../utils/formatters';
import { validateFullName, validatePhone } from '../../utils/validators';
import { WhatsAppService } from '../../services/whatsappService';
import { StorageService } from '../../services/storageService';
import { useCart } from '../../hooks/useCart';

export const CheckoutModal = ({ isOpen, onClose }) => {
  const { cart, subtotal, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSent, setOrderSent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const saved = StorageService.getCustomerData();
      if (saved) {
        setFormData(prev => ({ ...prev, ...saved }));
      }
      setOrderSent(false);
    }
  }, [isOpen]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSendOrder = () => {
    const nameCheck = validateFullName(formData.name);
    const phoneCheck = validatePhone(formData.phone);

    if (!nameCheck.isValid || !phoneCheck.isValid) {
      setErrors({
        name: nameCheck.error,
        phone: phoneCheck.error,
      });
      return;
    }

    setIsSubmitting(true);

    StorageService.saveCustomerData({
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
    });

    WhatsAppService.openWhatsAppOrder({
      customerData: formData,
      cartItems: cart,
      totalAmount: subtotal,
    });

    setIsSubmitting(false);
    setOrderSent(true);
  };

  const handleFinish = () => {
    clearCart();
    onClose();
    setOrderSent(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={orderSent ? undefined : "Finalizar Pedido"}
      subtitle={orderSent ? undefined : "Completa tus datos para enviarte el resumen directo a WhatsApp"}
      maxWidth="max-w-lg"
      className="max-h-[90vh] flex flex-col p-0"
    >
      {orderSent ? (
        <div className="p-6 sm:p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-brand-wine">
            ¡Pedido Enviado a WhatsApp!
          </h3>
          <p className="text-xs sm:text-sm text-brand-text-muted max-w-sm mx-auto leading-relaxed">
            Se ha abierto el chat con nuestra asesora oficial con todos los detalles de tu compra.
          </p>
          <div className="pt-4 flex flex-col gap-2.5 max-w-xs mx-auto">
            <Button
              variant="whatsapp"
              size="md"
              icon={MessageCircle}
              onClick={handleSendOrder}
              className="w-full shadow-md"
            >
              Reabrir WhatsApp
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={handleFinish}
              className="w-full"
            >
              Finalizar y Vaciar Carrito
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col flex-1 min-h-0">
          {/* Zona Central Desplazable (Scroll) */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {/* Resumen Compacto del Carrito */}
            <div className="p-3.5 rounded-2xl bg-brand-pearl/80 border-2 border-brand-blush/80 shadow-sm">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold text-brand-wine uppercase tracking-wider flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Resumen ({cart.length} {cart.length === 1 ? 'producto' : 'productos'})</span>
                </span>
                <span className="font-serif text-base sm:text-lg font-bold text-brand-wine">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <p className="text-[11px] text-brand-text-muted leading-tight line-clamp-2">
                {cart.map(i => `${i.quantity}x ${i.nombre}`).join(' • ')}
              </p>
            </div>

            {/* Formulario de Datos */}
            <CustomerForm
              formData={formData}
              errors={errors}
              onChange={handleChange}
            />
          </div>

          {/* Barra Inferior FIJA: Botón de WhatsApp Siempre Visible */}
          <div className="p-4 sm:p-5 border-t-2 border-brand-nude/80 bg-brand-pearl/60 flex-shrink-0 shadow-lg">
            <button
              type="button"
              onClick={handleSendOrder}
              disabled={isSubmitting || cart.length === 0}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-700/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>{isSubmitting ? 'Abriendo WhatsApp...' : 'Enviar pedido por WhatsApp'}</span>
            </button>

            <p className="text-[11px] text-center text-brand-text-muted mt-2.5 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
              <span>Tu compra no se cobra aquí. Se coordina el pago directo con la asesora.</span>
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
};
