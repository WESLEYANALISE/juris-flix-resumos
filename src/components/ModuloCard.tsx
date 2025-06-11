
import React from 'react';
import { BookOpen, ChevronRight } from 'lucide-react';
import { getAreaColors } from '../utils/areaColors';

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
  const colors = getAreaColors(area);

  return (
    <div 
      onClick={onClick} 
      className="border rounded-xl p-6 cursor-pointer transition-all duration-300 group py-[14px] px-[20px] hover:scale-105 hover:shadow-lg"
      style={{ 
        backgroundColor: `${colors.primary}10`,
        borderColor: `${colors.primary}30`
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = colors.primary;
        e.currentTarget.style.boxShadow = `0 10px 30px ${colors.primary}20`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = `${colors.primary}30`;
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div 
            className="p-3 rounded-lg group-hover:scale-110 transition-all duration-300"
            style={{ backgroundColor: `${colors.primary}20` }}
          >
            <BookOpen 
              className="h-6 w-6 transition-colors duration-300" 
              style={{ color: colors.primary }}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span 
                className="font-semibold text-sm"
                style={{ color: colors.primary }}
              >
                Módulo {numero}
              </span>
              {sequenceNumber && totalCount && (
                <span className="text-xs text-gray-500">
                  ({sequenceNumber}/{totalCount})
                </span>
              )}
            </div>
            <h3 className="font-semibold text-netflix-lightGray mb-2 line-clamp-2 text-base group-hover:text-white transition-colors duration-300">
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
        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
      </div>
    </div>
  );
};

export default ModuloCard;
