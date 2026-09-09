/**
 * Utilidad para comprimir y subir imágenes desde archivos de PC o galería de celulares
 */
export async function compressAndUploadImage(file, maxDimension = 1200, quality = 0.85) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('El archivo seleccionado no es una imagen válida.'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Error al leer el archivo.'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Error al cargar la imagen.'));
      img.onload = async () => {
        try {
          // Calcular dimensiones manteniendo la relación de aspecto
          let { width, height } = img;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          // Dibujar en canvas para comprimir
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Convertir a JPEG comprimido
          const compressedBase64 = canvas.toDataURL('image/jpeg', quality);

          // Intentar guardar físicamente en disco mediante el endpoint local
          try {
            const response = await fetch('/api/upload', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                filename: file.name,
                data: compressedBase64,
              }),
            });

            if (response.ok) {
              const resJson = await response.json();
              if (resJson.success && resJson.url) {
                return resolve(resJson.url);
              }
            }
          } catch (apiErr) {
            console.warn('API de subida local no disponible, usando Data URL comprimida:', apiErr);
          }

          // Fallback a Base64 comprimida
          resolve(compressedBase64);
        } catch (err) {
          reject(err);
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}
