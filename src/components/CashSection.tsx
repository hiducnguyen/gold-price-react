import React from 'react';
import { BusinessLogic } from '../services/businessLogic';

interface CashSectionProps {
  cashInput: string;
  totalCash: number;
  onCashInputChange: (value: string) => void;
}

export const CashSection: React.FC<CashSectionProps> = ({
  cashInput,
  totalCash,
  onCashInputChange
}) => {
  return (
    <>
      <h2>Tiền mặt</h2>
      <div className="form-group">
        <label htmlFor="inputTotalCash">Số tiền mặt (triệu đồng)</label>
        <textarea
          id="inputTotalCash"
          name="inputTotalCash"
          rows={5}
          value={cashInput}
          onChange={(e) => onCashInputChange(e.target.value)}
        />
        {totalCash > 0 && (
          <p className="align-center">
            Tổng tiền mặt: {BusinessLogic.formatCurrency(totalCash)} triệu đồng
          </p>
        )}
      </div>
    </>
  );
};