
import React from 'react';
import { Heart } from 'lucide-react';

interface FavoriteItem {
  id: string;
  area: string;
  modulo: string;
  tema: string;
  assunto: string;
  assunto_id: number;
  created_at: string;
}

interface FavoritesListProps {
  favorites: FavoriteItem[];
  onSubjectClick: (area: string, modulo: string, tema: string, assunto: string, assuntoId: number) => void;
}

const FavoritesList: React.FC<FavoritesListProps> = ({ favorites, onSubjectClick }) => {
  return (
    <div className="text-center py-12">
      <Heart className="h-16 w-16 text-gray-600 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-netflix-lightGray mb-4">Favoritos</h2>
      <p className="text-gray-400">Sistema de favoritos em desenvolvimento.</p>
      <p className="text-gray-500 text-sm mt-2">
        Em breve você poderá salvar seus resumos favoritos aqui.
      </p>
    </div>
  );
};

export default FavoritesList;
