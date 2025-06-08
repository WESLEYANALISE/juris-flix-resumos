
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
    <button
      onClick={onClick}
      className="w-full p-6 bg-netflix-darkGray border border-netflix-gray rounded-xl hover:border-opacity-50 hover:scale-105 transition-all duration-300 text-left group relative overflow-hidden animate-fade-in"
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
      
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div 
            className="p-3 rounded-lg group-hover:scale-110 transition-all duration-300 relative"
            style={{ backgroundColor: `${colors.primary}15` }}
          >
            <BookOpen 
              className="h-6 w-6 transition-colors duration-300" 
              style={{ color: colors.primary }}
            />
            <div 
              className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"
              style={{ backgroundColor: colors.primary }}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span 
                className="font-semibold text-sm transition-colors duration-300"
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
              <div 
                className="inline-flex px-3 py-1 rounded-full text-sm font-medium transition-all duration-300"
                style={{ 
                  backgroundColor: `${colors.primary}20`,
                  color: colors.primary
                }}
              >
                {temasCount} tema{temasCount !== 1 ? 's' : ''}
              </div>
              {assuntosCount > 0 && (
                <p className="text-gray-500 text-xs mt-1">
                  {assuntosCount} assunto{assuntosCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
        </div>
        <ChevronRight 
          className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-all duration-300 group-hover:text-white" 
        />
      </div>

      {/* Decorative elements */}
      <div 
        className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-5 group-hover:opacity-10 transition-opacity duration-300"
        style={{ backgroundColor: colors.primary, transform: 'translate(50%, -50%)' }}
      />
      <div 
        className="absolute bottom-0 left-0 w-14 h-14 rounded-full opacity-5 group-hover:opacity-10 transition-opacity duration-300"
        style={{ backgroundColor: colors.secondary, transform: 'translate(-50%, 50%)' }}
      />
    </button>
  );
};

export default ModuloCard;
