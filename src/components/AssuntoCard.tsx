
import React from 'react';
import { FileText } from 'lucide-react';
import FavoriteButton from './FavoriteButton';
import { getAreaColors } from '../utils/areaColors';

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

  const colors = getAreaColors(area);

  return (
    <div 
      onClick={onClick}
      className="w-full p-4 border transition-all duration-300 group rounded-xl cursor-pointer hover:scale-105 hover:shadow-lg"
      style={{ 
        backgroundColor: `${colors.primary}10`,
        borderColor: `${colors.primary}30`
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = colors.primary;
        e.currentTarget.style.boxShadow = `0 8px 25px ${colors.primary}20`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = `${colors.primary}30`;
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <FileText 
            className="h-5 w-5 flex-shrink-0 transition-colors duration-300" 
            style={{ color: colors.primary }}
          />
          <div className="flex-1">
            <span className="text-netflix-lightGray group-hover:text-white font-medium text-sm block transition-colors duration-300">
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
