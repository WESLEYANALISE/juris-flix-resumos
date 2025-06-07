
import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';
import FloatingControls from './FloatingControls';
import FavoriteButton from './FavoriteButton';
import CopyButton from './CopyButton';
import { useResumos } from '../hooks/useResumos';
import { useIsMobile } from '../hooks/useIsMobile';

interface ResumoViewerProps {
  area: string;
  modulo: string;
  tema: string;
  assunto: string;
  resumo: string;
  glossario: string;
  exemplo?: string;
  mapaMental: string;
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
  mapaMental,
  assuntoId,
  onBack
}) => {
  const [fontSize, setFontSize] = useState(16);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const isMobile = useIsMobile();
  
  const {
    addToRecents,
    addToFavorites,
    removeFromFavorites,
    isFavorite
  } = useResumos();
  
  const isItemFavorited = isFavorite(assuntoId);

  useEffect(() => {
    addToRecents(area, modulo, tema, assunto, assuntoId);
  }, [assuntoId, addToRecents, area, modulo, tema, assunto]);

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
    if (isItemFavorited) {
      removeFromFavorites(assuntoId);
    } else {
      addToFavorites(area, modulo, tema, assunto, assuntoId);
    }
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
          
          <div className="flex items-center gap-2">
            <FavoriteButton 
              assuntoId={assuntoId} 
              isFavorited={isItemFavorited} 
              onToggle={handleFavoriteToggle} 
            />
            
            <div className="bg-netflix-red/20 border border-netflix-red rounded-lg p-1">
              <CopyButton text={resumo} assunto={assunto} />
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="mb-6 animate-slide-in-left">
          <nav className="text-sm text-gray-400 py-0 px-[14px]">
            <span>{area}</span>
            <span className="mx-2">›</span>
            <span>{modulo}</span>
            <span className="mx-2">›</span>
            <span>{tema}</span>
            <span className="mx-2">›</span>
            <span className="text-netflix-lightGray">{assunto}</span>
          </nav>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-netflix-lightGray mb-8 animate-slide-in-up px-[14px]">
          {assunto}
        </h1>

        {/* Content */}
        <div className="bg-netflix-darkGray border border-netflix-gray rounded-xl p-8 px-[22px] animate-fade-in-up transition-all duration-500 hover:shadow-2xl hover:shadow-netflix-red/10 py-[15px]">
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
        mapaMentalContent={mapaMental}
      />
    </div>
  );
};

export default ResumoViewer;
