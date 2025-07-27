import type { AppConfig } from '../types';

// Production configuration - will need CORS handling or a serverless function proxy
export const config: AppConfig = {
  goldSellers: {
    PNJ: {
      url: 'https://edge-api.pnj.io/ecom-frontend/v1/get-gold-price?zone=00',
      timeout: 5000,
      displayName: 'PNJ'
    },
    DOJI: {
      url: 'http://update.giavang.doji.vn/banggia/doji_92411/92411',
      timeout: 5000,
      displayName: 'DOJI'
    },
    MIH: {
      url: 'http://www.mihong.vn/api/v1/gold/prices/current',
      timeout: 5000,
      displayName: 'Mi Hồng'
    }
  },
  bitcoinApi: {
    url: 'https://data-api.binance.vision/api/v3/avgPrice?symbol=BTCUSDT',
    timeout: 5000,
    displayName: 'Binance'
  },
  cacheTimeout: 60000 // 60 seconds
};

export const labels = {
  TotalBuyPrice: 'Tổng tiền mua',
  TotalSellPrice: 'Tổng tiền bán',
  TotalAmount: 'Tổng số lượng (chỉ)',
  Profit: 'Lãi/Lỗ',
  Amount: 'Số lượng (chỉ)',
  Seller: 'Nhà cung cấp',
  BuyPrice: 'Giá mua',
  SellPrice: 'Giá bán',
  ProfitPercentage: 'Lãi/Lỗ %%'
};