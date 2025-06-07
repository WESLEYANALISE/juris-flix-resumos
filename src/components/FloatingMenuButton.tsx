
import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, FileText, Lightbulb, Brain } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';

interface FloatingMenuButtonProps {
  glossaryContent?: string;
  exampleContent?: string;
  mapaMentalContent?: string;
}

const FloatingMenuButton: React.FC<FloatingMenuButtonProps> = ({
  glossaryContent = '',
  exampleContent = '',
  mapaMentalContent = ''
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<'glossary' | 'example' | 'mapaMental' | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasGlossary = glossaryContent && glossaryContent.trim() !== '';
  const hasExample = exampleContent && exampleContent.trim() !== '';
  const hasMapaMental = mapaMentalContent && mapaMentalContent.trim() !== '';

  if (!hasGlossary && !hasExample && !hasMapaMental) {
    return null;
  }

  const openModal = (type: 'glossary' | 'example' | 'mapaMental') => {
    setActiveModal(type);
    setIsMenuOpen(false);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <>
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-12 h-12 bg-netflix-red hover:bg-netflix-darkRed text-white rounded-full flex items-center justify-center shadow-xl transition-all transform hover:scale-105"
          title="Recursos Adicionais"
        >
          <BookOpen className="h-5 w-5" />
        </button>

        {isMenuOpen && (
          <div className="absolute bottom-14 right-0 bg-netflix-darkGray border border-netflix-gray rounded-lg shadow-xl min-w-[180px] z-50 overflow-hidden animate-scale-in">
            {hasGlossary && (
              <button
                onClick={() => openModal('glossary')}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-netflix-lightGray hover:bg-netflix-gray hover:text-white transition-colors"
              >
                <FileText className="h-4 w-4 text-netflix-red flex-shrink-0" />
                <span className="text-sm font-medium">Glossário</span>
              </button>
            )}
            
            {hasExample && (
              <button
                onClick={() => openModal('example')}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-netflix-lightGray hover:bg-netflix-gray hover:text-white transition-colors"
              >
                <Lightbulb className="h-4 w-4 text-netflix-red flex-shrink-0" />
                <span className="text-sm font-medium">Exemplo Prático</span>
              </button>
            )}

            {hasMapaMental && (
              <button
                onClick={() => openModal('mapaMental')}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-netflix-lightGray hover:bg-netflix-gray hover:text-white transition-colors"
              >
                <Brain className="h-4 w-4 text-netflix-red flex-shrink-0" />
                <span className="text-sm font-medium">Mapa Mental</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Glossary Modal */}
      {activeModal === 'glossary' && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-netflix-darkGray border border-netflix-gray rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-netflix-gray">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-netflix-red" />
                <h2 className="text-xl font-bold text-netflix-lightGray">Glossário</h2>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-netflix-red transition-colors text-2xl leading-none"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
              <MarkdownRenderer content={glossaryContent} fontSize={15} />
            </div>
          </div>
        </div>
      )}

      {/* Example Modal */}
      {activeModal === 'example' && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-netflix-darkGray border border-netflix-gray rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-netflix-gray">
              <div className="flex items-center gap-3">
                <Lightbulb className="h-6 w-6 text-netflix-red" />
                <h2 className="text-xl font-bold text-netflix-lightGray">Exemplo Prático</h2>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-netflix-red transition-colors text-2xl leading-none"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
              <MarkdownRenderer content={exampleContent} fontSize={15} />
            </div>
          </div>
        </div>
      )}

      {/* Mapa Mental Modal */}
      {activeModal === 'mapaMental' && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-netflix-darkGray border border-netflix-gray rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-netflix-gray">
              <div className="flex items-center gap-3">
                <Brain className="h-6 w-6 text-netflix-red" />
                <h2 className="text-xl font-bold text-netflix-lightGray">Mapa Mental</h2>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-netflix-red transition-colors text-2xl leading-none"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
              <MarkdownRenderer content={mapaMentalContent} fontSize={15} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingMenuButton;
