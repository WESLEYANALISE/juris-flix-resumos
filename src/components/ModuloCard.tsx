import React from 'react';
import { BookOpen, ChevronRight } from 'lucide-react';
interface ModuloCardProps {
  numero: string;
  nome: string;
  temasCount: number;
  onClick: () => void;
}
const ModuloCard: React.FC<ModuloCardProps> = ({
  numero,
  nome,
  temasCount,
  onClick
}) => {
  return <div onClick={onClick} className="bg-netflix-darkGray border border-netflix-gray rounded-xl p-6 cursor-pointer hover:bg-netflix-gray transition-all duration-300 hover:border-netflix-red group py-[14px] px-[20px]">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div className="p-3 bg-netflix-red/20 rounded-lg group-hover:bg-netflix-red/30 transition-colors">
            <BookOpen className="h-6 w-6 text-netflix-red" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-netflix-red font-semibold text-sm">
                Módulo {numero}
              </span>
            </div>
            <h3 className="font-semibold text-netflix-lightGray mb-2 line-clamp-2 text-base">
              {nome}
            </h3>
            <p className="text-gray-400 text-sm">
              {temasCount} tema{temasCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-netflix-red transition-colors" />
      </div>
    </div>;
};
export default ModuloCard;