
import { useState } from 'react';
import { X, ChevronDown, CheckCircle } from 'lucide-react';
import { useResumosOptimized } from '../hooks/useResumosOptimized';

interface AdvancedFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onFiltersChange: (filters: FilterState) => void;
}

export interface FilterState {
  selectedAreas: string[];
  selectedModulos: string[];
  selectedTemas: string[];
  searchTerm: string;
  sortBy: 'title' | 'area' | 'recent';
  sortOrder: 'asc' | 'desc';
}

const AdvancedFilters = ({ isOpen, onClose, onFiltersChange }: AdvancedFiltersProps) => {
  const { getAreas, getModulosByArea } = useResumosOptimized();
  const [filters, setFilters] = useState<FilterState>({
    selectedAreas: [],
    selectedModulos: [],
    selectedTemas: [],
    searchTerm: '',
    sortBy: 'title',
    sortOrder: 'asc'
  });

  const [expandedSections, setExpandedSections] = useState({
    areas: true,
    modulos: false,
    temas: false,
    sorting: false
  });

  const areas = getAreas();

  const handleAreaToggle = (area: string) => {
    const newSelectedAreas = filters.selectedAreas.includes(area)
      ? filters.selectedAreas.filter(a => a !== area)
      : [...filters.selectedAreas, area];
    
    const newFilters = { ...filters, selectedAreas: newSelectedAreas };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const newFilters: FilterState = {
      selectedAreas: [],
      selectedModulos: [],
      selectedTemas: [],
      searchTerm: '',
      sortBy: 'title',
      sortOrder: 'asc'
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
      <div className="bg-netflix-darkGray border border-netflix-gray rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden animate-slide-in-bottom">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-netflix-gray">
          <h2 className="text-2xl font-bold text-netflix-lightGray">Filtros Avançados</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-netflix-red transition-colors rounded-lg hover:bg-netflix-gray"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
          {/* Áreas do Direito */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection('areas')}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-lg font-semibold text-netflix-lightGray">Áreas do Direito</h3>
              <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${
                expandedSections.areas ? 'rotate-180' : ''
              }`} />
            </button>
            
            {expandedSections.areas && (
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {areas.map(({ area, resumosCount }) => (
                  <button
                    key={area}
                    onClick={() => handleAreaToggle(area)}
                    className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 ${
                      filters.selectedAreas.includes(area)
                        ? 'bg-netflix-red/20 border border-netflix-red text-netflix-red'
                        : 'bg-netflix-gray/30 hover:bg-netflix-gray/50 text-netflix-lightGray'
                    }`}
                  >
                    <CheckCircle className={`h-4 w-4 ${
                      filters.selectedAreas.includes(area) ? 'text-netflix-red' : 'text-gray-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{area}</div>
                      <div className="text-xs text-gray-400">{resumosCount} resumos</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Ordenação */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection('sorting')}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-lg font-semibold text-netflix-lightGray">Ordenação</h3>
              <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${
                expandedSections.sorting ? 'rotate-180' : ''
              }`} />
            </button>
            
            {expandedSections.sorting && (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'title', label: 'Título' },
                    { value: 'area', label: 'Área' },
                    { value: 'recent', label: 'Recente' }
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => {
                        const newFilters = { ...filters, sortBy: value as any };
                        setFilters(newFilters);
                        onFiltersChange(newFilters);
                      }}
                      className={`p-3 rounded-xl text-sm font-medium transition-all ${
                        filters.sortBy === value
                          ? 'bg-netflix-red text-white'
                          : 'bg-netflix-gray/30 text-netflix-lightGray hover:bg-netflix-gray/50'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'asc', label: 'Crescente' },
                    { value: 'desc', label: 'Decrescente' }
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => {
                        const newFilters = { ...filters, sortOrder: value as any };
                        setFilters(newFilters);
                        onFiltersChange(newFilters);
                      }}
                      className={`p-3 rounded-xl text-sm font-medium transition-all ${
                        filters.sortOrder === value
                          ? 'bg-netflix-red text-white'
                          : 'bg-netflix-gray/30 text-netflix-lightGray hover:bg-netflix-gray/50'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-netflix-gray">
          <button
            onClick={clearAllFilters}
            className="px-4 py-2 text-gray-400 hover:text-netflix-lightGray transition-colors"
          >
            Limpar Filtros
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-netflix-gray text-netflix-lightGray rounded-lg hover:bg-netflix-gray/80 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-netflix-red text-white rounded-lg hover:bg-netflix-darkRed transition-colors"
            >
              Aplicar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters;
