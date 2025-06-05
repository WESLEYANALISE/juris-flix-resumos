import React from 'react';
import { ChevronRight } from 'lucide-react';
interface TemaCardProps {
  tema: string;
  assuntosCount: number;
  onClick: () => void;
}
const TemaCard: React.FC<TemaCardProps> = ({
  tema,
  assuntosCount,
  onClick
}) => {
  return <button onClick={onClick} className="w-full p-5 bg-netflix-darkGray border border-netflix-gray rounded-lg hover:border-netflix-red hover:bg-netflix-gray transition-all duration-300 text-left group">
      <div className="flex items-center justify-between px-0 py-[15px]">
        <div>
          <h4 className="text-base font-medium text-netflix-lightGray mb-1 group-hover:text-white">
            {tema}
          </h4>
          <p className="text-gray-400 text-sm">
            {assuntosCount} assunto{assuntosCount !== 1 ? 's' : ''}
          </p>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-netflix-red transition-colors" />
      </div>
    </button>;
};
export default TemaCard;