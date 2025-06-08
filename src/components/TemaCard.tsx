
import React from 'react';
import { ChevronRight, Scale, Gavel, BookOpen, FileText, Calculator, Shield, Users, Building } from 'lucide-react';

interface TemaCardProps {
  tema: string;
  assuntosCount: number;
  onClick: () => void;
  sequenceNumber?: number;
  totalCount?: number;
  area?: string;
  modulo?: string;
}

const TemaCard: React.FC<TemaCardProps> = ({
  tema,
  assuntosCount,
  onClick,
  sequenceNumber,
  totalCount,
  area = '',
  modulo = ''
}) => {
  const getTemaIcon = (temaNome: string) => {
    const lowerTema = temaNome.toLowerCase();
    if (lowerTema.includes('personalidade') || lowerTema.includes('pessoa')) return Users;
    if (lowerTema.includes('crimes') || lowerTema.includes('penal')) return Gavel;
    if (lowerTema.includes('fundamental') || lowerTema.includes('garantias')) return Shield;
    if (lowerTema.includes('obrigações') || lowerTema.includes('contratos')) return FileText;
    if (lowerTema.includes('procedimentos') || lowerTema.includes('processual')) return Scale;
    if (lowerTema.includes('tributos') || lowerTema.includes('tributário')) return Calculator;
    if (lowerTema.includes('empresa') || lowerTema.includes('comercial')) return Building;
    return BookOpen;
  };

  // Use the same color logic as ModuloCard (based on area + module number)
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

  const getIconColor = (area: string, numero: string) => {
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

  const TemaIcon = getTemaIcon(tema);
  const cardColorClass = getCardColor(area, modulo);
  const iconColorClass = getIconColor(area, modulo);

  return (
    <button 
      onClick={onClick} 
      className={`w-full p-5 border transition-all duration-300 text-left group px-[16px] py-[5px] rounded-xl ${cardColorClass}`}
    >
      <div className="flex items-center justify-between px-0 py-[15px]">
        <div className="flex items-center gap-3 flex-1">
          <div className="p-2 bg-black/10 rounded-md group-hover:bg-black/20 transition-colors">
            <TemaIcon className={`h-5 w-5 ${iconColorClass}`} />
          </div>
          <div className="flex-1">
            <h4 className="text-base font-medium text-netflix-lightGray mb-1 group-hover:text-white">
              {tema}
            </h4>
            <div className="flex items-center gap-2">
              <p className="text-gray-400 text-sm">
                {assuntosCount} assunto{assuntosCount !== 1 ? 's' : ''}
              </p>
              {sequenceNumber && totalCount && (
                <span className="text-xs text-gray-500">
                  • {sequenceNumber}/{totalCount}
                </span>
              )}
            </div>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
      </div>
    </button>
  );
};

export default TemaCard;
