import type { GoldHolding, GoldPrice, BitcoinProfit, BitcoinPrice, CashEntry, AssetModel } from '../types';

export class BusinessLogic {
  static parseGoldInput(input: string): GoldHolding[] {
    const lines = input.split('\n').filter(line => line.trim());
    const holdings: GoldHolding[] = [];

    for (const line of lines) {
      const parts = line.split(',');
      if (parts.length !== 3) {
        throw new Error(`Cú pháp không hợp lệ: ${line}`);
      }

      const [seller, buyPriceStr, amountStr] = parts;
      const buyPrice = parseFloat(buyPriceStr.trim());
      const amount = parseFloat(amountStr.trim());

      if (isNaN(buyPrice) || isNaN(amount)) {
        throw new Error(`Cú pháp không hợp lệ: ${line}`);
      }

      holdings.push({
        seller: seller.trim(),
        buyPrice,
        amount
      });
    }

    return holdings;
  }

  static parseCashInput(input: string): CashEntry[] {
    const lines = input.split('\n').filter(line => line.trim());
    const entries: CashEntry[] = [];

    for (const line of lines) {
      const parts = line.split(' ', 2);
      const amountStr = parts[0];
      const comment = parts.length > 1 ? parts[1] : undefined;

      const amount = parseFloat(amountStr);
      if (isNaN(amount)) {
        throw new Error(`Cú pháp không hợp lệ: ${line}`);
      }

      entries.push({ amount, comment });
    }

    return entries;
  }

  static calculateGoldProfits(holdings: GoldHolding[], prices: GoldPrice[]): GoldHolding[] {
    return holdings.map(holding => {
      const price = this.findSellerPrice(holding.seller, prices);
      const currentValue = holding.amount * price.buyPrice;
      const profit = currentValue - holding.buyPrice;

      return {
        ...holding,
        currentValue,
        profit
      };
    });
  }

  static findSellerPrice(seller: string, prices: GoldPrice[]): GoldPrice {
    const normalizedSeller = seller.toLowerCase();
    const price = prices.find(p => p.seller.toLowerCase() === normalizedSeller);
    
    if (!price) {
      const validSellers = prices.map(p => p.seller).join(', ');
      throw new Error(`Mã nhà cung cấp không hợp lệ: '${seller}'. Các nhà cung cấp hợp lệ: ${validSellers}`);
    }

    return price;
  }

  static calculateBitcoinProfit(
    amount: number,
    fundValue: number,
    usdPrice: number,
    bitcoinPrice: BitcoinPrice
  ): BitcoinProfit | null {
    if (amount <= 0 || fundValue <= 0 || usdPrice <= 0) {
      return null;
    }

    const marketValue = amount * bitcoinPrice.currentPrice * usdPrice;
    const profit = marketValue - fundValue;

    return {
      amount,
      fundValue,
      marketValue,
      profit
    };
  }

  static calculateTotalCash(entries: CashEntry[]): number {
    return entries.reduce((total, entry) => total + entry.amount, 0);
  }

  static calculateAssetSummary(
    totalGoldValue: number,
    bitcoinProfit: BitcoinProfit | null,
    totalCash: number
  ): AssetModel[] {
    const cashInThousands = this.millionToThousand(totalCash);
    const bitcoinValue = bitcoinProfit?.marketValue || 0;

    return [
      { name: 'Vàng', value: totalGoldValue },
      { name: 'Bitcoin', value: bitcoinValue },
      { name: 'Tiền mặt', value: cashInThousands }
    ];
  }

  static thousandVNDToDisplayText(totalAssets: number): string {
    const million = Math.floor(totalAssets / 1000);
    const thousand = Math.floor(totalAssets - million * 1000);
    return `${million} triệu ${thousand} nghìn đồng`;
  }

  static millionToThousand(value: number): number {
    return Math.round(value * 1000 * 100) / 100; // Round to 2 decimal places
  }

  static formatCurrency(value: number): string {
    return new Intl.NumberFormat('vi-VN').format(Math.round(value));
  }

  static formatPercentage(value: number): string {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  }

  static calculateProfitPercentage(profit: number, buyPrice: number): number {
    if (buyPrice === 0) return 0;
    return Math.round((profit / buyPrice) * 100 * 100) / 100; // Round to 2 decimal places
  }

  static calculateTotalGoldStats(holdings: GoldHolding[]) {
    const totalBuyPrice = holdings.reduce((sum, h) => sum + h.buyPrice, 0);
    const totalSellPrice = holdings.reduce((sum, h) => sum + (h.currentValue || 0), 0);
    const totalAmount = holdings.reduce((sum, h) => sum + h.amount, 0);
    const totalProfit = totalSellPrice - totalBuyPrice;
    const totalProfitPercentage = totalBuyPrice > 0 ? this.calculateProfitPercentage(totalProfit, totalBuyPrice) : 0;

    return {
      totalBuyPrice,
      totalSellPrice,
      totalAmount,
      totalProfit,
      totalProfitPercentage
    };
  }
}