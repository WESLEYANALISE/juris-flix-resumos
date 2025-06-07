
import React from 'react';
import { X, Heart, HeartOff, Download, Share2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import MarkdownRenderer from './MarkdownRenderer';
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
  const { addToFavorites, removeFromFavorites, addToRecents, isFavorite, isAuthenticated } = useResumos();
  const favorited = isFavorite(assuntoId);

  React.useEffect(() => {
    if (isOpen && isAuthenticated) {
      addToRecents(area, modulo, tema, assunto, assuntoId);
    }
  }, [isOpen, isAuthenticated, area, modulo, tema, assunto, assuntoId, addToRecents]);

  const handleToggleFavorite = () => {
    if (!isAuthenticated) return;
    
    if (favorited) {
      removeFromFavorites(assuntoId);
    } else {
      addToFavorites(area, modulo, tema, assunto, assuntoId);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-netflix-darkGray border border-netflix-gray rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-netflix-gray">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-white mb-2">{assunto}</h2>
            <p className="text-gray-400 text-sm">
              {area} • {modulo} • {tema}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleFavorite}
                className="text-gray-400 hover:text-netflix-red"
              >
                {favorited ? (
                  <HeartOff className="h-5 w-5" />
                ) : (
                  <Heart className="h-5 w-5" />
                )}
              </Button>
            )}
            
            <CopyButton 
              text={`${texto}\n\n${glossario}${exemplo ? `\n\n${exemplo}` : ''}`}
              className="text-sm"
            />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            {/* Texto Principal */}
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Resumo</h3>
              <div className="bg-netflix-black/30 p-4 rounded-lg">
                <MarkdownRenderer content={texto} fontSize="text-sm" />
              </div>
            </div>

            {/* Glossário */}
            {glossario && (
              <div>
                <h3 className="text-lg font-medium text-white mb-3">Glossário</h3>
                <div className="bg-netflix-black/30 p-4 rounded-lg">
                  <MarkdownRenderer content={glossario} fontSize="text-sm" />
                </div>
              </div>
            )}

            {/* Exemplo */}
            {exemplo && (
              <div>
                <h3 className="text-lg font-medium text-white mb-3">Exemplo</h3>
                <div className="bg-netflix-black/30 p-4 rounded-lg">
                  <MarkdownRenderer content={exemplo} fontSize="text-sm" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumoViewer;
