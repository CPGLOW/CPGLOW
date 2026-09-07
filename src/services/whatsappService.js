import { ENV } from '../config/env';
import { formatCurrency } from '../utils/formatters';

/**
 * Capa 1: Servicio de integración y mensajería de WhatsApp
 */
export const WhatsAppService = {
  /**
   * Construye el texto enriquecido para el pedido
   * @param {Object} customerData - { name, phone, address, notes }
   * @param {Array} cartItems - Lista de productos en el carrito
   * @param {number} totalAmount - Total general calculado
   * @returns {string} Mensaje formateado para WhatsApp
   */
  generateOrderMessage({ customerData, cartItems, totalAmount }) {
    const divider = '━━━━━━━━━━━━━━━━━━━━━━';
    const storeName = ENV.STORE_NAME || 'CP GLOW';

    let message = `✨ *¡HOLA ${storeName}! DESEO REALIZAR UN PEDIDO* ✨\n${divider}\n`;
    
    // Datos del cliente
    message += `👤 *Cliente:* ${customerData.name}\n`;
    message += `📱 *Teléfono:* ${customerData.phone}\n`;
    
    if (customerData.address && customerData.address.trim()) {
      message += `📍 *Dirección/Ciudad:* ${customerData.address.trim()}\n`;
    }
    
    message += `${divider}\n`;
    message += `🛍️ *DETALLE DEL PEDIDO:*\n`;

    // Lista de productos
    cartItems.forEach((item, index) => {
      const subtotal = item.precio * item.quantity;
      const unitFormatted = formatCurrency(item.precio);
      const subtotalFormatted = formatCurrency(subtotal);
      
      message += `• ${item.quantity}x *${item.nombre}*\n  (${unitFormatted} c/u) = *${subtotalFormatted}*\n`;
    });

    message += `${divider}\n`;
    message += `💰 *TOTAL A PAGAR:* *${formatCurrency(totalAmount)}*\n`;
    message += `${divider}\n`;

    if (customerData.notes && customerData.notes.trim()) {
      message += `💬 *Comentarios:* ${customerData.notes.trim()}\n${divider}\n`;
    }

    message += `_Quedo atento/a para confirmar datos de pago y entrega. ¡Gracias!_ ✨`;

    return message;
  },

  /**
   * Genera el enlace directo a WhatsApp (wa.me)
   * @param {Object} params
   * @returns {string} URL lista para abrir
   */
  generateWhatsAppLink({ customerData, cartItems, totalAmount, customPhone = null }) {
    const rawPhone = customPhone || ENV.WHATSAPP_PHONE;
    // Limpia el número dejando solo dígitos
    const cleanPhone = String(rawPhone).replace(/\D/g, '');
    
    const rawMessage = this.generateOrderMessage({ customerData, cartItems, totalAmount });
    const encodedMessage = encodeURIComponent(rawMessage);

    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  },

  /**
   * Abre la ventana de WhatsApp directamente
   */
  openWhatsAppOrder(params) {
    const link = this.generateWhatsAppLink(params);
    window.open(link, '_blank', 'noopener,noreferrer');
  }
};
