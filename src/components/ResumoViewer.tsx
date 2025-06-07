
import React, { useEffect } from 'react';
import { X, Heart, Clock } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';
import FavoriteButton from './FavoriteButton';
import CopyButton from './CopyButton';
import { useResumos } from '@/hooks/useResumos';

interface ResumoViewerProps {
  isOpen: boolean;
  onClose: () => void;
  area: string;
  modulo: string;
  tema: string;
  assunto: string;
  assuntoId: number;
  texto: string;
  glossario: string;
  exemplo?: string;
}

const ResumoViewer: React.FC<ResumoViewerProps> = ({
  isOpen,
  onClose,
  area,
  modulo,
  tema,
  assunto,
  assuntoId,
  texto,
  glossario,
  exemplo
}) => {
  const { addToRecents, addToFavorites, removeFromFavorites, isFavorite, isAuthenticated } = useResumos();

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      addToRecents(area, modulo, tema, assunto, assuntoId);
    }
  }, [isOpen, area, modulo, tema, assunto, assuntoId, addToRecents, isAuthenticated]);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) return;
    
    if (isFavorite(assuntoId)) {
      await removeFromFavorites(assuntoId);
    } else {
      await addToFavorites(area, modulo, tema, assunto, assuntoId);
    }
  };

  if (!isOpen) return null;

  // Combine all content for copying
  const fullContent = `${assunto}\n\n${texto}${glossario ? `\n\nGlossário:\n${glossario}` : ''}${exemplo ? `\n\nExemplo:\n${exemplo}` : ''}`;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-netflix-darkGray border border-netflix-gray rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-netflix-gray">
          <div className="flex-1 min-w-0 mr-4">
            <h2 className="text-lg sm:text-xl font-bold text-netflix-lightGray mb-2 break-words overflow-wrap-anywhere">
              {assunto}
            </h2>
            <p className="text-sm text-gray-400 break-words">
              {area} › {modulo} › {tema}
            </p>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            {isAuthenticated && (
              <FavoriteButton
                assuntoId={assuntoId}
                isFavorited={isFavorite(assuntoId)}
                onToggle={handleToggleFavorite}
              />
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-netflix-red transition-colors rounded-lg hover:bg-netflix-gray"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="space-y-6">
            {/* Main content */}
            <div className="prose prose-invert max-w-none">
              <MarkdownRenderer content={texto} />
            </div>

            {/* Glossário */}
            {glossario && (
              <div>
                <h3 className="text-lg font-semibold text-netflix-lightGray mb-3 flex items-center gap-2">
                  📚 Glossário
                </h3>
                <div className="bg-netflix-gray/50 border border-netflix-gray rounded-lg p-4">
                  <MarkdownRenderer content={glossario} />
                </div>
              </div>
            )}

            {/* Exemplo */}
            {exemplo && (
              <div>
                <h3 className="text-lg font-semibold text-netflix-lightGray mb-3 flex items-center gap-2">
                  💡 Exemplo
                </h3>
                <div className="bg-blue-600/20 border border-blue-600/50 rounded-lg p-4">
                  <MarkdownRenderer content={exemplo} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer with actions */}
        <div className="p-4 sm:p-6 border-t border-netflix-gray flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
          {!isAuthenticated && (
            <div className="flex items-center gap-2 text-sm text-gray-400 bg-netflix-gray/50 rounded-lg p-3">
              <Heart className="h-4 w-4" />
              <span>Faça login para favoritar e ver recentes</span>
            </div>
          )}
          
          <div className="flex gap-3 sm:ml-auto">
            <CopyButton 
              text={fullContent}
              className="flex-1 sm:flex-none justify-center"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumoViewer;
