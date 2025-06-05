
import React from 'react';
import { ChevronRight } from 'lucide-react';

interface AreaCardProps {
  area: string;
  temasCount: number;
  onClick: () => void;
}

const AreaCard: React.FC<AreaCardProps> = ({ area, temasCount, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full p-6 bg-netflix-darkGray border border-netflix-gray rounded-xl hover:border-netflix-red hover:bg-netflix-gray transition-all duration-300 text-left group"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-netflix-lightGray mb-2 group-hover:text-white">
            {area}
          </h3>
          <p className="text-gray-400 text-sm">
            {temasCount} tema{temasCount !== 1 ? 's' : ''} disponível{temasCount !== 1 ? 'is' : ''}
          </p>
        </div>
        <ChevronRight className="h-6 w-6 text-gray-400 group-hover:text-netflix-red transition-colors" />
      </div>
    </button>
  );
};

export default AreaCard;
