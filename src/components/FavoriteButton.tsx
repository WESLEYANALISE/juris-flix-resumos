
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

  const handleInteraction = async (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Prevent double-tap zoom on mobile
    if ('touches' in e) {
      e.preventDefault();
    }
    
    setIsAnimating(true);
    
    try {
      await onToggle?.();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
    
    setTimeout(() => setIsAnimating(false), 300);
  };

  // Detect if we're in an iframe
  const isInIframe = window !== window.parent;
  
  return (
    <button
      onClick={handleInteraction}
      onTouchStart={handleInteraction}
      className={`
        p-3 rounded-full transition-all duration-300 
        hover:bg-netflix-gray/30 transform active:scale-95 
        touch-manipulation select-none
        ${isAnimating ? 'animate-pulse scale-110' : 'hover:scale-110'}
        ${isFavorited ? 'text-netflix-red' : 'text-gray-400 hover:text-netflix-red'}
        ${isInIframe ? 'cursor-pointer' : ''}
      `}
      title={isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      style={{ 
        WebkitTapHighlightColor: 'transparent',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      }}
      aria-label={isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      <Heart 
        className={`
          h-5 w-5 transition-all duration-300 
          ${isFavorited ? 'fill-current scale-110' : ''} 
          ${isAnimating ? 'animate-bounce' : ''}
        `} 
      />
    </button>
  );
};

export default FavoriteButton;
