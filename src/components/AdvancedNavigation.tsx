import { Heart, Home, Clock, Search, Filter, TrendingUp } from 'lucide-react';
import { useState } from 'react';
interface AdvancedNavigationProps {
  activeTab: 'home' | 'favorites' | 'recent' | 'trending';
  onTabChange: (tab: 'home' | 'favorites' | 'recent' | 'trending') => void;
  onFilterToggle: () => void;
  showFilters: boolean;
}
const AdvancedNavigation = ({
  activeTab,
  onTabChange,
  onFilterToggle,
  showFilters
}: AdvancedNavigationProps) => {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const navigationItems = [{
    id: 'home',
    label: 'Início',
    icon: Home,
    description: 'Página principal',
    gradient: 'from-blue-500 to-blue-600'
  }, {
    id: 'favorites',
    label: 'Favoritos',
    icon: Heart,
    description: 'Seus resumos favoritos',
    gradient: 'from-red-500 to-pink-600'
  }, {
    id: 'recent',
    label: 'Recentes',
    icon: Clock,
    description: 'Visualizados recentemente',
    gradient: 'from-green-500 to-emerald-600'
  }, {
    id: 'trending',
    label: 'Populares',
    icon: TrendingUp,
    description: 'Mais acessados',
    gradient: 'from-orange-500 to-red-600'
  }] as const;
  return <div className="space-y-4">
      {/* Navegação principal */}
      <nav className="flex justify-center gap-2 mb-6">
        {navigationItems.map(({
        id,
        label,
        icon: Icon,
        description,
        gradient
      }) => <button key={id} onClick={() => onTabChange(id as any)} onMouseEnter={() => setHoveredTab(id)} onMouseLeave={() => setHoveredTab(null)} className={`group relative flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${activeTab === id ? `bg-gradient-to-r ${gradient} text-white shadow-lg shadow-netflix-red/25` : 'text-netflix-lightGray hover:text-white hover:bg-netflix-darkGray/50 backdrop-blur-sm'}`}>
            <Icon className={`h-4 w-4 transition-transform duration-300 ${activeTab === id ? 'scale-110' : 'group-hover:scale-110'}`} />
            <span className="hidden sm:inline text-sm font-semibold">{label}</span>
            
            {/* Tooltip */}
            {hoveredTab === id && <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-3 py-1 rounded-lg text-xs whitespace-nowrap animate-fade-in">
                {description}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90"></div>
              </div>}
          </button>)}
      </nav>

      {/* Barra de ferramentas secundária */}
      <div className="flex justify-center items-center gap-4 mb-6">
        <button onClick={onFilterToggle} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${showFilters ? 'bg-netflix-red text-white' : 'text-netflix-lightGray hover:text-netflix-red hover:bg-netflix-darkGray'}`}>
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">Filtros</span>
        </button>

        <div className="h-6 w-px bg-netflix-gray"></div>

        
      </div>
    </div>;
};
export default AdvancedNavigation;