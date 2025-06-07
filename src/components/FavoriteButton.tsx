
import React from 'react';
import { Heart } from 'lucide-react';

interface FavoriteButtonProps {
  assuntoId: number;
  isFavorited?: boolean;
  onToggle?: () => void;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  assuntoId,
  isFavorited = false,
  onToggle
}) => {
  const handleToggle = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggle?.();
  };

  return (
    <button
      onClick={handleToggle}
      onTouchEnd={handleToggle}
      className={`p-3 rounded-full transition-all duration-300 hover:bg-netflix-gray/30 transform hover:scale-110 active:scale-95 touch-manipulation ${
        isFavorited 
          ? 'text-netflix-red' 
          : 'text-gray-400 hover:text-netflix-red'
      }`}
      title={isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <Heart 
        className={`h-5 w-5 transition-all duration-300 ${isFavorited ? 'fill-current scale-110' : ''}`} 
      />
    </button>
  );
};

export default FavoriteButton;
