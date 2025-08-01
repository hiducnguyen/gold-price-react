import type { AppConfig } from '../types';

export const config: AppConfig = {
  goldSellers: {
    PNJ: {
      url: '/gold-price-react/api/pnj',
      timeout: 5000,
      displayName: 'PNJ'
    },
    DOJI: {
      url: '/gold-price-react/api/doji',
      timeout: 5000,
      displayName: 'DOJI'
    }
  },
  bitcoinApi: {
    url: '/gold-price-react/api/bitcoin',
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