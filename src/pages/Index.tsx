
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import AreaCard from '@/components/AreaCard';
import ModuloCard from '@/components/ModuloCard';
import TemaCard from '@/components/TemaCard';
import AssuntoCard from '@/components/AssuntoCard';
import ResumoViewer from '@/components/ResumoViewer';
import FavoritesList from '@/components/FavoritesList';
import RecentsList from '@/components/RecentsList';
import SearchWithPreview from '@/components/SearchWithPreview';
import { useResumos } from '@/hooks/useResumos';
import { Book, Heart, Clock, Search } from 'lucide-react';

const Index = () => {
  const {
    getAreas,
    getModulosByArea,
    getTemasByModulo,
    getAssuntosByTema,
    loading,
    error,
    favorites,
    recents,
    isAuthenticated
  } = useResumos();

  const [currentView, setCurrentView] = useState<'areas' | 'modulos' | 'temas' | 'assuntos' | 'favorites' | 'recents' | 'search'>('areas');
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [selectedModulo, setSelectedModulo] = useState<string>('');
  const [selectedTema, setSelectedTema] = useState<string>('');
  const [viewerData, setViewerData] = useState<any>(null);

  const handleAreaClick = (area: string) => {
    setSelectedArea(area);
    setCurrentView('modulos');
  };

  const handleModuloClick = (numeroModulo: string) => {
    setSelectedModulo(numeroModulo);
    setCurrentView('temas');
  };

  const handleTemaClick = (numeroTema: string) => {
    setSelectedTema(numeroTema);
    setCurrentView('assuntos');
  };

  const handleAssuntoClick = (area: string, modulo: string, tema: string, assunto: string, assuntoId: number) => {
    const assuntos = getAssuntosByTema(selectedArea, selectedModulo, selectedTema);
    const assuntoData = assuntos.find(a => a.id === assuntoId);
    
    if (assuntoData) {
      setViewerData({
        area,
        modulo,
        tema,
        assunto,
        assuntoId,
        texto: assuntoData.texto,
        glossario: assuntoData.glossario,
        exemplo: assuntoData.exemplo
      });
    }
  };

  const handleSubjectClick = (area: string, modulo: string, tema: string, assunto: string, assuntoId: number) => {
    handleAssuntoClick(area, modulo, tema, assunto, assuntoId);
  };

  const handleBack = () => {
    if (currentView === 'modulos') {
      setCurrentView('areas');
      setSelectedArea('');
    } else if (currentView === 'temas') {
      setCurrentView('modulos');
      setSelectedModulo('');
    } else if (currentView === 'assuntos') {
      setCurrentView('temas');
      setSelectedTema('');
    } else if (currentView === 'favorites' || currentView === 'recents' || currentView === 'search') {
      setCurrentView('areas');
    }
  };

  const getTitle = () => {
    switch (currentView) {
      case 'areas': return 'Resumos Jurídicos';
      case 'modulos': return selectedArea;
      case 'temas': return `${selectedArea} - Módulos`;
      case 'assuntos': return `${selectedArea} - Temas`;
      case 'favorites': return 'Favoritos';
      case 'recents': return 'Recentes';
      case 'search': return 'Buscar';
      default: return 'Resumos Jurídicos';
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-netflix-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-netflix-lightGray">Carregando resumos...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <p className="text-red-400 mb-4">Erro ao carregar dados: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-netflix-red text-white rounded-lg hover:bg-netflix-darkRed transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      );
    }

    switch (currentView) {
      case 'areas':
        const areas = getAreas();
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {areas.map(({ area, resumosCount }) => (
              <AreaCard
                key={area}
                area={area}
                resumosCount={resumosCount}
                onClick={() => handleAreaClick(area)}
              />
            ))}
          </div>
        );

      case 'modulos':
        const modulos = getModulosByArea(selectedArea);
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {modulos.map((modulo) => (
              <ModuloCard
                key={`${modulo.numero}-${modulo.nome}`}
                numero={modulo.numero}
                nome={modulo.nome}
                temasCount={modulo.temasCount}
                assuntosCount={modulo.assuntosCount}
                onClick={() => handleModuloClick(modulo.numero)}
              />
            ))}
          </div>
        );

      case 'temas':
        const temas = getTemasByModulo(selectedArea, selectedModulo);
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {temas.map((tema) => (
              <TemaCard
                key={`${tema.numero}-${tema.nome}`}
                numero={tema.numero}
                nome={tema.nome}
                assuntosCount={tema.assuntosCount}
                onClick={() => handleTemaClick(tema.numero)}
              />
            ))}
          </div>
        );

      case 'assuntos':
        const assuntos = getAssuntosByTema(selectedArea, selectedModulo, selectedTema);
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {assuntos.map((assunto) => (
              <AssuntoCard
                key={assunto.id}
                assunto={assunto.titulo}
                assuntoId={assunto.id}
                area={selectedArea}
                modulo={selectedModulo}
                tema={selectedTema}
                isFavorited={false}
                onToggleFavorite={() => {}}
                onClick={() => handleAssuntoClick(selectedArea, selectedModulo, selectedTema, assunto.titulo, assunto.id)}
              />
            ))}
          </div>
        );

      case 'favorites':
        return (
          <FavoritesList
            favorites={favorites}
            onSubjectClick={handleSubjectClick}
            isAuthenticated={isAuthenticated}
          />
        );

      case 'recents':
        return (
          <RecentsList
            recents={recents}
            onSubjectClick={handleSubjectClick}
            isAuthenticated={isAuthenticated}
          />
        );

      case 'search':
        return <SearchWithPreview onSubjectClick={handleSubjectClick} />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-netflix-black">
      <Navigation 
        title={getTitle()} 
        onBack={handleBack}
        showBackButton={currentView !== 'areas'}
        isAuthenticated={isAuthenticated}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center sm:justify-start">
          <button
            onClick={() => setCurrentView('areas')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              currentView === 'areas'
                ? 'bg-netflix-red text-white'
                : 'bg-netflix-gray text-netflix-lightGray hover:bg-netflix-gray/80'
            }`}
          >
            <Book className="h-4 w-4" />
            Resumos
          </button>
          
          <button
            onClick={() => setCurrentView('search')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              currentView === 'search'
                ? 'bg-netflix-red text-white'
                : 'bg-netflix-gray text-netflix-lightGray hover:bg-netflix-gray/80'
            }`}
          >
            <Search className="h-4 w-4" />
            Buscar
          </button>

          {isAuthenticated && (
            <>
              <button
                onClick={() => setCurrentView('favorites')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'favorites'
                    ? 'bg-netflix-red text-white'
                    : 'bg-netflix-gray text-netflix-lightGray hover:bg-netflix-gray/80'
                }`}
              >
                <Heart className="h-4 w-4" />
                Favoritos ({favorites.length})
              </button>
              
              <button
                onClick={() => setCurrentView('recents')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'recents'
                    ? 'bg-netflix-red text-white'
                    : 'bg-netflix-gray text-netflix-lightGray hover:bg-netflix-gray/80'
                }`}
              >
                <Clock className="h-4 w-4" />
                Recentes ({recents.length})
              </button>
            </>
          )}
        </div>

        {renderContent()}
      </main>

      {/* Resume Viewer Modal */}
      {viewerData && (
        <ResumoViewer
          isOpen={!!viewerData}
          onClose={() => setViewerData(null)}
          {...viewerData}
        />
      )}
    </div>
  );
};

export default Index;
