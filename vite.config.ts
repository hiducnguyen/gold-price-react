import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/gold-price-react/',
  plugins: [react()],
  server: {
    proxy: {
      '/gold-price-react/api/pnj': {
        target: 'https://edge-api.pnj.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/gold-price-react\/api\/pnj/, '/ecom-frontend/v1/get-gold-price?zone=00')
      },
      '/gold-price-react/api/doji': {
        target: 'http://update.giavang.doji.vn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/gold-price-react\/api\/doji/, '/banggia/doji_92411/92411')
      },
      '/gold-price-react/api/bitcoin': {
        target: 'https://data-api.binance.vision',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/gold-price-react\/api\/bitcoin/, '/api/v3/avgPrice?symbol=BTCUSDT')
      }
    }
  }
})
