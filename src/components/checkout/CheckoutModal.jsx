import React, { useState, useEffect } from 'react';
import { MessageCircle, CheckCircle, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
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

  // Datos del formulario prellenados si ya existen en caché
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
    // Limpiar error en cambio
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSendOrder = () => {
    // Validaciones
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

    // Guardar datos en caché local para próxima vez
    StorageService.saveCustomerData({
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
    });

    // Abrir WhatsApp con el pedido formateado
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
    >
      {orderSent ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-brand-wine">
            ¡Pedido Enviado a WhatsApp!
          </h3>
          <p className="text-sm text-brand-text-muted max-w-sm mx-auto leading-relaxed">
            Se ha abierto la conversación con nuestra asesora con todos los detalles de tu compra. Si no se abrió la ventana, puedes volver a intentarlo.
          </p>
          <div className="pt-4 flex flex-col gap-2.5">
            <Button
              variant="whatsapp"
              size="md"
              icon={MessageCircle}
              onClick={handleSendOrder}
            >
              Reabrir WhatsApp
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={handleFinish}
            >
              Finalizar y Vaciar Carrito
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Mini Resumen del Pedido */}
          <div className="p-4 rounded-2xl bg-brand-pearl/70 border border-brand-blush/60">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-brand-wine uppercase tracking-wider">
                Resumen ({cart.length} {cart.length === 1 ? 'producto' : 'productos'})
              </span>
              <span className="font-serif text-base font-bold text-brand-wine">
                {formatCurrency(subtotal)}
              </span>
            </div>
            <p className="text-[11px] text-brand-text-muted leading-tight">
              {cart.map(i => `${i.quantity}x ${i.nombre}`).join(' • ')}
            </p>
          </div>

          {/* Formulario de Datos */}
          <CustomerForm
            formData={formData}
            errors={errors}
            onChange={handleChange}
          />

          {/* Botón Principal: Enviar Pedido por WhatsApp */}
          <div className="pt-2">
            <Button
              variant="whatsapp"
              size="lg"
              icon={MessageCircle}
              onClick={handleSendOrder}
              loading={isSubmitting}
              className="w-full text-base shadow-lg hover:shadow-xl"
            >
              Enviar pedido por WhatsApp
            </Button>

            <p className="text-[11px] text-center text-brand-text-muted mt-3 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tu pedido no cobra automáticamente, se acuerda con el asesor en chat</span>
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
};
