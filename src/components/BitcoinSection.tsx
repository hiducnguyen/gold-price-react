import React from 'react';
import type { BitcoinPrice, BitcoinProfit } from '../types';
import { BusinessLogic } from '../services/businessLogic';

interface BitcoinSectionProps {
  bitcoinPrice: BitcoinPrice | null;
  bitcoinProfit: BitcoinProfit | null;
  amount: string;
  fundValue: string;
  usdPrice: string;
  onAmountChange: (value: string) => void;
  onFundValueChange: (value: string) => void;
  onUsdPriceChange: (value: string) => void;
}

export const BitcoinSection: React.FC<BitcoinSectionProps> = ({
  bitcoinPrice,
  bitcoinProfit,
  amount,
  fundValue,
  usdPrice,
  onAmountChange,
  onFundValueChange,
  onUsdPriceChange
}) => {
  const formatDiff = (diff: number) => {
    const sign = diff >= 0 ? '+' : '';
    return (
      <span className={diff >= 0 ? 'diff-positive' : 'diff-negative'}>
        ({sign}{diff.toFixed(2)})
      </span>
    );
  };

  return (
    <>
      <h2>Bitcoin</h2>
      {bitcoinPrice && (
        <p className="align-center">
          Giá: {bitcoinPrice.currentPrice.toFixed(2)} USDT {formatDiff(bitcoinPrice.diff)}
        </p>
      )}
      
      {bitcoinProfit && (
        <table>
          <thead>
            <tr>
              <th>Số lượng</th>
              <th className="align-right">Tổng vốn</th>
              <th className="align-right">Giá thị trường</th>
              <th className="align-right">Lãi / lỗ</th>
              <th className="align-right">Tỉ lệ</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{bitcoinProfit.amount}</td>
              <td className="align-right">{BusinessLogic.formatCurrency(bitcoinProfit.fundValue)}</td>
              <td className="align-right">{BusinessLogic.formatCurrency(bitcoinProfit.marketValue)}</td>
              <td className={`${bitcoinProfit.profit >= 0 ? 'positive' : 'negative'} profit`}>
                {BusinessLogic.formatCurrency(bitcoinProfit.profit)}
              </td>
              <td className={`${bitcoinProfit.profit >= 0 ? 'positive' : 'negative'} profit`}>
                {BusinessLogic.calculateProfitPercentage(bitcoinProfit.profit, bitcoinProfit.fundValue).toFixed(2)}%
              </td>
            </tr>
          </tbody>
        </table>
      )}
      
      <br/>
      <section className="inputBitcoin">
        <div className="form-group">
          <label htmlFor="inputAmountBitcoin">Số lượng</label>
          <input
            type="text"
            id="inputAmountBitcoin"
            name="inputAmountBitcoin"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="inputFundValueBitcoin">Số tiền mua (nghìn đồng)</label>
          <input
            type="text"
            id="inputFundValueBitcoin"
            name="inputFundValueBitcoin"
            value={fundValue}
            onChange={(e) => onFundValueChange(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="inputPriceUSD">Giá USDT</label>
          <input
            type="text"
            id="inputPriceUSD"
            name="inputPriceUSD"
            value={usdPrice}
            onChange={(e) => onUsdPriceChange(e.target.value)}
          />
        </div>
      </section>
    </>
  );
};