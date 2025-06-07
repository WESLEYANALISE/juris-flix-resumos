
import React, { useState } from 'react';
import { useResumos } from '../hooks/useResumos';
import JuridicalLogo from '../components/JuridicalLogo';
import Navigation from '../components/Navigation';
import SearchBar from '../components/SearchBar';
import AreaCard from '../components/AreaCard';
import ModuloCard from '../components/ModuloCard';
import TemaCard from '../components/TemaCard';
import SubjectsList from '../components/SubjectsList';
import ResumoViewer from '../components/ResumoViewer';
import FavoritesList from '../components/FavoritesList';
import RecentsList from '../components/RecentsList';
import UserMenu from '../components/UserMenu';
import { ChevronLeft } from 'lucide-react';

type ViewState = 'areas' | 'modulos' | 'temas' | 'assuntos' | 'resumo' | 'favorites' | 'recent';

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewState>('areas');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedModulo, setSelectedModulo] = useState('');
  const [selectedTema, setSelectedTema] = useState('');
  const [selectedAssunto, setSelectedAssunto] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'favorites' | 'recent'>('home');
  const [searchTerm, setSearchTerm] = useState('');

  const {
    loading,
    error,
    getAreas,
    getModulosByArea,
    getTemasByModulo,
    getAssuntosByTema,
    addToRecents,
    isAuthenticated
  } = useResumos();

  const handleTabChange = (tab: 'home' | 'favorites' | 'recent') => {
    setActiveTab(tab);
    if (tab === 'home') {
      setCurrentView('areas');
    } else if (tab === 'favorites') {
      setCurrentView('favorites');
    } else if (tab === 'recent') {
      setCurrentView('recent');
    }
  };

  const handleAreaSelect = (area: string) => {
    setSelectedArea(area);
    setCurrentView('modulos');
  };

  const handleModuloSelect = (numeroModulo: string) => {
    setSelectedModulo(numeroModulo);
    setCurrentView('temas');
  };

  const handleTemaSelect = (numeroTema: string) => {
    setSelectedTema(numeroTema);
    setCurrentView('assuntos');
  };

  const handleAssuntoSelect = (assunto: any) => {
    setSelectedAssunto(assunto);
    setCurrentView('resumo');
    
    if (isAuthenticated) {
      addToRecents(selectedArea, selectedModulo, selectedTema, assunto.titulo, assunto.id);
    }
  };

  const handleSubjectClick = (area: string, modulo: string, tema: string, assunto: string, assuntoId: number) => {
    // Find the full assunto object
    const assuntos = getAssuntosByTema(area, modulo.split(' - ')[0], tema.split(' - ')[0]);
    const foundAssunto = assuntos.find(a => a.id === assuntoId);
    
    if (foundAssunto) {
      setSelectedArea(area);
      setSelectedModulo(modulo.split(' - ')[0]);
      setSelectedTema(tema.split(' - ')[0]);
      setSelectedAssunto(foundAssunto);
      setCurrentView('resumo');
      setActiveTab('home');
    }
  };

  const handleBack = () => {
    if (currentView === 'resumo') {
      setCurrentView('assuntos');
    } else if (currentView === 'assuntos') {
      setCurrentView('temas');
    } else if (currentView === 'temas') {
      setCurrentView('modulos');
    } else if (currentView === 'modulos') {
      setCurrentView('areas');
    } else if (currentView === 'favorites' || currentView === 'recent') {
      setCurrentView('areas');
      setActiveTab('home');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-netflix-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-netflix-lightGray">Carregando resumos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Erro ao carregar resumos</p>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (currentView === 'resumo' && selectedAssunto) {
      return (
        <ResumoViewer
          area={selectedArea}
          modulo={selectedModulo}
          tema={selectedTema}
          assunto={selectedAssunto.titulo}
          resumo={selectedAssunto.texto}
          glossario={selectedAssunto.glossario}
          exemplo={selectedAssunto.exemplo}
          assuntoId={selectedAssunto.id}
          onBack={handleBack}
        />
      );
    }

    return (
      <div className="container mx-auto py-6 max-w-6xl px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            {(currentView !== 'areas' && currentView !== 'favorites' && currentView !== 'recent') && (
              <button 
                onClick={handleBack}
                className="text-netflix-red hover:text-netflix-darkRed transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            <JuridicalLogo />
          </div>
          
          <UserMenu />
        </div>

        <Navigation 
          activeTab={activeTab} 
          onTabChange={handleTabChange} 
        />

        <SearchBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {currentView === 'favorites' && (
          <FavoritesList 
            favorites={[]} 
            onSubjectClick={handleSubjectClick}
            isAuthenticated={isAuthenticated}
          />
        )}
        
        {currentView === 'recent' && (
          <RecentsList 
            recents={[]} 
            onSubjectClick={handleSubjectClick}
            isAuthenticated={isAuthenticated}
          />
        )}

        {currentView === 'areas' && activeTab === 'home' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getAreas().map((area) => (
              <AreaCard
                key={area.area}
                area={area.area}
                resumosCount={area.resumosCount}
                onClick={() => handleAreaSelect(area.area)}
              />
            ))}
          </div>
        )}

        {currentView === 'modulos' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-netflix-lightGray mb-6">
              {selectedArea} - Módulos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getModulosByArea(selectedArea).map((modulo) => (
                <ModuloCard
                  key={`${modulo.numero}-${modulo.nome}`}
                  numero={modulo.numero}
                  nome={modulo.nome}
                  temasCount={modulo.temasCount}
                  assuntosCount={modulo.assuntosCount}
                  onClick={() => handleModuloSelect(modulo.numero)}
                />
              ))}
            </div>
          </div>
        )}

        {currentView === 'temas' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-netflix-lightGray mb-6">
              {selectedArea} - {getModulosByArea(selectedArea).find(m => m.numero === selectedModulo)?.nome} - Temas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getTemasByModulo(selectedArea, selectedModulo).map((tema) => (
                <TemaCard
                  key={`${tema.numero}-${tema.nome}`}
                  tema={`${tema.numero} - ${tema.nome}`}
                  assuntosCount={tema.assuntosCount}
                  onClick={() => handleTemaSelect(tema.numero)}
                />
              ))}
            </div>
          </div>
        )}

        {currentView === 'assuntos' && (
          <SubjectsList
            subjects={getAssuntosByTema(selectedArea, selectedModulo, selectedTema)}
            area={selectedArea}
            modulo={selectedModulo}
            tema={selectedTema}
            onSubjectClick={handleAssuntoSelect}
          />
        )}
      </div>
    );
  };

  return <div className="min-h-screen bg-netflix-black">{renderContent()}</div>;
};

export default Index;
