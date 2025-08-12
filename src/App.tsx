import { useState, useEffect, useCallback } from 'react';
import type { GoldPrice, BitcoinPrice, BitcoinProfit, GoldHolding, CashEntry, AssetModel } from './types';
import { PriceService } from './services/priceService';
import { BusinessLogic } from './services/businessLogic';
import { useFormPersistence, useLocalStorage } from './hooks/useLocalStorage';

import { ViewModeSelector } from './components/ViewModeSelector';
import { GoldPriceTable } from './components/GoldPriceTable';
import { GoldPortfolio } from './components/GoldPortfolio';
import { BitcoinSection } from './components/BitcoinSection';
import { CashSection } from './components/CashSection';
import { AssetSummary } from './components/AssetSummary';

import './index.css';

function App() {
  // State
  const [goldPrices, setGoldPrices] = useState<GoldPrice[]>([]);
  const [bitcoinPrice, setBitcoinPrice] = useState<BitcoinPrice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form data with persistence
  const [goldInput, setGoldInput] = useFormPersistence('inputDataGold', '');
  const [bitcoinAmount, setBitcoinAmount] = useFormPersistence('inputAmountBitcoin', '');
  const [bitcoinFundValue, setBitcoinFundValue] = useFormPersistence('inputFundValueBitcoin', '');
  const [bitcoinUsdPrice, setBitcoinUsdPrice] = useFormPersistence('inputPriceUSD', '');
  const [cashInput, setCashInput] = useFormPersistence('inputTotalCash', '');
  const [viewMode, setViewMode] = useLocalStorage('viewMode', 'All');

  // Computed state
  const [goldHoldings, setGoldHoldings] = useState<GoldHolding[]>([]);
  const [bitcoinProfit, setBitcoinProfit] = useState<BitcoinProfit | null>(null);
  const [cashEntries, setCashEntries] = useState<CashEntry[]>([]);
  const [assets, setAssets] = useState<AssetModel[]>([]);

  // Fetch prices
  const fetchPrices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [goldPricesResult, bitcoinPriceResult] = await Promise.all([
        PriceService.fetchAllGoldPrices(),
        PriceService.fetchBitcoinPrice()
      ]);

      setGoldPrices(goldPricesResult);
      setBitcoinPrice(bitcoinPriceResult);
    } catch (err) {
      console.error('Error fetching prices:', err);
      setError('Không thể tải giá. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Process data when inputs change
  useEffect(() => {
    try {
      setError(null);
      
      // Process gold holdings
      if (goldInput.trim()) {
        const holdings = BusinessLogic.parseGoldInput(goldInput);
        const holdingsWithProfits = BusinessLogic.calculateGoldProfits(holdings, goldPrices);
        setGoldHoldings(holdingsWithProfits);
      } else {
        setGoldHoldings([]);
      }

      // Process bitcoin profit
      if (bitcoinAmount && bitcoinFundValue && bitcoinUsdPrice && bitcoinPrice) {
        const profit = BusinessLogic.calculateBitcoinProfit(
          parseFloat(bitcoinAmount) || 0,
          parseFloat(bitcoinFundValue) || 0,
          parseFloat(bitcoinUsdPrice) || 0,
          bitcoinPrice
        );
        setBitcoinProfit(profit);
      } else {
        setBitcoinProfit(null);
      }

      // Process cash
      if (cashInput.trim()) {
        const entries = BusinessLogic.parseCashInput(cashInput);
        setCashEntries(entries);
      } else {
        setCashEntries([]);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã có lỗi xảy ra');
      setGoldHoldings([]);
      setBitcoinProfit(null);
      setCashEntries([]);
    }
  }, [goldInput, goldPrices, bitcoinAmount, bitcoinFundValue, bitcoinUsdPrice, bitcoinPrice, cashInput]);

  // Calculate assets summary
  useEffect(() => {
    const goldStats = BusinessLogic.calculateTotalGoldStats(goldHoldings);
    const totalCash = BusinessLogic.calculateTotalCash(cashEntries);
    const assetSummary = BusinessLogic.calculateAssetSummary(
      goldStats.totalSellPrice,
      bitcoinProfit,
      totalCash
    );
    setAssets(assetSummary);
  }, [goldHoldings, bitcoinProfit, cashEntries]);

  // Load prices on mount and set up polling
  useEffect(() => {
    fetchPrices();
    
    // Poll for updates every 60 seconds
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, [fetchPrices]);

  // Handle view mode changes
  const handleViewModeChange = (mode: string) => {
    setViewMode(mode);
  };

  // Determine which sections to show
  const showGoldSection = viewMode === 'All' || viewMode === 'GoldOnly';
  const showBitcoinSection = viewMode === 'All' || viewMode === 'BitcoinOnly';
  const showCashSection = viewMode === 'All' || viewMode === 'CashOnly';
  const showAssetSummary = viewMode === 'All';

  const totalCash = BusinessLogic.calculateTotalCash(cashEntries);

  return (
    <div>
      <ViewModeSelector viewMode={viewMode} onViewModeChange={handleViewModeChange} />

      {showAssetSummary && (
        <section className="content" id="totalAssets">
          <AssetSummary assets={assets} />
        </section>
      )}

      {showGoldSection && (
        <section className="content" id="gold-prices">
          <h2>Bảng giá vàng</h2>
          <GoldPriceTable prices={goldPrices} />
          <h2>Vàng của tôi</h2>
          <GoldPortfolio
            holdings={goldHoldings}
            goldInput={goldInput}
            onGoldInputChange={setGoldInput}
            errorMessage={error}
          />
        </section>
      )}

      {showBitcoinSection && (
        <section className="content" id="bitcoin">
          <BitcoinSection
            bitcoinPrice={bitcoinPrice}
            bitcoinProfit={bitcoinProfit}
            amount={bitcoinAmount}
            fundValue={bitcoinFundValue}
            usdPrice={bitcoinUsdPrice}
            onAmountChange={setBitcoinAmount}
            onFundValueChange={setBitcoinFundValue}
            onUsdPriceChange={setBitcoinUsdPrice}
          />
        </section>
      )}

      {showCashSection && (
        <section className="content" id="cash">
          <CashSection
            cashInput={cashInput}
            totalCash={totalCash}
            onCashInputChange={setCashInput}
          />
        </section>
      )}

      {loading && (
        <div className="align-center">
          <p>Đang tải giá...</p>
        </div>
      )}
    </div>
  );
}

export default App
