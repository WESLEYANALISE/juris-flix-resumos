
import React from 'react';
import { Clock } from 'lucide-react';

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
  return (
    <div className="text-center py-12">
      <Clock className="h-16 w-16 text-gray-600 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-netflix-lightGray mb-4">Recentes</h2>
      <p className="text-gray-400">Histórico de acessos em desenvolvimento.</p>
      <p className="text-gray-500 text-sm mt-2">
        Em breve você poderá ver os resumos acessados recentemente aqui.
      </p>
    </div>
  );
};

export default RecentsList;
