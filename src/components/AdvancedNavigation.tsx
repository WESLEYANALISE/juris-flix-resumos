
import { Heart, Home, Clock, Filter } from 'lucide-react';
import { useState } from 'react';

interface AdvancedNavigationProps {
  activeTab: 'home' | 'favorites' | 'recent';
  onTabChange: (tab: 'home' | 'favorites' | 'recent') => void;
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
  }] as const;

  return (
    <div className="space-y-4">
      {/* Navegação principal */}
      <nav className="flex justify-center gap-2 mb-6">
        {navigationItems.map(({ id, label, icon: Icon, description, gradient }) => (
          <button
            key={id}
            onClick={() => onTabChange(id as any)}
            onMouseEnter={() => setHoveredTab(id)}
            onMouseLeave={() => setHoveredTab(null)}
            className={`group relative flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
              activeTab === id
                ? `bg-gradient-to-r ${gradient} text-white shadow-lg shadow-netflix-red/25`
                : 'text-netflix-lightGray hover:text-white hover:bg-netflix-darkGray/50 backdrop-blur-sm'
            }`}
          >
            <Icon className={`h-4 w-4 transition-transform duration-300 ${
              activeTab === id ? 'scale-110' : 'group-hover:scale-110'
            }`} />
            <span className="hidden sm:inline text-sm font-semibold">{label}</span>
            
            {/* Tooltip */}
            {hoveredTab === id && (
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-3 py-1 rounded-lg text-xs whitespace-nowrap animate-fade-in">
                {description}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90"></div>
              </div>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default AdvancedNavigation;
