import { useState } from 'react';
import { useResumosOptimized } from '../hooks/useResumosOptimized';
import AreaCard from '../components/AreaCard';
import ModuloCard from '../components/ModuloCard';
import TemaCard from '../components/TemaCard';
import AssuntoCard from '../components/AssuntoCard';
import ResumoViewer from '../components/ResumoViewer';
import AdvancedNavigation from '../components/AdvancedNavigation';
import ImprovedFavoritesList from '../components/ImprovedFavoritesList';
import RecentsList from '../components/RecentsList';
import PopularContent from '../components/PopularContent';
import SearchWithPreview from '../components/SearchWithPreview';
import AdvancedFilters, { FilterState } from '../components/AdvancedFilters';
import JuridicalLogo from '../components/JuridicalLogo';
import LoadingSpinner from '../components/ui/loading-spinner';
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
  mapaMental: string;
  assuntoId: number;
};
type ActiveTab = 'home' | 'favorites' | 'recent' | 'trending';
const Index = () => {
  const [viewState, setViewState] = useState<ViewState>({
    type: 'areas'
  });
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    selectedAreas: [],
    selectedModulos: [],
    selectedTemas: [],
    searchTerm: '',
    sortBy: 'title',
    sortOrder: 'asc'
  });
  const {
    loading,
    error,
    favorites,
    recents,
    getAreas,
    getModulosByArea,
    getTemasByModulo,
    getAssuntosByTema,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    resumos,
    searchInContent
  } = useResumosOptimized();
  if (loading) {
    return <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-netflix-lightGray animate-pulse">Carregando resumos otimizados...</p>
        </div>
      </div>;
  }
  if (error) {
    return <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-netflix-red mb-4">Erro ao carregar dados</p>
          <p className="text-gray-400">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-netflix-red text-white rounded hover:bg-netflix-darkRed transition-colors">
            Tentar novamente
          </button>
        </div>
      </div>;
  }
  const handleSubjectClick = (area: string, modulo: string, tema: string, assunto: string, assuntoId: number) => {
    const allAssuntos = resumos.filter(r => r.id === assuntoId);
    const assuntoData = allAssuntos[0];
    if (assuntoData) {
      setViewState({
        type: 'resumo',
        area: assuntoData.area,
        numeroModulo: assuntoData.numero_do_modulo,
        nomeModulo: assuntoData.nome_do_modulo,
        numeroTema: assuntoData.numero_do_tema,
        nomeTema: assuntoData.nome_do_tema,
        assunto: assuntoData.titulo_do_assunto,
        resumo: assuntoData.texto,
        glossario: assuntoData.glossario,
        exemplo: assuntoData.exemplo || '',
        mapaMental: assuntoData.mapa_mental || '',
        assuntoId: assuntoData.id
      });
      setActiveTab('home');
    }
  };
  const handleSearchResultClick = (result: any) => {
    const {
      path
    } = result;
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
          mapaMental: assuntoData.mapaMental || '',
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
    if (isFavorite(assuntoId)) {
      removeFromFavorites(assuntoId);
    } else {
      addToFavorites(area, modulo, tema, assunto, assuntoId);
    }
  };
  const applyFilters = (areas: any[]) => {
    let filtered = areas;
    if (filters.selectedAreas.length > 0) {
      filtered = filtered.filter(({
        area
      }) => filters.selectedAreas.includes(area));
    }

    // Aplicar busca
    if (searchTerm || filters.searchTerm) {
      const term = searchTerm || filters.searchTerm;
      filtered = filtered.filter(({
        area
      }) => area && area.toLowerCase().includes(term.toLowerCase()));
    }

    // Aplicar ordenação
    filtered.sort((a, b) => {
      const aValue = filters.sortBy === 'title' ? a.area : a.resumosCount;
      const bValue = filters.sortBy === 'title' ? b.area : b.resumosCount;
      if (filters.sortBy === 'title') {
        return filters.sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        return filters.sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
    });
    return filtered;
  };
  const showHeader = viewState.type === 'areas' && activeTab === 'home';
  const showNavigation = viewState.type !== 'resumo';
  const renderContent = () => {
    if (activeTab === 'favorites') {
      return <ImprovedFavoritesList favorites={favorites} onSubjectClick={handleSubjectClick} />;
    }
    if (activeTab === 'recent') {
      return <RecentsList recents={recents} onSubjectClick={handleSubjectClick} />;
    }
    if (activeTab === 'trending') {
      return <PopularContent onSubjectClick={handleSubjectClick} />;
    }
    switch (viewState.type) {
      case 'areas':
        const areas = applyFilters(getAreas());
        return <div className="space-y-6 animate-fade-in">
            <div className="text-center py-8">
              <h1 className="text-4xl font-bold text-netflix-lightGray mb-2">
                Resumos Jurídicos
              </h1>
              <p className="text-gray-400">
                Selecione uma área do direito para começar
              </p>
              {filters.selectedAreas.length > 0 && <p className="text-netflix-red text-sm mt-2">
                  Filtrado por: {filters.selectedAreas.join(', ')}
                </p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {areas.map(({
              area,
              resumosCount
            }) => <AreaCard key={area} area={area} resumosCount={resumosCount} onClick={() => setViewState({
              type: 'modulos',
              area
            })} />)}
            </div>
          </div>;
      case 'modulos':
        const modulos = getModulosByArea(viewState.area).filter(({
          nome
        }) => nome && nome.toLowerCase().includes(searchTerm.toLowerCase()));
        return <div className="space-y-6">
            <button onClick={() => setViewState({
            type: 'areas'
          })} className="text-netflix-red hover:text-netflix-darkRed transition-colors font-medium">
              ← Voltar para áreas
            </button>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-netflix-lightGray">{viewState.area}</h2>
              <p className="text-gray-400">Selecione um módulo para continuar</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {modulos.map(({
              numero,
              nome,
              temasCount,
              assuntosCount
            }, index) => <ModuloCard key={`${numero}-${nome}`} numero={numero} nome={nome} temasCount={temasCount} assuntosCount={assuntosCount} sequenceNumber={index + 1} totalCount={modulos.length} area={viewState.area} onClick={() => setViewState({
              type: 'temas',
              area: viewState.area,
              numeroModulo: numero,
              nomeModulo: nome
            })} />)}
            </div>
          </div>;
      case 'temas':
        const temas = getTemasByModulo(viewState.area, viewState.numeroModulo).filter(({
          nome
        }) => nome && nome.toLowerCase().includes(searchTerm.toLowerCase()));
        return <div className="space-y-6">
            <button onClick={() => setViewState({
            type: 'modulos',
            area: viewState.area
          })} className="text-netflix-red hover:text-netflix-darkRed transition-colors font-medium">
              ← Voltar para módulos
            </button>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-netflix-lightGray">{viewState.nomeModulo}</h2>
              <p className="text-gray-400">{viewState.area}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {temas.map(({
              numero,
              nome,
              assuntosCount
            }, index) => <TemaCard key={`${numero}-${nome}`} tema={nome} assuntosCount={assuntosCount} sequenceNumber={index + 1} totalCount={temas.length} area={viewState.area} modulo={viewState.numeroModulo} onClick={() => setViewState({
              type: 'assuntos',
              area: viewState.area,
              numeroModulo: viewState.numeroModulo,
              nomeModulo: viewState.nomeModulo,
              numeroTema: numero,
              nomeTema: nome
            })} />)}
            </div>
          </div>;
      case 'assuntos':
        const assuntos = getAssuntosByTema(viewState.area, viewState.numeroModulo, viewState.numeroTema).filter(({
          titulo
        }) => titulo && titulo.toLowerCase().includes(searchTerm.toLowerCase()));
        return <div className="space-y-6">
            <button onClick={() => setViewState({
            type: 'temas',
            area: viewState.area,
            numeroModulo: viewState.numeroModulo,
            nomeModulo: viewState.nomeModulo
          })} className="text-netflix-red hover:text-netflix-darkRed transition-colors font-medium">
              ← Voltar para temas
            </button>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-netflix-lightGray">{viewState.nomeTema}</h2>
              <p className="text-gray-400">{viewState.area} › {viewState.nomeModulo}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {assuntos.map(({
              id,
              titulo
            }, index) => <AssuntoCard key={id} assunto={titulo} assuntoId={id} area={viewState.area} modulo={viewState.nomeModulo} tema={viewState.nomeTema} sequenceNumber={index + 1} totalCount={assuntos.length} isFavorited={isFavorite(id)} onToggleFavorite={() => handleToggleFavorite(viewState.area, viewState.nomeModulo, viewState.nomeTema, titulo, id)} onClick={() => {
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
                  mapaMental: assuntoData.mapaMental || '',
                  assuntoId: assuntoData.id
                });
              }
            }} />)}
            </div>
          </div>;
      case 'resumo':
        return <ResumoViewer area={viewState.area} modulo={viewState.nomeModulo} tema={viewState.nomeTema} assunto={viewState.assunto} resumo={viewState.resumo} glossario={viewState.glossario} exemplo={viewState.exemplo} mapaMental={viewState.mapaMental} assuntoId={viewState.assuntoId} onBack={() => setViewState({
          type: 'assuntos',
          area: viewState.area,
          numeroModulo: viewState.numeroModulo,
          nomeModulo: viewState.nomeModulo,
          numeroTema: viewState.numeroTema,
          nomeTema: viewState.nomeTema
        })} />;
      default:
        return null;
    }
  };
  return <div className="min-h-screen bg-netflix-black">
      {showNavigation && <div className="container mx-auto py-8 max-w-7xl px-[10px]">
          {showHeader && <header className="mb-8">
              <JuridicalLogo />
            </header>}

          <AdvancedNavigation activeTab={activeTab} onTabChange={setActiveTab} onFilterToggle={() => setShowFilters(true)} showFilters={showFilters} />

          {activeTab === 'home' && <SearchWithPreview searchTerm={searchTerm} onSearchChange={setSearchTerm} onResultClick={handleSearchResultClick} />}

          <main>{renderContent()}</main>
        </div>}

      {viewState.type === 'resumo' && renderContent()}

      <AdvancedFilters isOpen={showFilters} onClose={() => setShowFilters(false)} onFiltersChange={setFilters} />
    </div>;
};
export default Index;