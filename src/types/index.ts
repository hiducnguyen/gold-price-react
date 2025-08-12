export interface AssetModel {
  name: string;
  value: number;
}

export interface GoldPrice {
  sellPrice: number;
  buyPrice: number;
  seller: string;
  updateDate: Date;
  sellDiff: number;
  buyDiff: number;
}

export interface BitcoinPrice {
  currentPrice: number;
  previousPrice: number;
  diff: number;
  updateDate: string;
}

export interface BitcoinProfit {
  amount: number;
  fundValue: number;
  marketValue: number;
  profit: number;
}

export interface GoldHolding {
  seller: string;
  buyPrice: number;
  amount: number;
  profit?: number;
  currentValue?: number;
}

export interface CashEntry {
  amount: number;
  comment?: string;
}

export interface ViewMode {
  showGold: boolean;
  showBitcoin: boolean;
  showCash: boolean;
}

export interface AppState {
  goldPrices: GoldPrice[];
  goldHoldings: GoldHolding[];
  bitcoinPrice: BitcoinPrice | null;
  bitcoinProfit: BitcoinProfit | null;
  cashEntries: CashEntry[];
  viewMode: ViewMode;
  loading: boolean;
  error: string | null;
}

export interface PriceFetcherConfig {
  url: string;
  timeout: number;
  displayName: string;
}

export interface AppConfig {
  goldSellers: Record<string, PriceFetcherConfig>;
  bitcoinApi: PriceFetcherConfig;
  cacheTimeout: number;
}