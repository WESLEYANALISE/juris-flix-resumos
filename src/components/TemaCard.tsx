
import React from 'react';
import { ChevronRight, Scale, Gavel, BookOpen, FileText, Calculator, Shield, Users, Building } from 'lucide-react';
import { getAreaColors } from '../utils/areaColors';

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

  const TemaIcon = getTemaIcon(tema);
  const colors = getAreaColors(area);

  return (
    <button
      onClick={onClick}
      className="w-full p-5 bg-netflix-darkGray border border-netflix-gray rounded-xl hover:border-opacity-50 hover:scale-105 transition-all duration-300 text-left group relative overflow-hidden animate-fade-in px-[16px] py-[5px]"
      style={{ 
        '--hover-border-color': colors.primary,
        borderColor: 'var(--hover-border-color)'
      } as React.CSSProperties}
    >
      {/* Background gradient on hover */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
        style={{ 
          background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}10)`
        }}
      />
      
      <div className="relative z-10 flex items-center justify-between px-0 py-[15px]">
        <div className="flex items-center gap-3 flex-1">
          <div 
            className="p-2 rounded-md group-hover:scale-110 transition-all duration-300 relative"
            style={{ backgroundColor: `${colors.primary}15` }}
          >
            <TemaIcon 
              className="h-5 w-5 transition-colors duration-300" 
              style={{ color: colors.primary }}
            />
            <div 
              className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-20 transition-opacity duration-300"
              style={{ backgroundColor: colors.primary }}
            />
          </div>
          <div className="flex-1">
            <h4 className="text-base font-medium text-netflix-lightGray mb-1 group-hover:text-white transition-colors duration-300">
              {tema}
            </h4>
            <div className="flex items-center gap-2">
              <div 
                className="inline-flex px-2 py-1 rounded-full text-sm font-medium transition-all duration-300"
                style={{ 
                  backgroundColor: `${colors.primary}20`,
                  color: colors.primary
                }}
              >
                {assuntosCount} assunto{assuntosCount !== 1 ? 's' : ''}
              </div>
              {sequenceNumber && totalCount && (
                <span className="text-xs text-gray-500">
                  • Tema {sequenceNumber} de {totalCount}
                </span>
              )}
            </div>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
      </div>

      {/* Decorative elements */}
      <div 
        className="absolute top-0 right-0 w-16 h-16 rounded-full opacity-5 group-hover:opacity-10 transition-opacity duration-300"
        style={{ backgroundColor: colors.primary, transform: 'translate(50%, -50%)' }}
      />
      <div 
        className="absolute bottom-0 left-0 w-12 h-12 rounded-full opacity-5 group-hover:opacity-10 transition-opacity duration-300"
        style={{ backgroundColor: colors.secondary, transform: 'translate(-50%, 50%)' }}
      />
    </button>
  );
};

export default TemaCard;
