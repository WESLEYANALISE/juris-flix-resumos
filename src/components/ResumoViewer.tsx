
import React, { useState, useEffect } from 'react';
import { ArrowLeft, User } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';
import FloatingControls from './FloatingControls';
import FavoriteButton from './FavoriteButton';
import CopyButton from './CopyButton';
import { useResumos } from '../hooks/useResumos';
import { supabase } from '@/integrations/supabase/client';

interface ResumoViewerProps {
  area: string;
  modulo: string;
  tema: string;
  assunto: string;
  resumo: string;
  glossario: string;
  exemplo?: string;
  assuntoId: number;
  onBack: () => void;
}

const ResumoViewer: React.FC<ResumoViewerProps> = ({
  area,
  modulo,
  tema,
  assunto,
  resumo,
  glossario,
  exemplo = '',
  assuntoId,
  onBack
}) => {
  const [fontSize, setFontSize] = useState(16);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const {
    addToRecents,
    addToFavorites,
    removeFromFavorites,
    isFavorite
  } = useResumos();
  
  const isItemFavorited = isFavorite(assuntoId);

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      addToRecents(area, modulo, tema, assunto, assuntoId);
    }
  }, [assuntoId, addToRecents, area, modulo, tema, assunto, isAuthenticated]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleFavoriteToggle = () => {
    if (!isAuthenticated) {
      alert('Você precisa estar logado para favoritar resumos.');
      return;
    }

    if (isItemFavorited) {
      removeFromFavorites(assuntoId);
    } else {
      addToFavorites(area, modulo, tema, assunto, assuntoId);
    }
  };

  const handleAuthRedirect = () => {
    window.location.href = '/auth';
  };

  return (
    <div className="min-h-screen bg-netflix-black animate-fade-in">
      <div className="container mx-auto py-6 max-w-5xl px-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-slide-in-top px-[14px]">
          <button 
            onClick={onBack} 
            className="flex items-center gap-2 text-netflix-red hover:text-netflix-darkRed transition-all duration-300 hover:scale-105 transform"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Voltar</span>
          </button>
          
          <div className="flex items-center gap-1">
            {isAuthenticated ? (
              <FavoriteButton 
                assuntoId={assuntoId} 
                isFavorited={isItemFavorited} 
                onToggle={handleFavoriteToggle} 
              />
            ) : (
              <button
                onClick={handleAuthRedirect}
                className="p-3 rounded-full text-gray-400 hover:text-netflix-lightGray hover:bg-netflix-gray/20 transition-colors duration-200"
                title="Faça login para favoritar"
              >
                <User className="h-5 w-5" />
              </button>
            )}
            
            <CopyButton text={resumo} assunto={assunto} />
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="mb-6 animate-slide-in-left">
          <nav className="text-sm text-gray-400 py-0 px-[14px]">
            <span className="break-words">{area}</span>
            <span className="mx-2">›</span>
            <span className="break-words">{modulo}</span>
            <span className="mx-2">›</span>
            <span className="break-words">{tema}</span>
            <span className="mx-2">›</span>
            <span className="text-netflix-lightGray break-words">{assunto}</span>
          </nav>
        </div>

        {/* Title */}
        <h1 className="text-xl md:text-2xl font-bold text-netflix-lightGray mb-8 animate-slide-in-up px-[14px] break-words">
          {assunto}
        </h1>

        {/* Content */}
        <div className="bg-netflix-darkGray border border-netflix-gray rounded-xl p-4 md:p-8 animate-fade-in-up transition-all duration-500 hover:shadow-2xl hover:shadow-netflix-red/10 mx-[14px] md:mx-0">
          <MarkdownRenderer content={resumo} fontSize={fontSize} />
        </div>
      </div>

      {/* Floating Controls with Menu */}
      <FloatingControls 
        fontSize={fontSize} 
        onFontSizeChange={setFontSize} 
        onScrollToTop={scrollToTop} 
        showScrollButton={showScrollButton}
        glossaryContent={glossario}
        exampleContent={exemplo}
      />
    </div>
  );
};

export default ResumoViewer;
