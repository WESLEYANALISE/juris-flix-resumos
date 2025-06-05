
import { LegalSubject } from '../types/legal';

interface SubjectsListProps {
  subjects: LegalSubject[];
  onSubjectClick: (subject: LegalSubject) => void;
  onBack: () => void;
  themeTitle: string;
}

const SubjectsList = ({ subjects, onSubjectClick, onBack, themeTitle }: SubjectsListProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="text-netflix-red hover:text-netflix-darkRed transition-colors"
        >
          ← Voltar
        </button>
        <h2 className="text-2xl font-bold text-netflix-lightGray">{themeTitle}</h2>
      </div>
      
      <div className="space-y-4">
        {subjects.map((subject) => (
          <div
            key={subject.id}
            onClick={() => onSubjectClick(subject)}
            className="bg-netflix-darkGray border border-netflix-gray rounded-lg p-4 cursor-pointer hover:bg-netflix-gray transition-all duration-300 hover:border-netflix-red flex justify-between items-start"
          >
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-netflix-lightGray mb-2">{subject.title}</h3>
              <p className="text-gray-400 text-sm">{subject.summary}</p>
            </div>
            {subject.isFavorite && (
              <div className="text-netflix-red ml-4">★</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectsList;
