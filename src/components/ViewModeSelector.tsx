import React from 'react';

interface ViewModeSelectorProps {
  viewMode: string;
  onViewModeChange: (mode: string) => void;
}

export const ViewModeSelector: React.FC<ViewModeSelectorProps> = ({
  viewMode,
  onViewModeChange
}) => {
  return (
    <section id="config" className="align-right">
      <select
        className="config-select"
        id="viewMode"
        value={viewMode}
        onChange={(e) => onViewModeChange(e.target.value)}
      >
        <option value="GoldOnly">Vàng</option>
        <option value="BitcoinOnly">Bitcoin</option>
        <option value="CashOnly">Tiền mặt</option>
        <option value="All">Tất cả</option>
      </select>
    </section>
  );
};