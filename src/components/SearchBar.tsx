
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const SearchBar = ({ searchTerm, onSearchChange }: SearchBarProps) => {
  return (
    <div className="relative w-full max-w-2xl mx-auto mb-8">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-netflix-lightGray h-5 w-5" />
      <Input
        type="text"
        placeholder="Pesquisar áreas, temas ou assuntos jurídicos..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-12 pr-4 py-3 w-full bg-netflix-darkGray border-netflix-gray text-netflix-lightGray placeholder-gray-400 focus:border-netflix-red focus:ring-netflix-red rounded-lg text-lg"
      />
    </div>
  );
};

export default SearchBar;
