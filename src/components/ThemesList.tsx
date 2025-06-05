
import { LegalTheme } from '../types/legal';

interface ThemesListProps {
  themes: LegalTheme[];
  onThemeClick: (theme: LegalTheme) => void;
  onBack: () => void;
  areaTitle: string;
}

const ThemesList = ({ themes, onThemeClick, onBack, areaTitle }: ThemesListProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="text-netflix-red hover:text-netflix-darkRed transition-colors"
        >
          ← Voltar
        </button>
        <h2 className="text-2xl font-bold text-netflix-lightGray">{areaTitle}</h2>
      </div>
      
      {themes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">Conteúdo em desenvolvimento...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {themes.map((theme) => (
            <div
              key={theme.id}
              onClick={() => onThemeClick(theme)}
              className="bg-netflix-darkGray border border-netflix-gray rounded-lg p-4 cursor-pointer hover:bg-netflix-gray transition-all duration-300 hover:border-netflix-red"
            >
              <h3 className="text-lg font-semibold text-netflix-lightGray mb-2">{theme.title}</h3>
              <p className="text-gray-400 text-sm mb-3">{theme.description}</p>
              <div className="text-netflix-red text-sm">
                {theme.subjects.length} assunto(s)
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemesList;
