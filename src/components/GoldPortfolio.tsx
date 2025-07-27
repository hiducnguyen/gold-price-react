import React from 'react';
import type { GoldHolding } from '../types';
import { BusinessLogic } from '../services/businessLogic';

interface GoldPortfolioProps {
  holdings: GoldHolding[];
  goldInput: string;
  onGoldInputChange: (value: string) => void;
  errorMessage: string | null;
}

export const GoldPortfolio: React.FC<GoldPortfolioProps> = ({
  holdings,
  goldInput,
  onGoldInputChange,
  errorMessage
}) => {
  const stats = BusinessLogic.calculateTotalGoldStats(holdings);

  return (
    <>
      {holdings.length > 0 && !errorMessage && (
        <table>
          <thead>
            <tr>
              <th>Số lượng (chỉ)</th>
              <th>Cửa hàng</th>
              <th className="align-right">Giá mua</th>
              <th className="align-right">Giá bán</th>
              <th className="align-right">Lãi / lỗ</th>
              <th className="align-right">Tỉ lệ</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((holding, index) => {
              const profit = holding.profit || 0;
              const profitPercentage = BusinessLogic.calculateProfitPercentage(profit, holding.buyPrice);
              
              return (
                <tr key={index}>
                  <td>{holding.amount}</td>
                  <td>{holding.seller}</td>
                  <td className="align-right">{BusinessLogic.formatCurrency(holding.buyPrice)}</td>
                  <td className="align-right">{BusinessLogic.formatCurrency(holding.currentValue || 0)}</td>
                  <td className={`${profit >= 0 ? 'positive' : 'negative'} profit`}>
                    {profit >= 0 ? '+' : ''}{BusinessLogic.formatCurrency(profit)}
                  </td>
                  <td className={`${profit >= 0 ? 'positive' : 'negative'} profit`}>
                    {BusinessLogic.formatPercentage(profitPercentage)}
                  </td>
                </tr>
              );
            })}
            <tr>
              <th colSpan={6} style={{ backgroundColor: 'gold' }}>Tổng</th>
            </tr>
            <tr>
              <td>{stats.totalAmount}</td>
              <td></td>
              <td className="align-right">{BusinessLogic.formatCurrency(stats.totalBuyPrice)}</td>
              <td className="align-right">{BusinessLogic.formatCurrency(stats.totalSellPrice)}</td>
              <td className={`${stats.totalProfit >= 0 ? 'positive' : 'negative'} profit`}>
                {stats.totalProfit >= 0 ? '+' : ''}{BusinessLogic.formatCurrency(stats.totalProfit)}
              </td>
              <td className={`${stats.totalProfit >= 0 ? 'positive' : 'negative'} profit`}>
                {BusinessLogic.formatPercentage(stats.totalProfitPercentage)}
              </td>
            </tr>
          </tbody>
        </table>
      )}
      
      <div className="form-group">
        <p>
          <strong>Cú pháp: </strong>mã cửa hàng,giá mua (nghìn đồng),số chỉ
          <br/>
          <strong>Ví dụ: </strong>Pnj,4200,0.5 =&gt; mua 0.5 chỉ ở PNJ với giá 4,200 nghìn đồng
        </p>
        <textarea
          id="inputDataGold"
          name="inputDataGold"
          rows={10}
          placeholder={`Ví dụ:
pnj,8400,1
doji,16000,2
pnj,4500,0.5
pnj,4400,1.5
mih,9000,1`}
          value={goldInput}
          onChange={(e) => onGoldInputChange(e.target.value)}
        />
      </div>
      
      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}
    </>
  );
};