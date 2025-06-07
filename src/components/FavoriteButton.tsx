
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
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    onToggle?.();
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  return (
    <button
      onClick={handleToggle}
      className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
        isFavorited 
          ? 'bg-netflix-red/20 hover:bg-netflix-red/30' 
          : 'hover:bg-netflix-gray/30'
      } ${isAnimating ? 'scale-125' : ''}`}
      title={isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      <Heart 
        className={`h-5 w-5 transition-all duration-300 ${
          isFavorited 
            ? 'text-netflix-red fill-current animate-pulse' 
            : 'text-gray-400 hover:text-netflix-red'
        } ${isAnimating ? 'animate-bounce' : ''}`} 
      />
    </button>
  );
};

export default FavoriteButton;
