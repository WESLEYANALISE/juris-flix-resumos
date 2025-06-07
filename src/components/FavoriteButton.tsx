
import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import AuthModal from './AuthModal';

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
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  
  const { user } = useAuth();

  const handleInteraction = async (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Prevenir zoom duplo no mobile
    if ('touches' in e) {
      e.preventDefault();
    }
    
    // Se não estiver logado, mostrar modal de autenticação
    if (!user) {
      setPendingAction(() => onToggle);
      setShowAuthModal(true);
      return;
    }
    
    setIsAnimating(true);
    
    try {
      await onToggle?.();
    } catch (error) {
      console.error('Erro ao favoritar:', error);
    }
    
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    // Executar ação pendente após login
    if (pendingAction) {
      setTimeout(() => {
        pendingAction();
        setPendingAction(null);
      }, 100);
    }
  };

  // Detectar se estamos em iframe ou mobile
  const isInIframe = window !== window.parent;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  return (
    <>
      <button
        onClick={handleInteraction}
        onTouchStart={handleInteraction}
        className={`
          p-3 rounded-lg transition-all duration-300 
          transform active:scale-95 touch-manipulation select-none
          hover:bg-netflix-gray/30 
          ${isAnimating ? 'animate-pulse scale-110' : 'hover:scale-110'}
          ${isFavorited ? 'text-netflix-red' : 'text-gray-400 hover:text-netflix-red'}
          ${isInIframe || isMobile ? 'cursor-pointer' : ''}
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

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setPendingAction(null);
        }}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
};

export default FavoriteButton;
