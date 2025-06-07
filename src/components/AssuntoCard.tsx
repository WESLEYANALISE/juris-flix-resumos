
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
}

const AssuntoCard: React.FC<AssuntoCardProps> = ({ 
  assunto, 
  assuntoId, 
  area, 
  modulo, 
  tema, 
  isFavorited, 
  onToggleFavorite, 
  onClick 
}) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card click
    onToggleFavorite();
  };

  return (
    <div className="w-full p-4 bg-netflix-darkGray border border-netflix-gray rounded-lg hover:border-netflix-red hover:bg-netflix-gray transition-all duration-300 group">
      <div className="flex items-start justify-between gap-3">
        <button
          onClick={onClick}
          className="flex items-start gap-3 flex-1 text-left min-w-0"
        >
          <FileText className="h-5 w-5 text-netflix-red flex-shrink-0 mt-0.5" />
          <span className="text-netflix-lightGray group-hover:text-white font-medium text-sm leading-5 break-words overflow-wrap-anywhere">
            {assunto}
          </span>
        </button>
        
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
