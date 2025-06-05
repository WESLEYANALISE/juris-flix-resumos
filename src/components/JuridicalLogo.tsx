
import React from 'react';
import { Scale, Gavel, BookOpen } from 'lucide-react';

const JuridicalLogo: React.FC = () => {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="relative">
        <div className="flex items-center gap-1 p-3 bg-netflix-red/10 rounded-xl border border-netflix-red/20">
          <Scale className="h-8 w-8 text-netflix-red" />
          <Gavel className="h-6 w-6 text-netflix-red" />
          <BookOpen className="h-7 w-7 text-netflix-red" />
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-netflix-red rounded-full animate-pulse"></div>
      </div>
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-netflix-lightGray">
          Resumos Jurídicos
        </h1>
        <p className="text-xl text-gray-400 mt-1">
          Seu guia completo para o mundo do Direito
        </p>
      </div>
    </div>
  );
};

export default JuridicalLogo;
