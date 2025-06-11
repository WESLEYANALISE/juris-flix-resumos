
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
      className="w-full p-5 border transition-all duration-300 text-left group px-[16px] py-[5px] rounded-xl hover:scale-105 hover:shadow-lg"
      style={{ 
        backgroundColor: `${colors.primary}10`,
        borderColor: `${colors.primary}30`
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = colors.primary;
        e.currentTarget.style.boxShadow = `0 8px 25px ${colors.primary}20`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = `${colors.primary}30`;
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div className="flex items-center justify-between px-0 py-[15px]">
        <div className="flex items-center gap-3 flex-1">
          <div 
            className="p-2 rounded-md group-hover:scale-110 transition-all duration-300"
            style={{ backgroundColor: `${colors.primary}20` }}
          >
            <TemaIcon 
              className="h-5 w-5 transition-colors duration-300" 
              style={{ color: colors.primary }}
            />
          </div>
          <div className="flex-1">
            <h4 className="text-base font-medium text-netflix-lightGray mb-1 group-hover:text-white transition-colors duration-300">
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
        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
      </div>
    </button>
  );
};

export default TemaCard;
