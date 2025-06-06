
import React from 'react';
import { ChevronRight, Scale, Gavel, BookOpen, FileText, Calculator, Shield, Users } from 'lucide-react';
import { getAreaColors } from '../utils/areaColors';

interface AreaCardProps {
  area: string;
  resumosCount: number;
  onClick: () => void;
}

const AreaCard: React.FC<AreaCardProps> = ({ area, resumosCount, onClick }) => {
  const getAreaIcon = (areaName: string) => {
    const lowerArea = areaName.toLowerCase();
    
    if (lowerArea.includes('civil')) return Scale;
    if (lowerArea.includes('penal') || lowerArea.includes('criminal')) return Gavel;
    if (lowerArea.includes('constitucional')) return BookOpen;
    if (lowerArea.includes('processual')) return FileText;
    if (lowerArea.includes('tributário') || lowerArea.includes('fiscal')) return Calculator;
    if (lowerArea.includes('trabalhista')) return Users;
    if (lowerArea.includes('fundamental') || lowerArea.includes('direitos')) return Shield;
    
    return Scale; // Default icon
  };

  const AreaIcon = getAreaIcon(area);
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
      
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div 
            className="p-4 rounded-xl group-hover:scale-110 transition-all duration-300 relative"
            style={{ backgroundColor: `${colors.primary}15` }}
          >
            <AreaIcon 
              className="h-7 w-7 transition-colors duration-300" 
              style={{ color: colors.primary }}
            />
            <div 
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"
              style={{ backgroundColor: colors.primary }}
            />
          </div>
          <div>
            <h3 className="text-xl font-bold text-netflix-lightGray mb-2 group-hover:text-white transition-colors duration-300">
              {area}
            </h3>
            <div className="flex items-center gap-2">
              <div 
                className="px-3 py-1 rounded-full text-sm font-medium transition-all duration-300"
                style={{ 
                  backgroundColor: `${colors.primary}20`,
                  color: colors.primary
                }}
              >
                {resumosCount} resumos
              </div>
              <div className="text-gray-400 text-sm">
                disponíveis
              </div>
            </div>
          </div>
        </div>
        <ChevronRight 
          className="h-6 w-6 text-gray-400 group-hover:translate-x-1 transition-all duration-300" 
          style={{ '--hover-color': colors.primary } as React.CSSProperties}
        />
      </div>

      {/* Decorative elements */}
      <div 
        className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-5 group-hover:opacity-10 transition-opacity duration-300"
        style={{ backgroundColor: colors.primary, transform: 'translate(50%, -50%)' }}
      />
      <div 
        className="absolute bottom-0 left-0 w-16 h-16 rounded-full opacity-5 group-hover:opacity-10 transition-opacity duration-300"
        style={{ backgroundColor: colors.secondary, transform: 'translate(-50%, 50%)' }}
      />
    </button>
  );
};

export default AreaCard;
