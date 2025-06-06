
import React from 'react';
import { Scale, Gavel, BookOpen, TrendingUp, Users, Award } from 'lucide-react';
import { useResumos } from '../hooks/useResumos';

const JuridicalLogo: React.FC = () => {
  const {
    resumos,
    getAreas
  } = useResumos();
  
  const areas = getAreas();
  const totalResumos = resumos.length;
  const totalAreas = areas.length;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <Scale className="h-8 w-8 text-netflix-red" />
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-netflix-lightGray">LegalStudy</h1>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span>{totalAreas} áreas</span>
            <span>{totalResumos} resumos</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JuridicalLogo;
