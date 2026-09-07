# ✨ CP GLOW — Catálogo Exclusivo de Belleza & Cuidado

Aplicación web de catálogo de productos para el emprendimiento de belleza **CP GLOW** (Capilares, Skin Care, Maquillaje y Corporales). Cuenta con carrito de compras interactivo, filtros dinámicos, selector de cantidades y generación automática de pedidos listos para enviar vía WhatsApp.

Diseñado con una **Arquitectura Limpia por Capas (Separation of Concerns)** y la paleta cromática oficial de la marca:
- **Carmesí Vino (`#99182A`):** Identidad, botones principales y acentos de lujo.
- **Rosa Blush (`#F8CCD7`):** Suavidad, micro-brillo y chips activos.
- **Seda Cálida / Nude (`#F1DFD1`):** Contenedores y fondos secundarios.
- **Perla Rosa (`#FAEEEF`):** Lienzo principal luminoso y femenino.

---

## 📁 1. Arquitectura Limpia por Capas (¿Dónde está cada cosa?)

El proyecto está diseñado para que sea intuitivo encontrar cualquier archivo sin riesgo de romper la aplicación:

```
CPGLOW/
├── public/
│   ├── favicon.svg             # Ícono de pestaña del navegador
│   └── products.json           # 🛍️ BASE DE DATOS DE PRODUCTOS (¡Edita aquí sin tocar código!)
│
├── src/
│   ├── config/
│   │   └── env.js              # Lectura de variables del archivo .env
│   │
│   ├── constants/
│   │   ├── categories.js       # Listado de categorías (Capilares, Skincare, etc.)
│   │   └── theme.js            # Códigos oficiales de color de la marca
│   │
│   ├── services/
│   │   ├── productService.js   # Carga y filtrado de productos desde products.json
│   │   ├── storageService.js   # Guarda el carrito en el navegador (LocalStorage)
│   │   └── whatsappService.js  # Construye el mensaje y el enlace wa.me para WhatsApp
│   │
│   ├── utils/
│   │   ├── formatters.js       # Da formato a precios ($ 45.000) y teléfonos
│   │   └── validators.js       # Valida nombre y teléfono antes de enviar
│   │
│   ├── context/
│   │   └── CartContext.jsx     # Memoria global del carrito de compras
│   │
│   ├── hooks/
│   │   ├── useCart.js          # Hook para usar el carrito en cualquier componente
│   │   └── useProducts.js      # Hook para búsqueda y filtrado de productos
│   │
│   ├── components/
│   │   ├── common/             # Botones, badges, modales y selector de cantidades
│   │   ├── layout/             # Barra de navegación (Navbar), Banner (Hero) y Footer
│   │   ├── catalog/            # Tarjetas de producto, grilla, ficha técnica y buscador
│   │   ├── cart/               # Panel deslizante del carrito (Drawer) y totales
│   │   └── checkout/           # Formulario de cliente y confirmación a WhatsApp
│   │
│   ├── App.jsx                 # Ensamblador de la página principal
│   ├── main.jsx                # Punto de inicio de React
│   └── index.css               # Estilos globales y Tailwind CSS
│
├── .env                        # ⚙️ Configuración local (número de WhatsApp)
├── .env.example                # Plantilla de variables de entorno
├── tailwind.config.js          # Configuración de colores y fuentes de la marca
├── vite.config.js              # Configuración de Vite
└── package.json                # Librerías y dependencias
```

---

## 🛍️ 2. ¿Cómo agregar, editar precios o eliminar productos?

No necesitas saber programar para gestionar los productos. Todo se administra desde el archivo:
👉 `public/products.json`

### Para cambiar el precio de un producto:
1. Abre `public/products.json`.
2. Busca el producto por su nombre o `id`.
3. Cambia el valor numérico en `"precio": 52000` (sin puntos ni signos de pesos).
4. Guarda el archivo y listo.

### Para agregar un nuevo producto:
Copia y pega este bloque al final del archivo antes del corchete de cierre `]`:

```json
{
  "id": "skn-04",
  "nombre": "Tónico Facial Calmante de Rosas",
  "categoria": "skincare",
  "precio": 35000,
  "stock": 20,
  "destacado": true,
  "imagen": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800",
  "descripcion": "Restaura el equilibrio natural del pH y aporta frescura inmediata.",
  "detalles": "Rociar sobre el rostro limpio antes de tus sérums o cremas. Contenido: 120 ml.",
  "ingredientes": "Hidrolato puro de Rosas, Manzanilla y Aloe Vera.",
  "badge": "Nuevo"
}
```

> **Categorías válidas:** `"capilares"`, `"skincare"`, `"maquillaje"`, `"corporales"`.

---

## 📱 3. ¿Cómo cambiar el número de WhatsApp receptor?

1. Abre el archivo `.env` en la raíz del proyecto.
2. Modifica la variable `VITE_WHATSAPP_PHONE`:
   ```env
   VITE_WHATSAPP_PHONE=573008318310
   ```
   *Nota:* Incluye el código de país sin el signo más (`+`), sin espacios ni guiones (por ejemplo `57` para Colombia, `52` para México, `54` para Argentina).
3. Guarda el archivo y reinicia el servidor (`npm run dev`).

---

## 🚀 4. ¿Cómo ejecutar el proyecto localmente?

En tu terminal (PowerShell o CMD dentro de la carpeta `CPGLOW`):

1. **Instalar dependencias (solo la primera vez):**
   ```bash
   npm install
   ```
2. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
3. Abre tu navegador en la dirección que aparezca en la consola (usualmente `http://localhost:5173`).

---

## 🌐 5. Despliegue Gratuito en la Web

### Opción A: Despliegue en Vercel (Recomendada - 2 minutos)
1. Sube tu código a un repositorio en **GitHub**.
2. Ingresa a [vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub.
3. Haz clic en **"Add New Project"** e importa el repositorio de `CPGLOW`.
4. En la sección **Environment Variables**, añade:
   - `VITE_WHATSAPP_PHONE` = `tu_numero_aqui`
5. Haz clic en **Deploy**. ¡Tu tienda estará online con certificado SSL seguro gratis!

### Opción B: Despliegue en Netlify (Arrastrar y Soltar)
1. Ejecuta en tu terminal:
   ```bash
   npm run build
   ```
   Esto creará una carpeta llamada `dist/`.
2. Ingresa a [netlify.com](https://www.netlify.com).
3. Ve a la sección **Sites** y arrastra la carpeta `dist/` a la ventana del navegador. ¡Listo!
