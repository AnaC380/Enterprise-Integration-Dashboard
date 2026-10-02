import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Em desenvolvimento, o Vite repassa /api para a EID.Api.
// O navegador fala com uma única origem (localhost:3001), como em produção,
// onde a própria API serve o build do React.
const apiTarget = process.env.EID_API_URL ?? 'http://localhost:5004';

export default defineConfig({
  plugins: [react()],

  server: {
    host: 'localhost',
    port: 3001,
    strictPort: true,
    proxy: {
      '/api': {
        target: apiTarget,
        changeOrigin: false
      }
    }
  }
});
