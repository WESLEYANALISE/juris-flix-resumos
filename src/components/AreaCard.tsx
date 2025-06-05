
import { LegalArea } from '../types/legal';

interface AreaCardProps {
  area: LegalArea;
  onClick: () => void;
}

const AreaCard = ({ area, onClick }: AreaCardProps) => {
  return (
    <div
      onClick={onClick}
      className="bg-netflix-darkGray border border-netflix-gray rounded-lg p-6 cursor-pointer hover:bg-netflix-gray transition-all duration-300 hover:border-netflix-red group"
    >
      <div className="text-4xl mb-4">{area.icon}</div>
      <h3 className="text-xl font-semibold text-netflix-lightGray mb-2 group-hover:text-netflix-red transition-colors">
        {area.title}
      </h3>
      <p className="text-gray-400 text-sm">{area.description}</p>
      <div className="mt-4 text-netflix-red text-sm">
        {area.themes.length} tema(s) disponível(veis)
      </div>
    </div>
  );
};

export default AreaCard;
