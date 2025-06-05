
import React from 'react';
import { FileText } from 'lucide-react';

interface AssuntoCardProps {
  assunto: string;
  onClick: () => void;
}

const AssuntoCard: React.FC<AssuntoCardProps> = ({ assunto, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full p-4 bg-netflix-darkGray border border-netflix-gray rounded-lg hover:border-netflix-red hover:bg-netflix-gray transition-all duration-300 text-left group"
    >
      <div className="flex items-center gap-3">
        <FileText className="h-5 w-5 text-netflix-red flex-shrink-0" />
        <span className="text-netflix-lightGray group-hover:text-white font-medium text-sm">
          {assunto}
        </span>
      </div>
    </button>
  );
};

export default AssuntoCard;
