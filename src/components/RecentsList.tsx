
import React from 'react';
import { Clock, BookOpen } from 'lucide-react';

interface RecentItem {
  id: string;
  area: string;
  modulo: string;
  tema: string;
  assunto: string;
  assunto_id: number;
  accessed_at: string;
}

interface RecentsListProps {
  recents: RecentItem[];
  onSubjectClick: (area: string, modulo: string, tema: string, assunto: string, assuntoId: number) => void;
}

const RecentsList: React.FC<RecentsListProps> = ({ recents, onSubjectClick }) => {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Agora mesmo';
    if (diffInMinutes < 60) return `${diffInMinutes} min atrás`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d atrás`;
    
    return date.toLocaleDateString('pt-BR');
  };

  if (recents.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="h-16 w-16 text-gray-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-netflix-lightGray mb-4">Recentes</h2>
        <p className="text-gray-400">Nenhum item visualizado recentemente.</p>
        <p className="text-gray-500 text-sm mt-2">
          Os resumos que você acessar aparecerão aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-netflix-lightGray mb-6 flex items-center gap-2">
        <Clock className="h-6 w-6 text-netflix-red" />
        Recentes ({recents.length})
      </h2>
      <div className="space-y-4">
        {recents.map((recent) => (
          <div
            key={recent.id}
            onClick={() => onSubjectClick(
              recent.area,
              recent.modulo,
              recent.tema,
              recent.assunto,
              recent.assunto_id
            )}
            className="bg-netflix-darkGray border border-netflix-gray rounded-lg p-4 cursor-pointer hover:bg-netflix-gray transition-all duration-300 hover:border-netflix-red"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-netflix-lightGray mb-2">
                  {recent.assunto}
                </h3>
                <div className="text-gray-400 text-sm mb-2">
                  <span>{recent.area}</span>
                  <span className="mx-1">›</span>
                  <span>{recent.modulo}</span>
                  <span className="mx-1">›</span>
                  <span>{recent.tema}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500 text-xs">
                  <Clock className="h-3 w-3" />
                  <span>{formatTimeAgo(recent.accessed_at)}</span>
                </div>
              </div>
              <div className="text-gray-400 ml-4">
                <BookOpen className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentsList;
