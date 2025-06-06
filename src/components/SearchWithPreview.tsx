
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useResumos } from '../hooks/useResumos';
import { getAreaColors } from '../utils/areaColors';

interface SearchResult {
  type: 'area' | 'modulo' | 'tema' | 'assunto';
  area: string;
  title: string;
  subtitle?: string;
  content?: string;
  path: {
    area: string;
    modulo?: string;
    tema?: string;
    assunto?: string;
  };
}

interface SearchWithPreviewProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onResultClick: (result: SearchResult) => void;
}

const SearchWithPreview: React.FC<SearchWithPreviewProps> = ({
  searchTerm,
  onSearchChange,
  onResultClick
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const { getAreas, getModulosByArea, getTemasByModulo, getAssuntosByTema } = useResumos();

  useEffect(() => {
    const savedSearches = localStorage.getItem('recent-searches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  useEffect(() => {
    if (searchTerm.trim().length > 1) {
      performSearch(searchTerm.trim());
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = (term: string) => {
    const searchResults: SearchResult[] = [];
    const lowerTerm = term.toLowerCase();

    // Search areas
    const areas = getAreas();
    areas.forEach(({ area, resumosCount }) => {
      if (area && area.toLowerCase().includes(lowerTerm)) {
        searchResults.push({
          type: 'area',
          area,
          title: area,
          subtitle: `${resumosCount} resumos disponíveis`,
          path: { area }
        });
      }
    });

    // Search modules, themes, and subjects
    areas.forEach(({ area }) => {
      if (!area) return;
      
      const modulos = getModulosByArea(area);
      
      modulos.forEach(({ numero, nome, temasCount }) => {
        if (nome && nome.toLowerCase().includes(lowerTerm)) {
          searchResults.push({
            type: 'modulo',
            area,
            title: nome,
            subtitle: `${area} • ${temasCount} temas`,
            path: { area, modulo: `${numero}-${nome}` }
          });
        }

        const temas = getTemasByModulo(area, numero);
        temas.forEach(({ numero: numeroTema, nome: nomeTema, assuntosCount }) => {
          if (nomeTema && nomeTema.toLowerCase().includes(lowerTerm)) {
            searchResults.push({
              type: 'tema',
              area,
              title: nomeTema,
              subtitle: `${area} • ${nome} • ${assuntosCount} assuntos`,
              path: { area, modulo: `${numero}-${nome}`, tema: `${numeroTema}-${nomeTema}` }
            });
          }

          const assuntos = getAssuntosByTema(area, numero, numeroTema);
          assuntos.forEach(({ titulo, texto }) => {
            if ((titulo && titulo.toLowerCase().includes(lowerTerm)) || 
                (texto && texto.toLowerCase().includes(lowerTerm))) {
              const contentSnippet = texto && texto.length > 100 ? 
                texto.substring(0, 100) + '...' : (texto || '');
              
              searchResults.push({
                type: 'assunto',
                area,
                title: titulo || 'Sem título',
                subtitle: `${area} • ${nome} • ${nomeTema}`,
                content: contentSnippet,
                path: { area, modulo: `${numero}-${nome}`, tema: `${numeroTema}-${nomeTema}`, assunto: titulo || '' }
              });
            }
          });
        });
      });
    });

    setResults(searchResults.slice(0, 8)); // Limit to 8 results
  };

  const handleResultClick = (result: SearchResult) => {
    // Save to recent searches
    const updatedRecent = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
    setRecentSearches(updatedRecent);
    localStorage.setItem('recent-searches', JSON.stringify(updatedRecent));
    
    setIsOpen(false);
    onResultClick(result);
  };

  const clearSearch = () => {
    onSearchChange('');
    setIsOpen(false);
  };

  const handleRecentSearch = (search: string) => {
    onSearchChange(search);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto mb-8">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-netflix-lightGray h-5 w-5" />
        <Input
          type="text"
          placeholder="Pesquisar áreas, módulos, temas ou resumos..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="pl-12 pr-12 py-3 w-full bg-netflix-darkGray border-netflix-gray text-netflix-lightGray placeholder-gray-400 focus:border-netflix-red focus:ring-netflix-red rounded-lg text-lg transition-all duration-300"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-netflix-red transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-netflix-darkGray border border-netflix-gray rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto animate-fade-in">
          {results.length > 0 ? (
            <div className="p-2">
              <div className="text-xs font-medium text-gray-400 px-3 py-2 flex items-center gap-2">
                <TrendingUp className="h-3 w-3" />
                Resultados da busca
              </div>
              {results.map((result, index) => {
                const colors = getAreaColors(result.area);
                return (
                  <button
                    key={index}
                    onClick={() => handleResultClick(result)}
                    className="w-full text-left p-3 rounded-lg hover:bg-netflix-gray transition-all duration-200 group"
                  >
                    <div className="flex items-start gap-3">
                      <div 
                        className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                        style={{ backgroundColor: colors.primary }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-netflix-lightGray group-hover:text-white transition-colors">
                          {result.title}
                        </div>
                        <div className="text-sm text-gray-400 truncate">
                          {result.subtitle}
                        </div>
                        {result.content && (
                          <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {result.content}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : searchTerm.length > 1 ? (
            <div className="p-4 text-center text-gray-400">
              Nenhum resultado encontrado
            </div>
          ) : (
            recentSearches.length > 0 && (
              <div className="p-2">
                <div className="text-xs font-medium text-gray-400 px-3 py-2 flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  Buscas recentes
                </div>
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearch(search)}
                    className="w-full text-left p-3 rounded-lg hover:bg-netflix-gray transition-colors text-netflix-lightGray"
                  >
                    {search}
                  </button>
                ))}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default SearchWithPreview;
