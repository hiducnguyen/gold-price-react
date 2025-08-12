import React from 'react';
import type { GoldPrice } from '../types';
import { BusinessLogic } from '../services/businessLogic';

interface GoldPriceTableProps {
  prices: GoldPrice[];
}

const dateTimeFormat = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});

export const GoldPriceTable: React.FC<GoldPriceTableProps> = ({ prices }) => {
  const formatDate = (date: Date) => {
    try {
      return dateTimeFormat.format(date);
    } catch (error) {
      console.error('Error parsing date:', error);
      return date;
    }
  };

  const formatDiff = (diff: number) => {
    if (diff === 0) return null;
    const sign = diff >= 0 ? '+' : '';
    return (
      <span className={diff >= 0 ? 'diff-positive' : 'diff-negative'}>
        ({sign}{BusinessLogic.formatCurrency(diff)})
      </span>
    );
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr>
            <th style={{width: '5%'}}>Mã</th>
            <th style={{width: '15%'}}>Cửa hàng</th>
            <th style={{width: '30%'}} className="align-center">Giá bán</th>
            <th style={{width: '30%'}} className="align-center">Giá mua</th>
            <th style={{width: '5%'}} className="align-center">Chênh lệch</th>
            <th style={{width: '15%'}}>Ngày cập nhật</th>
          </tr>
        </thead>
        <tbody>
          {prices.map((price, index) => (
            <tr key={index}>
              <td>{price.seller}</td>
              <td>{price.seller}</td>
              <td className="align-center">
                {BusinessLogic.formatCurrency(price.sellPrice)} {formatDiff(price.sellDiff)}
              </td>
              <td className="align-center">
                {BusinessLogic.formatCurrency(price.buyPrice)} {formatDiff(price.buyDiff)}
              </td>
              <td className="align-center diff">
                {BusinessLogic.formatCurrency(price.sellPrice - price.buyPrice)}
              </td>
              <td>{formatDate(price.updateDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};