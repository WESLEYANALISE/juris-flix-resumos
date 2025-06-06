import { useState } from 'react';
import { Search } from 'lucide-react';
import { useResumos } from '../hooks/useResumos';
import AreaCard from '../components/AreaCard';
import ModuloCard from '../components/ModuloCard';
import TemaCard from '../components/TemaCard';
import AssuntoCard from '../components/AssuntoCard';
import ResumoViewer from '../components/ResumoViewer';
import Navigation from '../components/Navigation';
import FavoritesList from '../components/FavoritesList';
import RecentsList from '../components/RecentsList';
import { Input } from '@/components/ui/input';
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
    getAreas,
    getModulosByArea,
    getTemasByModulo,
    getAssuntosByTema
  } = useResumos();
  if (loading) {
    return <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-netflix-red mx-auto mb-4"></div>
          <p className="text-netflix-lightGray">Carregando resumos...</p>
        </div>
      </div>;
  }
  if (error) {
    return <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-netflix-red mb-4">Erro ao carregar dados</p>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>;
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
        assuntoId: assuntoData.id
      });
      setActiveTab('home');
    }
  };
  const renderContent = () => {
    if (activeTab === 'favorites') {
      return <FavoritesList favorites={favorites} onSubjectClick={handleSubjectClick} />;
    }
    if (activeTab === 'recent') {
      return <RecentsList recents={recents} onSubjectClick={handleSubjectClick} />;
    }
    switch (viewState.type) {
      case 'areas':
        const areas = getAreas().filter(({
          area
        }) => area && area.toLowerCase().includes(searchTerm.toLowerCase()));
        return <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {areas.map(({
            area,
            modulosCount
          }) => <AreaCard key={area} area={area} temasCount={modulosCount} onClick={() => setViewState({
            type: 'modulos',
            area
          })} />)}
          </div>;
      case 'modulos':
        const modulos = getModulosByArea(viewState.area).filter(({
          nome
        }) => nome && nome.toLowerCase().includes(searchTerm.toLowerCase()));
        return <div className="min-h-screen">
            <button onClick={() => setViewState({
            type: 'areas'
          })} className="text-netflix-red hover:text-netflix-darkRed mb-6 transition-colors">
              ← Voltar para áreas
            </button>
            <h2 className="text-3xl font-bold text-netflix-lightGray mb-8">
              {viewState.area}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {modulos.map(({
              numero,
              nome,
              temasCount
            }) => <ModuloCard key={`${numero}-${nome}`} numero={numero} nome={nome} temasCount={temasCount} onClick={() => setViewState({
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
        return <div className="min-h-screen">
            <button onClick={() => setViewState({
            type: 'modulos',
            area: viewState.area
          })} className="text-netflix-red hover:text-netflix-darkRed mb-6 transition-colors">
              ← Voltar para módulos
            </button>
            <div className="mb-8">
              <h2 className="font-bold text-netflix-lightGray text-lg">
                {viewState.nomeModulo}
              </h2>
              <p className="text-gray-400 text-lg">{viewState.area}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {temas.map(({
              numero,
              nome,
              assuntosCount
            }) => <TemaCard key={`${numero}-${nome}`} tema={nome} assuntosCount={assuntosCount} onClick={() => setViewState({
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
        return <div className="min-h-screen">
            <button onClick={() => setViewState({
            type: 'temas',
            area: viewState.area,
            numeroModulo: viewState.numeroModulo,
            nomeModulo: viewState.nomeModulo
          })} className="text-netflix-red hover:text-netflix-darkRed mb-6 transition-colors">
              ← Voltar para temas
            </button>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-netflix-lightGray">
                {viewState.nomeTema}
              </h2>
              <p className="text-gray-400 text-lg">{viewState.area} › {viewState.nomeModulo}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {assuntos.map(({
              id,
              numero,
              titulo
            }) => <AssuntoCard key={id} assunto={titulo} onClick={() => setViewState({
              type: 'resumo',
              area: viewState.area,
              numeroModulo: viewState.numeroModulo,
              nomeModulo: viewState.nomeModulo,
              numeroTema: viewState.numeroTema,
              nomeTema: viewState.nomeTema,
              assunto: titulo,
              resumo: getAssuntosByTema(viewState.area, viewState.numeroModulo, viewState.numeroTema).find(a => a.id === id)?.texto || '',
              glossario: getAssuntosByTema(viewState.area, viewState.numeroModulo, viewState.numeroTema).find(a => a.id === id)?.glossario || '',
              assuntoId: id
            })} />)}
            </div>
          </div>;
      case 'resumo':
        return <ResumoViewer area={viewState.area} modulo={viewState.nomeModulo} tema={viewState.nomeTema} assunto={viewState.assunto} resumo={viewState.resumo} glossario={viewState.glossario} assuntoId={viewState.assuntoId} onBack={() => setViewState({
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
      {viewState.type !== 'resumo' && <div className="container mx-auto px-4 py-8 max-w-7xl">
          <header className="text-center mb-8">
            <JuridicalLogo />
          </header>

          <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

          {activeTab === 'home' && (viewState.type === 'areas' || viewState.type === 'modulos' || viewState.type === 'temas' || viewState.type === 'assuntos') && <div className="relative w-full max-w-2xl mx-auto mb-8">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-netflix-lightGray h-5 w-5" />
              <Input type="text" placeholder="Pesquisar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-12 pr-4 py-3 w-full bg-netflix-darkGray border-netflix-gray text-netflix-lightGray placeholder-gray-400 focus:border-netflix-red focus:ring-netflix-red rounded-lg text-lg" />
            </div>}

          <main>
            {renderContent()}
          </main>
        </div>}

      {viewState.type === 'resumo' && renderContent()}
    </div>;
};
export default Index;