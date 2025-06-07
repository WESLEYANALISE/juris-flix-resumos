import { useState } from 'react';
import { useResumos } from '../hooks/useResumos';
import AreaCard from '../components/AreaCard';
import ModuloCard from '../components/ModuloCard';
import TemaCard from '../components/TemaCard';
import AssuntoCard from '../components/AssuntoCard';
import ResumoViewer from '../components/ResumoViewer';
import Navigation from '../components/Navigation';
import FavoritesList from '../components/FavoritesList';
import RecentsList from '../components/RecentsList';
import SearchWithPreview from '../components/SearchWithPreview';
import JuridicalLogo from '../components/JuridicalLogo';

type ViewState = {
  type: 'areas';
} | {
  type: 'modulos';
  area: string;
} | {
  type: 'temas';
  area: string;
  numeroModulo: string;
  nomeModulo: string;
} | {
  type: 'assuntos';
  area: string;
  numeroModulo: string;
  nomeModulo: string;
  numeroTema: string;
  nomeTema: string;
} | {
  type: 'resumo';
  area: string;
  numeroModulo: string;
  nomeModulo: string;
  numeroTema: string;
  nomeTema: string;
  assunto: string;
  resumo: string;
  glossario: string;
  exemplo: string;
  assuntoId: number;
};

type ActiveTab = 'home' | 'favorites' | 'recent';

