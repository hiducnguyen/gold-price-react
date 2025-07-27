import type { GoldPrice, BitcoinPrice } from '../types';
import { config } from './config';

class PriceCache {
  private cache = new Map<string, { data: any; timestamp: number }>();

  set(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  get(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > config.cacheTimeout) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }
}

const cache = new PriceCache();

export class PriceService {
  private static lastBitcoinPrice: BitcoinPrice | null = null;

  static async fetchWithTimeout(url: string, timeout: number): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  static async fetchPNJPrice(): Promise<GoldPrice | null> {
    const cacheKey = 'pnj_price';
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
      const response = await this.fetchWithTimeout(
        config.goldSellers.PNJ.url,
        config.goldSellers.PNJ.timeout
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      const price = data.data?.find((p: any) => p.masp === 'N24K');
      
      if (!price) throw new Error('Gold price not found');

      const goldPrice: GoldPrice = {
        sellPrice: price.giaban,
        buyPrice: price.giamua,
        seller: 'PNJ',
        updateDate: price.createDate,
        sellDiff: 0,
        buyDiff: 0
      };

      cache.set(cacheKey, goldPrice);
      return goldPrice;
    } catch (error) {
      console.warn('Failed to fetch PNJ price:', error);
      return cache.get(cacheKey) || null;
    }
  }

  static async fetchDOJIPrice(): Promise<GoldPrice | null> {
    const cacheKey = 'doji_price';
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
      const response = await this.fetchWithTimeout(
        config.goldSellers.DOJI.url,
        config.goldSellers.DOJI.timeout
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const xmlText = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      
      const rows = xmlDoc.querySelectorAll('Row');
      let priceRow: Element | null = null;
      
      for (const row of rows) {
        if (row.getAttribute('Name')?.includes('Nhẫn Tròn 9999')) {
          priceRow = row;
          break;
        }
      }

      if (!priceRow) throw new Error('DOJI price not found');

      const convertToInt = (str: string) => parseInt(str.replace(/,/g, ''));
      const dateTimeElement = xmlDoc.querySelector('DateTime');
      
      const goldPrice: GoldPrice = {
        sellPrice: convertToInt(priceRow.getAttribute('Sell') || '0'),
        buyPrice: convertToInt(priceRow.getAttribute('Buy') || '0'),
        seller: 'DOJI',
        updateDate: dateTimeElement?.textContent || new Date().toISOString(),
        sellDiff: 0,
        buyDiff: 0
      };

      cache.set(cacheKey, goldPrice);
      return goldPrice;
    } catch (error) {
      console.warn('Failed to fetch DOJI price:', error);
      return cache.get(cacheKey) || null;
    }
  }

  static async fetchMiHongPrice(): Promise<GoldPrice | null> {
    const cacheKey = 'mihong_price';
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
      const response = await this.fetchWithTimeout(
        config.goldSellers.MIH.url,
        config.goldSellers.MIH.timeout
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      const price = data.data?.find((p: any) => p.code === '999');
      
      if (!price) throw new Error('Mi Hong price not found');

      const goldPrice: GoldPrice = {
        sellPrice: Math.floor(price.sellingPrice / 1000),
        buyPrice: Math.floor(price.buyingPrice / 1000),
        seller: 'MIH',
        updateDate: price.dateTime,
        sellDiff: 0,
        buyDiff: 0
      };

      cache.set(cacheKey, goldPrice);
      return goldPrice;
    } catch (error) {
      console.warn('Failed to fetch Mi Hong price:', error);
      return cache.get(cacheKey) || null;
    }
  }

  static async fetchBitcoinPrice(): Promise<BitcoinPrice | null> {
    const cacheKey = 'bitcoin_price';
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
      const response = await this.fetchWithTimeout(
        config.bitcoinApi.url,
        config.bitcoinApi.timeout
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      const currentPrice = parseFloat(data.price);
      
      const bitcoinPrice: BitcoinPrice = {
        currentPrice,
        previousPrice: this.lastBitcoinPrice?.currentPrice || currentPrice,
        diff: this.lastBitcoinPrice ? currentPrice - this.lastBitcoinPrice.currentPrice : 0,
        updateDate: new Date().toISOString()
      };

      this.lastBitcoinPrice = bitcoinPrice;
      cache.set(cacheKey, bitcoinPrice);
      return bitcoinPrice;
    } catch (error) {
      console.warn('Failed to fetch Bitcoin price:', error);
      return cache.get(cacheKey) || this.lastBitcoinPrice;
    }
  }

  static async fetchAllGoldPrices(): Promise<GoldPrice[]> {
    const promises = [
      this.fetchPNJPrice(),
      this.fetchDOJIPrice(),
      this.fetchMiHongPrice()
    ];

    const results = await Promise.allSettled(promises);
    const prices: GoldPrice[] = [];

    results.forEach((result) => {
      if (result.status === 'fulfilled' && result.value) {
        prices.push(result.value);
      }
    });

    // Calculate differences if we have previous data
    this.calculatePriceDifferences(prices);

    return prices;
  }

  private static calculatePriceDifferences(prices: GoldPrice[]): void {
    const previousPrices = this.getPreviousPrices();
    
    prices.forEach(price => {
      const previous = previousPrices.find(p => p.seller === price.seller);
      if (previous) {
        price.sellDiff = price.sellPrice - previous.sellPrice;
        price.buyDiff = price.buyPrice - previous.buyPrice;
      }
    });

    this.savePreviousPrices(prices);
  }

  private static getPreviousPrices(): GoldPrice[] {
    const stored = localStorage.getItem('previousGoldPrices');
    return stored ? JSON.parse(stored) : [];
  }

  private static savePreviousPrices(prices: GoldPrice[]): void {
    localStorage.setItem('previousGoldPrices', JSON.stringify(prices));
  }
}