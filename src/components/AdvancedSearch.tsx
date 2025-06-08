
import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchFilters {
  area?: string;
  modulo?: string;
  tema?: string;
}

interface AdvancedSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  availableAreas: string[];
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  searchTerm,
  onSearchChange,
  filters,
  onFiltersChange,
  availableAreas
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(value => value);

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 space-y-4">
      {/* Barra de pesquisa principal */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-netflix-lightGray h-5 w-5" />
        <Input
          type="text"
          placeholder="Pesquisar resumos, temas, assuntos..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-12 pr-16 py-3 w-full bg-netflix-darkGray border-netflix-gray text-netflix-lightGray placeholder-gray-400 focus:border-netflix-red focus:ring-netflix-red rounded-lg text-lg"
        />
        <Button
          onClick={() => setShowFilters(!showFilters)}
          variant="ghost"
          size="sm"
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${hasActiveFilters ? 'text-netflix-red' : 'text-netflix-lightGray'}`}
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Filtros avançados */}
      {showFilters && (
        <div className="bg-netflix-darkGray border border-netflix-gray rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-netflix-lightGray">Filtros Avançados</h3>
            {hasActiveFilters && (
              <Button
                onClick={clearFilters}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-netflix-red"
              >
                <X className="h-4 w-4 mr-2" />
                Limpar Filtros
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Área do Direito
              </label>
              <select
                value={filters.area || ''}
                onChange={(e) => onFiltersChange({ ...filters, area: e.target.value || undefined })}
                className="w-full bg-netflix-gray border border-netflix-gray rounded-lg px-3 py-2 text-netflix-lightGray focus:border-netflix-red focus:ring-netflix-red"
              >
                <option value="">Todas as áreas</option>
                {availableAreas.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Módulo
              </label>
              <Input
                type="text"
                placeholder="Nome do módulo..."
                value={filters.modulo || ''}
                onChange={(e) => onFiltersChange({ ...filters, modulo: e.target.value || undefined })}
                className="bg-netflix-gray border-netflix-gray text-netflix-lightGray focus:border-netflix-red focus:ring-netflix-red"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Tema
              </label>
              <Input
                type="text"
                placeholder="Nome do tema..."
                value={filters.tema || ''}
                onChange={(e) => onFiltersChange({ ...filters, tema: e.target.value || undefined })}
                className="bg-netflix-gray border-netflix-gray text-netflix-lightGray focus:border-netflix-red focus:ring-netflix-red"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;
