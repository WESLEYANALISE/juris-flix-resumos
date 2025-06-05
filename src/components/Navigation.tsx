
import { Heart, Home, Clock } from 'lucide-react';

interface NavigationProps {
  activeTab: 'home' | 'favorites' | 'recent';
  onTabChange: (tab: 'home' | 'favorites' | 'recent') => void;
}

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  return (
    <nav className="flex justify-center gap-2 mb-8">
      <button
        onClick={() => onTabChange('home')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
          activeTab === 'home'
            ? 'bg-netflix-red text-white'
            : 'text-netflix-lightGray hover:text-netflix-red hover:bg-netflix-darkGray'
        }`}
      >
        <Home className="h-4 w-4" />
        <span className="hidden sm:inline">Início</span>
      </button>
      <button
        onClick={() => onTabChange('favorites')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
          activeTab === 'favorites'
            ? 'bg-netflix-red text-white'
            : 'text-netflix-lightGray hover:text-netflix-red hover:bg-netflix-darkGray'
        }`}
      >
        <Heart className="h-4 w-4" />
        <span className="hidden sm:inline">Favoritos</span>
      </button>
      <button
        onClick={() => onTabChange('recent')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
          activeTab === 'recent'
            ? 'bg-netflix-red text-white'
            : 'text-netflix-lightGray hover:text-netflix-red hover:bg-netflix-darkGray'
        }`}
      >
        <Clock className="h-4 w-4" />
        <span className="hidden sm:inline">Recentes</span>
      </button>
    </nav>
  );
};

export default Navigation;
