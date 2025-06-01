
import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  colorClass: string;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, colorClass, subtitle }) => {
  return (
    <div className={`stat-card ${colorClass} rounded-lg shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm opacity-90 mb-1">{title}</div>
          <div className="text-2xl font-bold">{value}</div>
          {subtitle && <div className="text-xs opacity-75 mt-1">{subtitle}</div>}
        </div>
        <div className="text-3xl opacity-80">{icon}</div>
      </div>
    </div>
  );
};

export default StatCard;
