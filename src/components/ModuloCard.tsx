
import React from 'react';
import { BookOpen, ChevronRight } from 'lucide-react';

interface ModuloCardProps {
  numero: string;
  nome: string;
  temasCount: number;
  assuntosCount?: number;
  onClick: () => void;
  sequenceNumber?: number;
  totalCount?: number;
  area?: string;
}

const ModuloCard: React.FC<ModuloCardProps> = ({
  numero,
  nome,
  temasCount,
  assuntosCount = 0,
  onClick,
  sequenceNumber,
  totalCount,
  area = ''
}) => {
  // Generate color based on area and module number
  const getCardColor = (area: string, numero: string) => {
    const combinedText = area + numero;
    const hash = combinedText.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    
    const colors = [
      'bg-red-500/15 border-red-500/30 hover:border-red-400',
      'bg-blue-500/15 border-blue-500/30 hover:border-blue-400',
      'bg-green-500/15 border-green-500/30 hover:border-green-400',
      'bg-yellow-500/15 border-yellow-500/30 hover:border-yellow-400',
      'bg-purple-500/15 border-purple-500/30 hover:border-purple-400',
      'bg-pink-500/15 border-pink-500/30 hover:border-pink-400',
      'bg-indigo-500/15 border-indigo-500/30 hover:border-indigo-400',
      'bg-teal-500/15 border-teal-500/30 hover:border-teal-400',
    ];
    
    return colors[hash % colors.length];
  };

  const getIconAndNumberColor = (area: string, numero: string) => {
    const combinedText = area + numero;
    const hash = combinedText.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    
    const colors = [
      'text-red-400',
      'text-blue-400', 
      'text-green-400',
      'text-yellow-400',
      'text-purple-400',
      'text-pink-400',
      'text-indigo-400',
      'text-teal-400',
    ];
    
    return colors[hash % colors.length];
  };

  const cardColorClass = getCardColor(area, numero);
  const iconColorClass = getIconAndNumberColor(area, numero);

  return (
    <div 
      onClick={onClick} 
      className={`border rounded-xl p-6 cursor-pointer transition-all duration-300 group py-[14px] px-[20px] ${cardColorClass}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div className="p-3 bg-black/10 rounded-lg group-hover:bg-black/20 transition-colors">
            <BookOpen className={`h-6 w-6 ${iconColorClass}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`font-semibold text-sm ${iconColorClass}`}>
                Módulo {numero}
              </span>
              {sequenceNumber && totalCount && (
                <span className="text-xs text-gray-500">
                  ({sequenceNumber}/{totalCount})
                </span>
              )}
            </div>
            <h3 className="font-semibold text-netflix-lightGray mb-2 line-clamp-2 text-base group-hover:text-white">
              {nome}
            </h3>
            <div className="space-y-1">
              <p className="text-gray-400 text-sm">
                {temasCount} tema{temasCount !== 1 ? 's' : ''}
              </p>
              {assuntosCount > 0 && (
                <p className="text-gray-500 text-xs">
                  {assuntosCount} assunto{assuntosCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
      </div>
    </div>
  );
};

export default ModuloCard;
