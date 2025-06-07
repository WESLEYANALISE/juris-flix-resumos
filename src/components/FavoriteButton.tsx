
import React, { useState } from 'react';
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
  const handleToggle = () => {
    onToggle?.();
  };

  return (
    <button
      onClick={handleToggle}
      className={`p-2 rounded-full transition-colors duration-200 hover:bg-netflix-gray/30 ${
        isFavorited 
          ? 'text-netflix-red' 
          : 'text-gray-400 hover:text-netflix-red'
      }`}
      title={isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      <Heart 
        className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} 
      />
    </button>
  );
};

export default FavoriteButton;
