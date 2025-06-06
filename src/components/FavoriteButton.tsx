
import React, { useState } from 'react';
import { Heart } from 'lucide-react';

interface FavoriteButtonProps {
  assuntoId: number;
  isFavorited?: boolean;
  onToggle?: (assuntoId: number, isFavorited: boolean) => void;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
  assuntoId, 
  isFavorited = false,
  onToggle 
}) => {
  const [favorited, setFavorited] = useState(isFavorited);

  const handleToggle = () => {
    const newState = !favorited;
    setFavorited(newState);
    onToggle?.(assuntoId, newState);
  };

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-full hover:bg-netflix-gray/30 transition-colors group"
      title={favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      <Heart 
        className={`h-5 w-5 transition-colors ${
          favorited 
            ? 'text-netflix-red fill-current' 
            : 'text-gray-400 group-hover:text-netflix-red'
        }`} 
      />
    </button>
  );
};

export default FavoriteButton;
