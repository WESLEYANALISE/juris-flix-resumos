
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

  // Generate color based on area and module
  const getCardColor = (area: string, modulo: string, tema: string) => {
    const combinedText = area + modulo + tema;
    const hash = combinedText.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    
    const colors = [
      'bg-emerald-500/20 border-emerald-500/40 hover:border-emerald-400',
      'bg-violet-500/20 border-violet-500/40 hover:border-violet-400',
      'bg-amber-500/20 border-amber-500/40 hover:border-amber-400',
      'bg-rose-500/20 border-rose-500/40 hover:border-rose-400',
      'bg-sky-500/20 border-sky-500/40 hover:border-sky-400',
      'bg-lime-500/20 border-lime-500/40 hover:border-lime-400',
      'bg-fuchsia-500/20 border-fuchsia-500/40 hover:border-fuchsia-400',
      'bg-slate-500/20 border-slate-500/40 hover:border-slate-400',
    ];
    
    return colors[hash % colors.length];
  };

  const getIconColor = (area: string, modulo: string, tema: string) => {
    const combinedText = area + modulo + tema;
    const hash = combinedText.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    
    const colors = [
      'text-emerald-400',
      'text-violet-400',
      'text-amber-400',
      'text-rose-400',
      'text-sky-400',
      'text-lime-400',
      'text-fuchsia-400',
      'text-slate-400',
    ];
    
    return colors[hash % colors.length];
  };

  const TemaIcon = getTemaIcon(tema);
  const cardColorClass = getCardColor(area, modulo, tema);
  const iconColorClass = getIconColor(area, modulo, tema);

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
