
import React, { useState, useMemo } from 'react';
import { Heart, ExternalLink, Filter, Grid, List, Calendar, TrendingUp, Star } from 'lucide-react';

interface FavoriteItem {
  id: string;
  area: string;
  modulo: string;
  tema: string;
  assunto: string;
  assunto_id: number;
  created_at: string;
}

interface ImprovedFavoritesListProps {
  favorites: FavoriteItem[];
  onSubjectClick: (area: string, modulo: string, tema: string, assunto: string, assuntoId: number) => void;
}

type ViewMode = 'grid' | 'list';
type SortMode = 'recent' | 'area' | 'alphabetical' | 'frequency';
type GroupMode = 'area' | 'date' | 'module' | 'none';

const ImprovedFavoritesList: React.FC<ImprovedFavoritesListProps> = ({ favorites, onSubjectClick }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortMode, setSortMode] = useState<SortMode>('recent');
  const [groupMode, setGroupMode] = useState<GroupMode>('area');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAndSortedFavorites = useMemo(() => {
    let filtered = favorites.filter(fav =>
      fav.assunto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fav.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fav.modulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fav.tema.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Ordenação
    switch (sortMode) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'area':
        filtered.sort((a, b) => a.area.localeCompare(b.area));
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.assunto.localeCompare(b.assunto));
        break;
      case 'frequency':
        // Simular frequência baseada na quantidade por área
        const areaCount = favorites.reduce((acc, fav) => {
          acc[fav.area] = (acc[fav.area] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        filtered.sort((a, b) => (areaCount[b.area] || 0) - (areaCount[a.area] || 0));
        break;
    }

    return filtered;
  }, [favorites, searchTerm, sortMode]);

  const groupedFavorites = useMemo(() => {
    if (groupMode === 'none') {
      return { 'Todos os Favoritos': filteredAndSortedFavorites };
    }

    return filteredAndSortedFavorites.reduce((groups, favorite) => {
      let groupKey = '';
      
      switch (groupMode) {
        case 'area':
          groupKey = favorite.area;
          break;
        case 'date':
          const date = new Date(favorite.created_at);
          const today = new Date();
          const diffTime = Math.abs(today.getTime() - date.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays <= 7) groupKey = 'Esta Semana';
          else if (diffDays <= 30) groupKey = 'Este Mês';
          else if (diffDays <= 90) groupKey = 'Últimos 3 Meses';
          else groupKey = 'Mais Antigos';
          break;
        case 'module':
          groupKey = favorite.modulo;
          break;
        default:
          groupKey = 'Todos';
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(favorite);
      return groups;
    }, {} as Record<string, FavoriteItem[]>);
  }, [filteredAndSortedFavorites, groupMode]);

  const getGroupIcon = (groupKey: string) => {
    if (groupMode === 'date') {
      return <Calendar className="h-5 w-5 text-netflix-red" />;
    }
    if (groupMode === 'area') {
      return <Star className="h-5 w-5 text-netflix-red" />;
    }
    return <Heart className="h-5 w-5 text-netflix-red" />;
  };

  const getGroupStats = (groupKey: string, items: FavoriteItem[]) => {
    const count = items.length;
    const recentCount = items.filter(item => {
      const diffTime = Math.abs(new Date().getTime() - new Date(item.created_at).getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    }).length;

    return `${count} item${count !== 1 ? 's' : ''} ${recentCount > 0 ? `• ${recentCount} novos` : ''}`;
  };

  if (favorites.length === 0) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <Heart className="h-16 w-16 text-gray-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-netflix-lightGray mb-4">Favoritos</h2>
        <p className="text-gray-400">Você ainda não possui resumos favoritos.</p>
        <p className="text-gray-500 text-sm mt-2">
          Clique no ❤️ nos resumos para adicioná-los aos seus favoritos.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <Heart className="h-12 w-12 text-netflix-red mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-netflix-lightGray mb-2">Seus Favoritos</h2>
        <p className="text-gray-400">
          {favorites.length} resumos organizados inteligentemente
        </p>
      </div>

      {/* Controles */}
      <div className="bg-netflix-darkGray/50 backdrop-blur-sm rounded-2xl p-6 border border-netflix-gray/30">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Busca */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Buscar nos favoritos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-3 bg-netflix-gray border border-netflix-gray/50 rounded-xl text-netflix-lightGray placeholder-gray-400 focus:outline-none focus:border-netflix-red focus:ring-1 focus:ring-netflix-red transition-all"
            />
          </div>

          {/* Controles de visualização */}
          <div className="flex flex-wrap gap-2 items-center">
            {/* Agrupamento */}
            <select
              value={groupMode}
              onChange={(e) => setGroupMode(e.target.value as GroupMode)}
              className="px-3 py-2 bg-netflix-gray border border-netflix-gray/50 rounded-lg text-netflix-lightGray text-sm focus:outline-none focus:border-netflix-red"
            >
              <option value="area">Por Área</option>
              <option value="date">Por Data</option>
              <option value="module">Por Módulo</option>
              <option value="none">Sem Agrupamento</option>
            </select>

            {/* Ordenação */}
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              className="px-3 py-2 bg-netflix-gray border border-netflix-gray/50 rounded-lg text-netflix-lightGray text-sm focus:outline-none focus:border-netflix-red"
            >
              <option value="recent">Mais Recentes</option>
              <option value="alphabetical">A-Z</option>
              <option value="area">Por Área</option>
              <option value="frequency">Mais Populares</option>
            </select>

            {/* Modo de visualização */}
            <div className="flex bg-netflix-gray/50 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'grid' ? 'bg-netflix-red text-white' : 'text-gray-400 hover:text-netflix-lightGray'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'list' ? 'bg-netflix-red text-white' : 'text-gray-400 hover:text-netflix-lightGray'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Favoritos agrupados */}
      {Object.entries(groupedFavorites).map(([groupKey, groupItems]) => (
        <div key={groupKey} className="space-y-4">
          {/* Header do grupo */}
          <div className="flex items-center gap-3 border-l-4 border-netflix-red pl-4 py-2">
            {getGroupIcon(groupKey)}
            <div>
              <h3 className="text-xl font-semibold text-netflix-lightGray">{groupKey}</h3>
              <p className="text-gray-400 text-sm">{getGroupStats(groupKey, groupItems)}</p>
            </div>
          </div>

          {/* Items do grupo */}
          <div className={`ml-4 ${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4' 
              : 'space-y-3'
          }`}>
            {groupItems.map((favorite, index) => (
              <div
                key={favorite.id}
                className={`bg-netflix-darkGray border border-netflix-gray rounded-xl p-6 hover:border-netflix-red/50 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-2xl hover:shadow-netflix-red/20 animate-slide-in-up group ${
                  viewMode === 'list' ? 'flex items-center gap-4' : ''
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => onSubjectClick(
                  favorite.area,
                  favorite.modulo,
                  favorite.tema,
                  favorite.assunto,
                  favorite.assunto_id
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <Heart className="h-5 w-5 text-netflix-red fill-current flex-shrink-0 mt-1" />
                  <ExternalLink className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <div className={viewMode === 'list' ? 'flex-1' : ''}>
                  <h4 className="text-lg font-semibold text-netflix-lightGray mb-3 line-clamp-2">
                    {favorite.assunto}
                  </h4>
                  
                  <div className="text-sm text-gray-400 space-y-1 mb-3">
                    <p className="text-xs">{favorite.modulo} › {favorite.tema}</p>
                    {groupMode !== 'area' && (
                      <p className="text-xs text-netflix-red">{favorite.area}</p>
                    )}
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Favoritado em {new Date(favorite.created_at).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Estado vazio para busca */}
      {Object.keys(groupedFavorites).length === 0 && searchTerm && (
        <div className="text-center py-12">
          <Filter className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">Nenhum favorito encontrado para "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
};

export default ImprovedFavoritesList;
