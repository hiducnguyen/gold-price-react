import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/gold-price-react/',
  plugins: [react()],
  server: {
    proxy: {
      '/api/pnj': {
        target: 'https://edge-api.pnj.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/pnj/, '/ecom-frontend/v1/get-gold-price?zone=00')
      },
      '/api/doji': {
        target: 'http://update.giavang.doji.vn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/doji/, '/banggia/doji_92411/92411')
      },
      '/api/bitcoin': {
        target: 'https://data-api.binance.vision',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/bitcoin/, '/api/v3/avgPrice?symbol=BTCUSDT')
      }
    }
  }
})
