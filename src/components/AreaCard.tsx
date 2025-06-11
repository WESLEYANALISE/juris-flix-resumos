
import React from 'react';
import { ChevronRight, Scale, Gavel, BookOpen, FileText, Calculator, Shield, Users, Building, Briefcase, Leaf, ShoppingCart, Globe, Heart, DollarSign } from 'lucide-react';
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
    if (lowerArea.includes('administrativo')) return Building;
    if (lowerArea.includes('empresarial') || lowerArea.includes('comercial')) return Briefcase;
    if (lowerArea.includes('ambiental')) return Leaf;
    if (lowerArea.includes('consumidor')) return ShoppingCart;
    if (lowerArea.includes('internacional')) return Globe;
    if (lowerArea.includes('família') || lowerArea.includes('sucessões')) return Heart;
    if (lowerArea.includes('financeiro') || lowerArea.includes('bancário')) return DollarSign;
    
    return Scale; // Default icon
  };

  const AreaIcon = getAreaIcon(area);
  const colors = getAreaColors(area);

  return (
    <button
      onClick={onClick}
      className="w-full p-5 border transition-all duration-300 text-left group px-[16px] py-[20px] rounded-xl hover:scale-105 hover:shadow-lg"
      style={{ 
        backgroundColor: `${colors.primary}15`,
        borderColor: `${colors.primary}30`,
        '--hover-border-color': colors.primary
      } as React.CSSProperties}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = colors.primary;
        e.currentTarget.style.boxShadow = `0 10px 30px ${colors.primary}25`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = `${colors.primary}30`;
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div 
            className="p-3 rounded-lg group-hover:scale-110 transition-all duration-300"
            style={{ backgroundColor: `${colors.primary}20` }}
          >
            <AreaIcon 
              className="h-6 w-6 transition-colors duration-300" 
              style={{ color: colors.primary }}
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-netflix-lightGray mb-1 group-hover:text-white transition-colors duration-300">
              {area}
            </h3>
            <p className="text-gray-400 text-sm">
              {resumosCount} resumo{resumosCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <ChevronRight 
          className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors duration-300" 
        />
      </div>
    </button>
  );
};

export default AreaCard;