const Index = () => {
  const [viewState, setViewState] = useState<ViewState>({
    type: 'areas'
  });
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [searchTerm, setSearchTerm] = useState('');

  const {
    loading,
    error,
    favorites,
    recents,
    isAuthenticated,
    getAreas,
    getModulosByArea,
    getTemasByModulo,
    getAssuntosByTema,
    addToFavorites,
    removeFromFavorites,
    isFavorite
  } = useResumos();

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

  const handleSubjectClick = (area: string, modulo: string, tema: string, assunto: string, assuntoId: number) => {
    const assuntos = getAssuntosByTema(area, modulo.split('-')[0], tema.split('-')[0]);
    const assuntoData = assuntos.find(a => a.id === assuntoId);
    
    if (assuntoData) {
      setViewState({
        type: 'resumo',
        area,
        numeroModulo: modulo.split('-')[0],
        nomeModulo: modulo.split('-').slice(1).join('-'),
        numeroTema: tema.split('-')[0],
        nomeTema: tema.split('-').slice(1).join('-'),
        assunto: assuntoData.titulo,
        resumo: assuntoData.texto,
        glossario: assuntoData.glossario,
        exemplo: assuntoData.exemplo || '',
        assuntoId: assuntoData.id
      });
      setActiveTab('home');
    }
  };

  const handleSearchResultClick = (result: any) => {
    const { path } = result;
    
    if (path.assunto) {
      const assuntos = getAssuntosByTema(path.area, path.modulo.split('-')[0], path.tema.split('-')[0]);
      const assuntoData = assuntos.find(a => a.titulo === path.assunto);
      
      if (assuntoData) {
        setViewState({
          type: 'resumo',
          area: path.area,
          numeroModulo: path.modulo.split('-')[0],
          nomeModulo: path.modulo.split('-').slice(1).join('-'),
          numeroTema: path.tema.split('-')[0],
          nomeTema: path.tema.split('-').slice(1).join('-'),
          assunto: assuntoData.titulo,
          resumo: assuntoData.texto,
          glossario: assuntoData.glossario,
          exemplo: assuntoData.exemplo || '',
          assuntoId: assuntoData.id
        });
      }
    } else if (path.tema) {
      setViewState({
        type: 'assuntos',
        area: path.area,
        numeroModulo: path.modulo.split('-')[0],
        nomeModulo: path.modulo.split('-').slice(1).join('-'),
        numeroTema: path.tema.split('-')[0],
        nomeTema: path.tema.split('-').slice(1).join('-')
      });
    } else if (path.modulo) {
      setViewState({
        type: 'temas',
        area: path.area,
        numeroModulo: path.modulo.split('-')[0],
        nomeModulo: path.modulo.split('-').slice(1).join('-')
      });
    } else {
      setViewState({
        type: 'modulos',
        area: path.area
      });
    }
    
    setActiveTab('home');
    setSearchTerm('');
  };

  const handleToggleFavorite = (area: string, modulo: string, tema: string, assunto: string, assuntoId: number) => {
    if (!isAuthenticated) {
      alert('Você precisa estar logado para favoritar resumos.');
      return;
    }

    if (isFavorite(assuntoId)) {
      removeFromFavorites(assuntoId);
    } else {
      addToFavorites(area, modulo, tema, assunto, assuntoId);
    }
  };

  const showHeader = viewState.type === 'areas' && activeTab === 'home';
  const showNavigation = viewState.type !== 'resumo';

  const renderContent = () => {
    if (activeTab === 'favorites') {
      return (
        <FavoritesList 
          favorites={favorites} 
          onSubjectClick={handleSubjectClick}
          isAuthenticated={isAuthenticated}
        />
      );
    }

    if (activeTab === 'recent') {
      return (
        <RecentsList 
          recents={recents} 
          onSubjectClick={handleSubjectClick}
          isAuthenticated={isAuthenticated}
        />
      );
    }

    switch (viewState.type) {
      case 'areas':
        const areas = getAreas().filter(({ area }) => 
          area && area.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        return (
          <div className="space-y-6">
            <div className="text-center py-8">
              <h1 className="text-4xl font-bold text-netflix-lightGray mb-2">
                Resumos Jurídicos
              </h1>
              <p className="text-gray-400">
                Selecione uma área do direito para começar
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {areas.map(({ area, resumosCount }) => (
                <AreaCard 
                  key={area} 
                  area={area} 
                  resumosCount={resumosCount} 
                  onClick={() => setViewState({ type: 'modulos', area })} 
                />
              ))}
            </div>
          </div>
        );

      case 'modulos':
        const modulos = getModulosByArea(viewState.area).filter(({ nome }) => 
          nome && nome.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        return (
          <div className="space-y-6">
            <button 
              onClick={() => setViewState({ type: 'areas' })} 
              className="text-netflix-red hover:text-netflix-darkRed transition-colors font-medium"
            >
              ← Voltar para áreas
            </button>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-netflix-lightGray break-words">{viewState.area}</h2>
              <p className="text-gray-400">Selecione um módulo para continuar</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {modulos.map(({ numero, nome, temasCount, assuntosCount }) => (
                <ModuloCard 
                  key={`${numero}-${nome}`} 
                  numero={numero} 
                  nome={nome} 
                  temasCount={temasCount}
                  assuntosCount={assuntosCount}
                  onClick={() => setViewState({
                    type: 'temas',
                    area: viewState.area,
                    numeroModulo: numero,
                    nomeModulo: nome
                  })} 
                />
              ))}
            </div>
          </div>
        );

      case 'temas':
        const temas = getTemasByModulo(viewState.area, viewState.numeroModulo).filter(({ nome }) => 
          nome && nome.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        return (
          <div className="space-y-6">
            <button 
              onClick={() => setViewState({
                type: 'modulos',
                area: viewState.area
              })} 
              className="text-netflix-red hover:text-netflix-darkRed transition-colors font-medium"
            >
              ← Voltar para módulos
            </button>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-netflix-lightGray break-words">{viewState.nomeModulo}</h2>
              <p className="text-gray-400 break-words">{viewState.area}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {temas.map(({ numero, nome, assuntosCount }) => (
                <TemaCard 
                  key={`${numero}-${nome}`} 
                  tema={nome} 
                  assuntosCount={assuntosCount} 
                  onClick={() => setViewState({
                    type: 'assuntos',
                    area: viewState.area,
                    numeroModulo: viewState.numeroModulo,
                    nomeModulo: viewState.nomeModulo,
                    numeroTema: numero,
                    nomeTema: nome
                  })} 
                />
              ))}
            </div>
          </div>
        );

      case 'assuntos':
        const assuntos = getAssuntosByTema(viewState.area, viewState.numeroModulo, viewState.numeroTema).filter(({ titulo }) => 
          titulo && titulo.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        return (
          <div className="space-y-6">
            <button 
              onClick={() => setViewState({
                type: 'temas',
                area: viewState.area,
                numeroModulo: viewState.numeroModulo,
                nomeModulo: viewState.nomeModulo
              })} 
              className="text-netflix-red hover:text-netflix-darkRed transition-colors font-medium"
            >
              ← Voltar para temas
            </button>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-netflix-lightGray break-words">{viewState.nomeTema}</h2>
              <p className="text-gray-400 break-words">{viewState.area} › {viewState.nomeModulo}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {assuntos.map(({ id, titulo }) => (
                <AssuntoCard 
                  key={id} 
                  assunto={titulo} 
                  assuntoId={id} 
                  area={viewState.area} 
                  modulo={viewState.nomeModulo} 
                  tema={viewState.nomeTema} 
                  isFavorited={isFavorite(id)} 
                  onToggleFavorite={() => handleToggleFavorite(viewState.area, viewState.nomeModulo, viewState.nomeTema, titulo, id)} 
                  onClick={() => {
                    const assuntoData = getAssuntosByTema(viewState.area, viewState.numeroModulo, viewState.numeroTema).find(a => a.id === id);
                    if (assuntoData) {
                      setViewState({
                        type: 'resumo',
                        area: viewState.area,
                        numeroModulo: viewState.numeroModulo,
                        nomeModulo: viewState.nomeModulo,
                        numeroTema: viewState.numeroTema,
                        nomeTema: viewState.nomeTema,
                        assunto: assuntoData.titulo,
                        resumo: assuntoData.texto,
                        glossario: assuntoData.glossario,
                        exemplo: assuntoData.exemplo || '',
                        assuntoId: assuntoData.id
                      });
                    }
                  }} 
                />
              ))}
            </div>
          </div>
        );

      case 'resumo':
        return (
          <ResumoViewer 
            area={viewState.area} 
            modulo={viewState.nomeModulo} 
            tema={viewState.nomeTema} 
            assunto={viewState.assunto} 
            resumo={viewState.resumo} 
            glossario={viewState.glossario}
            exemplo={viewState.exemplo}
            assuntoId={viewState.assuntoId} 
            onBack={() => setViewState({
              type: 'assuntos',
              area: viewState.area,
              numeroModulo: viewState.numeroModulo,
              nomeModulo: viewState.nomeModulo,
              numeroTema: viewState.numeroTema,
              nomeTema: viewState.nomeTema
            })} 
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-netflix-black">
      {showNavigation && (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {showHeader && (
            <header className="mb-8">
              <JuridicalLogo />
            </header>
          )}

          <Navigation 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />

          {activeTab === 'home' && (
            <SearchWithPreview 
              searchTerm={searchTerm} 
              onSearchChange={setSearchTerm} 
              onResultClick={handleSearchResultClick} 
            />
          )}

          <main>{renderContent()}</main>
        </div>
      )}

      {viewState.type === 'resumo' && renderContent()}
    </div>
  );
};

export default Index;
