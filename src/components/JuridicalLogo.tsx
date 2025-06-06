
import React from 'react';
import { Scale, Gavel, BookOpen, TrendingUp, Users, Award } from 'lucide-react';
import { useResumos } from '../hooks/useResumos';

const JuridicalLogo: React.FC = () => {
  const { resumos, getAreas } = useResumos();
  const areas = getAreas();
  const totalResumos = resumos.length;
  const totalAreas = areas.length;

  return (
    <div className="text-center mb-12 animate-fade-in">
      {/* Logo Section */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="relative">
          <div className="flex items-center gap-2 p-4 bg-gradient-to-br from-netflix-red/20 to-netflix-red/10 rounded-2xl border border-netflix-red/30 backdrop-blur-sm">
            <Scale className="h-8 w-8 text-netflix-red animate-pulse" />
            <Gavel className="h-7 w-7 text-netflix-red" />
            <BookOpen className="h-8 w-8 text-netflix-red" />
          </div>
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-netflix-red rounded-full animate-pulse">
            <div className="absolute inset-0 bg-netflix-red rounded-full animate-ping opacity-75"></div>
          </div>
        </div>
        
        <div className="text-left">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-netflix-red to-netflix-darkRed bg-clip-text text-transparent">
            JurídicoPro
          </h1>
          <p className="text-xl text-gray-400 mt-1">
            Seu guia completo para o mundo do Direito
          </p>
        </div>
      </div>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
        <div className="bg-netflix-darkGray/50 backdrop-blur-sm border border-netflix-gray/50 rounded-xl p-4 hover:border-netflix-red/50 transition-all duration-300 group">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
              <BookOpen className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{totalResumos.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Resumos Disponíveis</div>
            </div>
          </div>
        </div>

        <div className="bg-netflix-darkGray/50 backdrop-blur-sm border border-netflix-gray/50 rounded-xl p-4 hover:border-netflix-red/50 transition-all duration-300 group">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
              <TrendingUp className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{totalAreas}</div>
              <div className="text-sm text-gray-400">Áreas do Direito</div>
            </div>
          </div>
        </div>

        <div className="bg-netflix-darkGray/50 backdrop-blur-sm border border-netflix-gray/50 rounded-xl p-4 hover:border-netflix-red/50 transition-all duration-300 group">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
              <Award className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">100%</div>
              <div className="text-sm text-gray-400">Gratuito</div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-netflix-gray rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-netflix-red to-netflix-darkRed transition-all duration-1000 ease-out"
            style={{ width: '100%' }}
          >
            <div className="h-full bg-white/20 animate-pulse"></div>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Plataforma completa e atualizada
        </p>
      </div>
    </div>
  );
};

export default JuridicalLogo;
