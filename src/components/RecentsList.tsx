
import { LegalSubject } from '../types/legal';

interface RecentsListProps {
  recents: LegalSubject[];
  onSubjectClick: (subject: LegalSubject) => void;
}

const RecentsList = ({ recents, onSubjectClick }: RecentsListProps) => {
  if (recents.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-netflix-lightGray mb-4">Recentes</h2>
        <p className="text-gray-400">Nenhum item visualizado recentemente.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-netflix-lightGray mb-6">Recentes</h2>
      <div className="space-y-4">
        {recents.map((subject) => (
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
              {subject.lastViewed && (
                <div className="text-gray-500 text-xs ml-4">
                  {subject.lastViewed.toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentsList;
