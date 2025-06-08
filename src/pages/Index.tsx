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
import JuridicalLogo from '../components/JuridicalLogo';
import Breadcrumbs from '@/components/Breadcrumbs';
import PersonalDashboard from '@/components/PersonalDashboard';
import AdvancedSearch from '@/components/AdvancedSearch';

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

type ActiveTab = 'home' | 'favorites' | 'recent';

const Index = () => {
  const [viewState, setViewState] = useState<ViewState>({
    type: 'areas'
  });
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFilters, setSearchFilters] = useState<{
    area?: string;
    modulo?: string;
    tema?: string;
  }>({});

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
    resumos
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
    // Buscar os dados do assunto diretamente pelo ID
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
    setSearchTerm(''); // Clear search when navigating
  };

  const handleToggleFavorite = (area: string, modulo: string, tema: string, assunto: string, assuntoId: number) => {
    if (isFavorite(assuntoId)) {
      removeFromFavorites(assuntoId);
    } else {
      addToFavorites(area, modulo, tema, assunto, assuntoId);
    }
  };

  const getBreadcrumbItems = () => {
    const items = [
      {
        label: 'Início',
        onClick: () => setViewState({ type: 'areas' }),
        isActive: viewState.type === 'areas'
      }
    ];

    if (viewState.type === 'modulos') {
      items.push({
        label: viewState.area,
        isActive: true
      });
    } else if (viewState.type === 'temas') {
      items.push(
        {
          label: viewState.area,
          onClick: () => setViewState({ type: 'modulos', area: viewState.area })
        },
        {
          label: viewState.nomeModulo,
          isActive: true
        }
      );
    } else if (viewState.type === 'assuntos') {
      items.push(
        {
          label: viewState.area,
          onClick: () => setViewState({ type: 'modulos', area: viewState.area })
        },
        {
          label: viewState.nomeModulo,
          onClick: () => setViewState({
            type: 'temas',
            area: viewState.area,
            numeroModulo: viewState.numeroModulo,
            nomeModulo: viewState.nomeModulo
          })
        },
        {
          label: viewState.nomeTema,
          isActive: true
        }
      );
    } else if (viewState.type === 'resumo') {
      items.push(
        {
          label: viewState.area,
          onClick: () => setViewState({ type: 'modulos', area: viewState.area })
        },
        {
          label: viewState.nomeModulo,
          onClick: () => setViewState({
            type: 'temas',
            area: viewState.area,
            numeroModulo: viewState.numeroModulo,
            nomeModulo: viewState.nomeModulo
          })
        },
        {
          label: viewState.nomeTema,
          onClick: () => setViewState({
            type: 'assuntos',
            area: viewState.area,
            numeroModulo: viewState.numeroModulo,
            nomeModulo: viewState.nomeModulo,
            numeroTema: viewState.numeroTema,
            nomeTema: viewState.nomeTema
          })
        },
        {
          label: viewState.assunto,
          isActive: true
        }
      );
    }

    return items;
  };

  const applyFilters = (items: any[]) => {
    return items.filter(item => {
      const matchesSearch = !searchTerm || 
        (item.area && item.area.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.nome && item.nome.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.titulo && item.titulo.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesAreaFilter = !searchFilters.area || item.area === searchFilters.area;
      const matchesModuloFilter = !searchFilters.modulo || 
        (item.nome && item.nome.toLowerCase().includes(searchFilters.modulo.toLowerCase()));
      const matchesTemaFilter = !searchFilters.tema || 
        (item.nome && item.nome.toLowerCase().includes(searchFilters.tema.toLowerCase()));

      return matchesSearch && matchesAreaFilter && matchesModuloFilter && matchesTemaFilter;
    });
  };

  const showHeader = viewState.type === 'areas' && activeTab === 'home';
  const showNavigation = viewState.type !== 'resumo';
  const availableAreas = getAreas().map(({ area }) => area);

  const renderContent = () => {
    if (activeTab === 'favorites') {
      return (
        <FavoritesList 
          favorites={favorites} 
          onSubjectClick={handleSubjectClick} 
        />
      );
    }

    if (activeTab === 'recent') {
      return (
        <RecentsList 
          recents={recents} 
          onSubjectClick={handleSubjectClick} 
        />
      );
    }

    switch (viewState.type) {
      case 'areas':
        if (activeTab === 'home' && searchTerm === '' && Object.keys(searchFilters).length === 0) {
          return <PersonalDashboard />;
        }
        
        const areas = applyFilters(getAreas());
        
        return (
          <div className="space-y-6">
            {!searchTerm && Object.keys(searchFilters).length === 0 && (
              <div className="text-center py-8">
                <h1 className="text-4xl font-bold text-netflix-lightGray mb-2">
                  Resumos Jurídicos
                </h1>
                <p className="text-gray-400">
                  Selecione uma área do direito para começar
                </p>
              </div>
            )}
            
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
        const modulos = applyFilters(getModulosByArea(viewState.area));
        
        return (
          <div className="space-y-6">
            <Breadcrumbs items={getBreadcrumbItems()} />
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-netflix-lightGray">{viewState.area}</h2>
              <p className="text-gray-400">Selecione um módulo para continuar</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {modulos.map(({ numero, nome, temasCount, assuntosCount }, index) => (
                <ModuloCard 
                  key={`${numero}-${nome}`} 
                  numero={numero} 
                  nome={nome} 
                  temasCount={temasCount}
                  assuntosCount={assuntosCount}
                  sequenceNumber={index + 1}
                  totalCount={modulos.length}
                  area={viewState.area}
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
        const temas = applyFilters(getTemasByModulo(viewState.area, viewState.numeroModulo));
        
        return (
          <div className="space-y-6">
            <Breadcrumbs items={getBreadcrumbItems()} />
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-netflix-lightGray">{viewState.nomeModulo}</h2>
              <p className="text-gray-400">{viewState.area}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {temas.map(({ numero, nome, assuntosCount }, index) => (
                <TemaCard 
                  key={`${numero}-${nome}`} 
                  tema={nome} 
                  assuntosCount={assuntosCount}
                  sequenceNumber={index + 1}
                  totalCount={temas.length}
                  area={viewState.area}
                  modulo={viewState.numeroModulo}
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
        const assuntos = applyFilters(getAssuntosByTema(viewState.area, viewState.numeroModulo, viewState.numeroTema));
        
        return (
          <div className="space-y-6">
            <Breadcrumbs items={getBreadcrumbItems()} />
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-netflix-lightGray">{viewState.nomeTema}</h2>
              <p className="text-gray-400">{viewState.area} › {viewState.nomeModulo}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {assuntos.map(({ id, titulo }, index) => (
                <AssuntoCard 
                  key={id} 
                  assunto={titulo} 
                  assuntoId={id} 
                  area={viewState.area} 
                  modulo={viewState.nomeModulo} 
                  tema={viewState.nomeTema}
                  sequenceNumber={index + 1}
                  totalCount={assuntos.length}
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
                        mapaMental: assuntoData.mapaMental || '',
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
            mapaMental={viewState.mapaMental}
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
            <AdvancedSearch 
              searchTerm={searchTerm} 
              onSearchChange={setSearchTerm}
              filters={searchFilters}
              onFiltersChange={setSearchFilters}
              availableAreas={availableAreas}
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
