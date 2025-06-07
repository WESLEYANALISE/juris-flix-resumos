
import React from 'react';
import { ChevronRight, Scale, Gavel, BookOpen, FileText, Calculator, Shield, Users, Building } from 'lucide-react';

interface TemaCardProps {
  tema: string;
  assuntosCount: number;
  onClick: () => void;
}

const TemaCard: React.FC<TemaCardProps> = ({
  tema,
  assuntosCount,
  onClick
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

  return (
    <button 
      onClick={onClick} 
      className="w-full p-5 bg-netflix-darkGray border border-netflix-gray rounded-lg hover:border-netflix-red hover:bg-netflix-gray transition-all duration-300 text-left group px-[16px] py-[5px]"
    >
      <div className="flex items-center justify-between px-0 py-[15px]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-netflix-red/10 rounded-md group-hover:bg-netflix-red/20 transition-colors">
            <TemaIcon className="h-5 w-5 text-netflix-red" />
          </div>
          <div>
            <h4 className="text-base font-medium text-netflix-lightGray mb-1 group-hover:text-white">
              {tema}
            </h4>
            <p className="text-gray-400 text-sm">
              {assuntosCount} assunto{assuntosCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-netflix-red transition-colors" />
      </div>
    </button>
  );
};

export default TemaCard;
