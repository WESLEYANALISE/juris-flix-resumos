
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  description 
}) => {
  return (
    <div className="bg-netflix-darkGray border border-netflix-gray rounded-xl p-6 hover:border-netflix-red/50 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-netflix-red/20 rounded-lg">
          <Icon className="h-6 w-6 text-netflix-red" />
        </div>
        {trend && (
          <div className={`text-sm font-medium ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </div>
        )}
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        <p className="text-2xl font-bold text-netflix-lightGray">{value}</p>
        {description && (
          <p className="text-xs text-gray-500">{description}</p>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
