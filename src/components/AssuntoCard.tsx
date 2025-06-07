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
  return <div className="w-full p-4 border border-netflix-gray hover:border-netflix-red transition-all duration-300 group rounded-xl bg-[#b71b29]/25">
      <div className="flex items-center justify-between gap-3">
        <button onClick={onClick} className="flex items-center gap-3 flex-1 text-left">
          <FileText className="h-5 w-5 text-netflix-red flex-shrink-0" />
          <span className="text-netflix-lightGray group-hover:text-white font-medium text-sm">
            {assunto}
          </span>
        </button>
        
        <div onClick={handleFavoriteClick} className="flex-shrink-0">
          <FavoriteButton assuntoId={assuntoId} isFavorited={isFavorited} onToggle={onToggleFavorite} />
        </div>
      </div>
    </div>;
};
export default AssuntoCard;