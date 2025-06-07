
import React from 'react';
import { FileText } from 'lucide-react';
import FavoriteButton from './FavoriteButton';

interface AssuntoCardProps {
  assunto: string;
  assuntoId: number;
  area: string;
  modulo: string;
  tema: string;
  isFavorited: boolean;
  onToggleFavorite: () => void;
  onClick: () => void;
  sequenceNumber?: number;
  totalCount?: number;
}

const AssuntoCard: React.FC<AssuntoCardProps> = ({
  assunto,
  assuntoId,
  area,
  modulo,
  tema,
  isFavorited,
  onToggleFavorite,
  onClick,
  sequenceNumber,
  totalCount
}) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite();
  };

  // Generate color based on area and module for variety
  const getCardColor = (area: string, modulo: string) => {
    const areaHash = area.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const moduloHash = modulo.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const combined = areaHash + moduloHash;
    
    const colors = [
      'bg-blue-500/25 border-blue-500/50 hover:border-blue-400',
      'bg-green-500/25 border-green-500/50 hover:border-green-400',
      'bg-purple-500/25 border-purple-500/50 hover:border-purple-400',
      'bg-orange-500/25 border-orange-500/50 hover:border-orange-400',
      'bg-pink-500/25 border-pink-500/50 hover:border-pink-400',
      'bg-indigo-500/25 border-indigo-500/50 hover:border-indigo-400',
      'bg-teal-500/25 border-teal-500/50 hover:border-teal-400',
      'bg-cyan-500/25 border-cyan-500/50 hover:border-cyan-400',
    ];
    
    return colors[combined % colors.length];
  };

  const getIconColor = (area: string, modulo: string) => {
    const areaHash = area.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const moduloHash = modulo.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const combined = areaHash + moduloHash;
    
    const colors = [
      'text-blue-400',
      'text-green-400',
      'text-purple-400',
      'text-orange-400',
      'text-pink-400',
      'text-indigo-400',
      'text-teal-400',
      'text-cyan-400',
    ];
    
    return colors[combined % colors.length];
  };

  const cardColorClass = getCardColor(area, modulo);
  const iconColorClass = getIconColor(area, modulo);

  return (
    <div 
      onClick={onClick}
      className={`w-full p-4 border transition-all duration-300 group rounded-xl cursor-pointer ${cardColorClass}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <FileText className={`h-5 w-5 flex-shrink-0 ${iconColorClass}`} />
          <div className="flex-1">
            <span className="text-netflix-lightGray group-hover:text-white font-medium text-sm block">
              {assunto}
            </span>
            {sequenceNumber && totalCount && (
              <span className="text-xs text-gray-400 mt-1 block">
                {sequenceNumber} de {totalCount}
              </span>
            )}
          </div>
        </div>
        
        <div onClick={handleFavoriteClick} className="flex-shrink-0">
          <FavoriteButton 
            assuntoId={assuntoId} 
            isFavorited={isFavorited} 
            onToggle={onToggleFavorite} 
          />
        </div>
      </div>
    </div>
  );
};

export default AssuntoCard;
