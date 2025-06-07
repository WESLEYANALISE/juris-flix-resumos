
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import JuridicalLogo from '@/components/JuridicalLogo';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-netflix-black flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <JuridicalLogo className="h-16 mx-auto mb-8" />
        
        <h1 className="text-6xl font-bold text-netflix-red mb-4">404</h1>
        
        <h2 className="text-2xl font-bold text-netflix-lightGray mb-4">
          Página não encontrada
        </h2>
        
        <p className="text-gray-400 mb-8 leading-relaxed">
          A página que você está procurando não existe ou foi movida para outro local.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-netflix-darkGray border border-netflix-gray text-netflix-lightGray hover:border-netflix-red hover:text-netflix-red rounded-lg transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-netflix-red hover:bg-netflix-darkRed text-white rounded-lg font-medium transition-colors"
          >
            <Home className="h-4 w-4" />
            Ir para o início
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
