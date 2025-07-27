import React from 'react';
import type { AssetModel } from '../types';
import { BusinessLogic } from '../services/businessLogic';

interface AssetSummaryProps {
  assets: AssetModel[];
}

export const AssetSummary: React.FC<AssetSummaryProps> = ({ assets }) => {
  const sumOfAssets = assets.reduce((sum, asset) => sum + asset.value, 0);
  const totalAssetsDisplayText = BusinessLogic.thousandVNDToDisplayText(sumOfAssets);

  return (
    <>
      <h2>Tổng tài sản</h2>
      <table>
        <thead>
          <tr>
            <th>Tài sản</th>
            <th className="align-right">Giá trị</th>
            <th className="align-right">Tỉ lệ</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset, index) => {
            if (asset.value <= 0) return null;
            
            const percentage = sumOfAssets > 0 ? (asset.value / sumOfAssets * 100) : 0;
            
            return (
              <tr key={index}>
                <td>{asset.name}</td>
                <td className="align-right">{BusinessLogic.formatCurrency(asset.value)}</td>
                <td className="align-right">{percentage.toFixed(2)}%</td>
              </tr>
            );
          })}
          <tr style={{ backgroundColor: 'gold' }}>
            <td>Tổng</td>
            <td className="align-right">
              {BusinessLogic.formatCurrency(sumOfAssets)}
              <br/>
              ({totalAssetsDisplayText})
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </>
  );
};