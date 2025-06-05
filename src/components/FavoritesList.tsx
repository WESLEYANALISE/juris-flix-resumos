
import { LegalSubject } from '../types/legal';

interface FavoritesListProps {
  favorites: LegalSubject[];
  onSubjectClick: (subject: LegalSubject) => void;
}

const FavoritesList = ({ favorites, onSubjectClick }: FavoritesListProps) => {
  if (favorites.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-netflix-lightGray mb-4">Favoritos</h2>
        <p className="text-gray-400">Nenhum item favoritado ainda.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-netflix-lightGray mb-6">Favoritos</h2>
      <div className="space-y-4">
        {favorites.map((subject) => (
          <div
            key={subject.id}
            onClick={() => onSubjectClick(subject)}
            className="bg-netflix-darkGray border border-netflix-gray rounded-lg p-4 cursor-pointer hover:bg-netflix-gray transition-all duration-300 hover:border-netflix-red"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-netflix-lightGray mb-2">{subject.title}</h3>
                <p className="text-gray-400 text-sm">{subject.summary}</p>
              </div>
              <div className="text-netflix-red ml-4">★</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesList;
