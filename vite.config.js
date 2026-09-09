import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Plugin middleware para persistencia directa en disco durante desarrollo
function localPersistencePlugin() {
  return {
    name: 'local-persistence-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/api/products' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const filePath = path.resolve(__dirname, 'public/products.json');
              const parsed = JSON.parse(body);
              fs.writeFileSync(filePath, JSON.stringify(parsed, null, 2), 'utf-8');
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, message: 'Catálogo guardado físicamente en disco.' }));
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
          return;
        }

        if (req.url === '/api/categories' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const filePath = path.resolve(__dirname, 'public/categories.json');
              const parsed = JSON.parse(body);
              fs.writeFileSync(filePath, JSON.stringify(parsed, null, 2), 'utf-8');
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, message: 'Categorías guardadas físicamente en disco.' }));
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
          return;
        }

        if (req.url === '/api/upload' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const { filename, data } = JSON.parse(body);
              if (!data) throw new Error('No se enviaron datos de imagen.');

              const uploadsDir = path.resolve(__dirname, 'public/uploads');
              if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });
              }

              const extMatch = (filename || '').match(/\.(jpg|jpeg|png|webp|gif|svg)$/i);
              const ext = extMatch ? extMatch[1].toLowerCase() : 'jpg';
              const cleanName = `prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}.${ext}`;
              const filePath = path.join(uploadsDir, cleanName);

              const base64Data = data.replace(/^data:image\/\w+;base64,/, '');
              fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, url: `/uploads/${cleanName}` }));
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), localPersistencePlugin()],
  server: {
    port: 5180,
    open: false,
    host: true
  }
});
