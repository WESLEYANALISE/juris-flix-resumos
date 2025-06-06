
import React from 'react';
import { Heart, Clock } from 'lucide-react';

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
      <div className="text-center py-12">
        <Heart className="h-16 w-16 text-gray-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-netflix-lightGray mb-4">Favoritos</h2>
        <p className="text-gray-400">Nenhum item favoritado ainda.</p>
        <p className="text-gray-500 text-sm mt-2">
          Clique no ❤️ ao visualizar um resumo para adicioná-lo aos favoritos.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-netflix-lightGray mb-6 flex items-center gap-2">
        <Heart className="h-6 w-6 text-netflix-red fill-current" />
        Favoritos ({favorites.length})
      </h2>
      <div className="space-y-4">
        {favorites.map((favorite) => (
          <div
            key={favorite.id}
            onClick={() => onSubjectClick(
              favorite.area,
              favorite.modulo,
              favorite.tema,
              favorite.assunto,
              favorite.assunto_id
            )}
            className="bg-netflix-darkGray border border-netflix-gray rounded-lg p-4 cursor-pointer hover:bg-netflix-gray transition-all duration-300 hover:border-netflix-red"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-netflix-lightGray mb-2">
                  {favorite.assunto}
                </h3>
                <div className="text-gray-400 text-sm mb-2">
                  <span>{favorite.area}</span>
                  <span className="mx-1">›</span>
                  <span>{favorite.modulo}</span>
                  <span className="mx-1">›</span>
                  <span>{favorite.tema}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500 text-xs">
                  <Clock className="h-3 w-3" />
                  <span>
                    Favoritado em {new Date(favorite.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
              <div className="text-netflix-red ml-4">
                <Heart className="h-5 w-5 fill-current" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesList;
