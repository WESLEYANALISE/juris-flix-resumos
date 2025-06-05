
interface NavigationProps {
  activeTab: 'home' | 'favorites' | 'recent';
  onTabChange: (tab: 'home' | 'favorites' | 'recent') => void;
}

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  return (
    <nav className="flex justify-center gap-8 mb-8">
      <button
        onClick={() => onTabChange('home')}
        className={`px-6 py-3 rounded-lg font-medium transition-colors ${
          activeTab === 'home'
            ? 'bg-netflix-red text-white'
            : 'text-netflix-lightGray hover:text-netflix-red'
        }`}
      >
        Início
      </button>
      <button
        onClick={() => onTabChange('favorites')}
        className={`px-6 py-3 rounded-lg font-medium transition-colors ${
          activeTab === 'favorites'
            ? 'bg-netflix-red text-white'
            : 'text-netflix-lightGray hover:text-netflix-red'
        }`}
      >
        Favoritos
      </button>
      <button
        onClick={() => onTabChange('recent')}
        className={`px-6 py-3 rounded-lg font-medium transition-colors ${
          activeTab === 'recent'
            ? 'bg-netflix-red text-white'
            : 'text-netflix-lightGray hover:text-netflix-red'
        }`}
      >
        Recentes
      </button>
    </nav>
  );
};

export default Navigation;
