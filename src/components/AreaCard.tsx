
import React from 'react';
import { ChevronRight, Scale, Gavel, BookOpen, FileText, Calculator, Shield } from 'lucide-react';

interface AreaCardProps {
  area: string;
  temasCount: number;
  onClick: () => void;
}

const AreaCard: React.FC<AreaCardProps> = ({ area, temasCount, onClick }) => {
  const getAreaIcon = (areaName: string) => {
    const lowerArea = areaName.toLowerCase();
    
    if (lowerArea.includes('civil')) return Scale;
    if (lowerArea.includes('penal') || lowerArea.includes('criminal')) return Gavel;
    if (lowerArea.includes('constitucional')) return BookOpen;
    if (lowerArea.includes('processual')) return FileText;
    if (lowerArea.includes('tributário') || lowerArea.includes('fiscal')) return Calculator;
    if (lowerArea.includes('fundamental') || lowerArea.includes('direitos')) return Shield;
    
    return Scale; // Default icon
  };

  const AreaIcon = getAreaIcon(area);

  return (
    <button
      onClick={onClick}
      className="w-full p-6 bg-netflix-darkGray border border-netflix-gray rounded-xl hover:border-netflix-red hover:bg-netflix-gray transition-all duration-300 text-left group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-netflix-red/10 rounded-lg group-hover:bg-netflix-red/20 transition-colors">
            <AreaIcon className="h-6 w-6 text-netflix-red" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-netflix-lightGray mb-2 group-hover:text-white">
              {area}
            </h3>
            <p className="text-gray-400 text-sm">
              {temasCount} tema{temasCount !== 1 ? 's' : ''} disponível{temasCount !== 1 ? 'is' : ''}
            </p>
          </div>
        </div>
        <ChevronRight className="h-6 w-6 text-gray-400 group-hover:text-netflix-red transition-colors" />
      </div>
    </button>
  );
};

export default AreaCard;
