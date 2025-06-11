
import React, { useState, useMemo } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { useUltraFastResumos } from '../hooks/useUltraFastResumos';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import MiniMarkdownRenderer from './MiniMarkdownRenderer';

interface SearchResult {
  type: 'area' | 'modulo' | 'tema' | 'assunto';
  title: string;
  subtitle?: string;
  preview?: string;
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
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedArea, setSelectedArea] = useState<string>('');
  const { resumos, getAreas } = useUltraFastResumos();

  const areas = getAreas();

  const searchResults = useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) return [];

    const results: SearchResult[] = [];
    const searchLower = searchTerm.toLowerCase();

    // Filter resumos by selected area first
    const filteredResumos = selectedArea && selectedArea !== 'all'
      ? resumos.filter(resumo => resumo.area === selectedArea)
      : resumos;

    // Search through filtered resumos
    filteredResumos.forEach(resumo => {
      const moduloMatch = resumo.nome_do_modulo?.toLowerCase().includes(searchLower);
      const temaMatch = resumo.nome_do_tema?.toLowerCase().includes(searchLower);
      const assuntoMatch = resumo.titulo_do_assunto?.toLowerCase().includes(searchLower);
      const contentMatch = resumo.texto?.toLowerCase().includes(searchLower);

      if (assuntoMatch || contentMatch) {
        results.push({
          type: 'assunto',
          title: resumo.titulo_do_assunto,
          subtitle: `${resumo.area} › ${resumo.nome_do_modulo} › ${resumo.nome_do_tema}`,
          preview: resumo.texto,
          path: {
            area: resumo.area,
            modulo: `${resumo.numero_do_modulo}-${resumo.nome_do_modulo}`,
            tema: `${resumo.numero_do_tema}-${resumo.nome_do_tema}`,
            assunto: resumo.titulo_do_assunto
          }
        });
      } else if (temaMatch) {
        const existing = results.find(r => 
          r.type === 'tema' && 
          r.path.area === resumo.area && 
          r.path.modulo === `${resumo.numero_do_modulo}-${resumo.nome_do_modulo}` &&
          r.title === resumo.nome_do_tema
        );
        
        if (!existing) {
          results.push({
            type: 'tema',
            title: resumo.nome_do_tema,
            subtitle: `${resumo.area} › ${resumo.nome_do_modulo}`,
            path: {
              area: resumo.area,
              modulo: `${resumo.numero_do_modulo}-${resumo.nome_do_modulo}`,
              tema: `${resumo.numero_do_tema}-${resumo.nome_do_tema}`
            }
          });
        }
      } else if (moduloMatch) {
        const existing = results.find(r => 
          r.type === 'modulo' && 
          r.path.area === resumo.area && 
          r.title === resumo.nome_do_modulo
        );
        
        if (!existing) {
          results.push({
            type: 'modulo',
            title: resumo.nome_do_modulo,
            subtitle: resumo.area,
            path: {
              area: resumo.area,
              modulo: `${resumo.numero_do_modulo}-${resumo.nome_do_modulo}`
            }
          });
        }
      }
    });

    return results.slice(0, 8); // Limit results
  }, [searchTerm, resumos, selectedArea]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'area': return '📚';
      case 'modulo': return '📖';
      case 'tema': return '📝';
      case 'assunto': return '📄';
      default: return '🔍';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'area': return 'Área';
      case 'modulo': return 'Módulo';
      case 'tema': return 'Tema';
      case 'assunto': return 'Assunto';
      default: return '';
    }
  };

  const handleClearFilters = () => {
    setSelectedArea('');
    onSearchChange('');
  };

  const handleAreaChange = (value: string) => {
    setSelectedArea(value === 'all' ? '' : value);
  };

  return (
    <div className="relative mb-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        {/* Filter Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1">
            <Select value={selectedArea || 'all'} onValueChange={handleAreaChange}>
              <SelectTrigger className="w-full bg-netflix-darkGray border-netflix-gray text-netflix-lightGray">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Selecione uma área do direito..." />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-netflix-darkGray border-netflix-gray">
                <SelectItem value="all" className="text-netflix-lightGray hover:bg-netflix-gray">
                  Todas as áreas
                </SelectItem>
                {areas.map(({ area }) => (
                  <SelectItem 
                    key={area} 
                    value={area}
                    className="text-netflix-lightGray hover:bg-netflix-gray"
                  >
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {(selectedArea || searchTerm) && (
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-netflix-gray text-netflix-lightGray rounded-md hover:bg-netflix-gray/80 transition-colors flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Limpar
            </button>
          )}
        </div>

        {/* Search Section */}
        <div className={`relative transition-all duration-300 ${isSearchFocused ? 'transform scale-105' : ''}`}>
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder={selectedArea && selectedArea !== '' ? `Buscar em ${selectedArea}...` : "Selecione uma área primeiro para buscar..."}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            disabled={!selectedArea || selectedArea === ''}
            className="w-full pl-12 pr-12 py-4 bg-netflix-darkGray border border-netflix-gray rounded-xl text-netflix-lightGray placeholder-gray-400 focus:outline-none focus:border-netflix-red focus:ring-1 focus:ring-netflix-red transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-netflix-red transition-colors"
            >
              <X />
            </button>
          )}
        </div>

        {/* Selected Area Indicator */}
        {selectedArea && selectedArea !== '' && (
          <div className="mt-3 flex items-center gap-2 text-sm">
            <span className="text-gray-400">Buscando em:</span>
            <span className="px-3 py-1 bg-netflix-red/20 text-netflix-red rounded-full font-medium">
              {selectedArea}
            </span>
          </div>
        )}

        {/* Search Results */}
        {isSearchFocused && searchResults.length > 0 && selectedArea && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-netflix-darkGray border border-netflix-gray rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto animate-slide-in-top">
            {searchResults.map((result, index) => (
              <div
                key={`${result.type}-${result.title}-${index}`}
                onClick={() => {
                  onResultClick(result);
                  setIsSearchFocused(false);
                }}
                className="flex items-start gap-4 p-4 hover:bg-netflix-gray cursor-pointer transition-all duration-200 border-b border-netflix-gray/30 last:border-b-0 hover:scale-[1.02] transform"
              >
                <div className="text-2xl flex-shrink-0 mt-1">
                  {getTypeIcon(result.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-1 bg-netflix-red/20 text-netflix-red rounded-full font-medium">
                      {getTypeLabel(result.type)}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-netflix-lightGray mb-1 line-clamp-1">
                    {result.title}
                  </h3>
                  
                  {result.subtitle && (
                    <p className="text-sm text-gray-400 mb-2 line-clamp-1">
                      {result.subtitle}
                    </p>
                  )}
                  
                  {result.preview && (
                    <div className="mt-2">
                      <MiniMarkdownRenderer content={result.preview} maxLength={150} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Area Selected Message */}
        {isSearchFocused && !selectedArea && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-netflix-darkGray border border-netflix-gray rounded-xl shadow-2xl z-50 p-6 text-center animate-fade-in">
            <Filter className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Selecione uma área do direito primeiro</p>
            <p className="text-sm text-gray-500 mt-2">Isso ajuda a encontrar resultados mais precisos</p>
          </div>
        )}

        {/* No Results */}
        {isSearchFocused && selectedArea && searchTerm.length >= 2 && searchResults.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-netflix-darkGray border border-netflix-gray rounded-xl shadow-2xl z-50 p-6 text-center animate-fade-in">
            <Search className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Nenhum resultado encontrado em "{selectedArea}"</p>
            <p className="text-sm text-gray-500 mt-2">Tente usar palavras-chave diferentes</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchWithPreview;
