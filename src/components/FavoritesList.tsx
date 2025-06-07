
import React from 'react';
import { Heart, ExternalLink } from 'lucide-react';

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
  if (favorites.length === 0) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <Heart className="h-16 w-16 text-gray-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-netflix-lightGray mb-4">Favoritos</h2>
        <p className="text-gray-400">Você ainda não possui resumos favoritos.</p>
        <p className="text-gray-500 text-sm mt-2">
          Clique no ❤️ nos resumos para adicioná-los aos seus favoritos.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <Heart className="h-12 w-12 text-netflix-red mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-netflix-lightGray">Seus Favoritos</h2>
        <p className="text-gray-400">{favorites.length} resumos salvos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {favorites.map((favorite, index) => (
          <div
            key={favorite.id}
            className="bg-netflix-darkGray border border-netflix-gray rounded-xl p-6 hover:border-netflix-red/50 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-2xl hover:shadow-netflix-red/20 animate-slide-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => onSubjectClick(
              favorite.area,
              favorite.modulo,
              favorite.tema,
              favorite.assunto,
              favorite.assunto_id
            )}
          >
            <div className="flex items-start justify-between mb-4">
              <Heart className="h-5 w-5 text-netflix-red fill-current flex-shrink-0 mt-1" />
              <ExternalLink className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            <h3 className="text-lg font-semibold text-netflix-lightGray mb-2 line-clamp-2">
              {favorite.assunto}
            </h3>
            
            <div className="text-sm text-gray-400 space-y-1">
              <p>{favorite.area}</p>
              <p className="text-xs">{favorite.modulo} › {favorite.tema}</p>
            </div>
            
            <div className="mt-4 text-xs text-gray-500">
              Favoritado em {new Date(favorite.created_at).toLocaleDateString('pt-BR')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesList;
