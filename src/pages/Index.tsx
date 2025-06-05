
import { useState } from 'react';
import { Search } from 'lucide-react';
import { useResumos } from '../hooks/useResumos';
import AreaCard from '../components/AreaCard';
import TemaCard from '../components/TemaCard';
import AssuntoCard from '../components/AssuntoCard';
import ResumoViewer from '../components/ResumoViewer';
import { Input } from '@/components/ui/input';

type ViewState = 
  | { type: 'areas' }
  | { type: 'temas'; area: string }
  | { type: 'assuntos'; area: string; tema: string }
  | { type: 'resumo'; area: string; tema: string; assunto: string; resumo: string };

const Index = () => {
  const [viewState, setViewState] = useState<ViewState>({ type: 'areas' });
  const [searchTerm, setSearchTerm] = useState('');
  const { loading, error, getAreas, getTemasByArea, getAssuntosByTema } = useResumos();

  if (loading) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-netflix-red mx-auto mb-4"></div>
          <p className="text-netflix-lightGray">Carregando resumos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-netflix-red mb-4">Erro ao carregar dados</p>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (viewState.type) {
      case 'areas':
        const areas = getAreas().filter(({ area }) =>
          area.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {areas.map(({ area, temasCount }) => (
              <AreaCard
                key={area}
                area={area}
                temasCount={temasCount}
                onClick={() => setViewState({ type: 'temas', area })}
              />
            ))}
          </div>
        );

      case 'temas':
        const temas = getTemasByArea(viewState.area).filter(({ tema }) =>
          tema.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        return (
          <div>
            <button
              onClick={() => setViewState({ type: 'areas' })}
              className="text-netflix-red hover:text-netflix-darkRed mb-6 transition-colors"
            >
              ← Voltar para áreas
            </button>
            <h2 className="text-2xl font-bold text-netflix-lightGray mb-6">
              {viewState.area}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {temas.map(({ tema, assuntosCount }) => (
                <TemaCard
                  key={tema}
                  tema={tema}
                  assuntosCount={assuntosCount}
                  onClick={() => setViewState({ type: 'assuntos', area: viewState.area, tema })}
                />
              ))}
            </div>
          </div>
        );

      case 'assuntos':
        const assuntos = getAssuntosByTema(viewState.area, viewState.tema).filter(({ assunto }) =>
          assunto.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        return (
          <div>
            <button
              onClick={() => setViewState({ type: 'temas', area: viewState.area })}
              className="text-netflix-red hover:text-netflix-darkRed mb-6 transition-colors"
            >
              ← Voltar para temas
            </button>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-netflix-lightGray">
                {viewState.tema}
              </h2>
              <p className="text-gray-400">{viewState.area}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assuntos.map(({ id, assunto, resumo }) => (
                <AssuntoCard
                  key={id}
                  assunto={assunto}
                  onClick={() => setViewState({ 
                    type: 'resumo', 
                    area: viewState.area, 
                    tema: viewState.tema, 
                    assunto, 
                    resumo 
                  })}
                />
              ))}
            </div>
          </div>
        );

      case 'resumo':
        return (
          <ResumoViewer
            area={viewState.area}
            tema={viewState.tema}
            assunto={viewState.assunto}
            resumo={viewState.resumo}
            onBack={() => setViewState({ 
              type: 'assuntos', 
              area: viewState.area, 
              tema: viewState.tema 
            })}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-netflix-black">
      {viewState.type !== 'resumo' && (
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-netflix-lightGray mb-4">
              Resumos Jurídicos
            </h1>
            <p className="text-xl text-gray-400">
              Seu guia completo para o mundo do Direito
            </p>
          </header>

          {(viewState.type === 'areas' || viewState.type === 'temas' || viewState.type === 'assuntos') && (
            <div className="relative w-full max-w-2xl mx-auto mb-8">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-netflix-lightGray h-5 w-5" />
              <Input
                type="text"
                placeholder="Pesquisar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 w-full bg-netflix-darkGray border-netflix-gray text-netflix-lightGray placeholder-gray-400 focus:border-netflix-red focus:ring-netflix-red rounded-lg text-lg"
              />
            </div>
          )}

          <main>
            {renderContent()}
          </main>
        </div>
      )}

      {viewState.type === 'resumo' && renderContent()}
    </div>
  );
};

export default Index;
