
import React from 'react';
import { Clock, ExternalLink } from 'lucide-react';

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
  if (recents.length === 0) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <Clock className="h-16 w-16 text-gray-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-netflix-lightGray mb-4">Recentes</h2>
        <p className="text-gray-400">Você ainda não acessou nenhum resumo.</p>
        <p className="text-gray-500 text-sm mt-2">
          Os resumos que você acessar aparecerão aqui para acesso rápido.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <Clock className="h-12 w-12 text-netflix-red mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-netflix-lightGray">Acessados Recentemente</h2>
        <p className="text-gray-400">{recents.length} resumos recentes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {recents.map((recent, index) => (
          <div
            key={recent.id}
            className="bg-netflix-darkGray border border-netflix-gray rounded-xl p-6 hover:border-netflix-red/50 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-2xl hover:shadow-netflix-red/20 animate-slide-in-up group"
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => onSubjectClick(
              recent.area,
              recent.modulo,
              recent.tema,
              recent.assunto,
              recent.assunto_id
            )}
          >
            <div className="flex items-start justify-between mb-4">
              <Clock className="h-5 w-5 text-netflix-red flex-shrink-0 mt-1" />
              <ExternalLink className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            <h3 className="text-lg font-semibold text-netflix-lightGray mb-2 line-clamp-2">
              {recent.assunto}
            </h3>
            
            <div className="text-sm text-gray-400 space-y-1">
              <p>{recent.area}</p>
              <p className="text-xs">{recent.modulo} › {recent.tema}</p>
            </div>
            
            <div className="mt-4 text-xs text-gray-500">
              Acessado {new Date(recent.accessed_at).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentsList;
