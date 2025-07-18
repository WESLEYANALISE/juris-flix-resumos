
import React, { useState } from 'react';
import { BookOpen, X } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';

interface FloatingGlossaryProps {
  content: string;
}

const FloatingGlossary: React.FC<FloatingGlossaryProps> = ({
  content
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!content || content.trim() === '') {
    return null;
  }

  return (
    <>
      {/* Floating Button - Now aligned with other controls */}
      <button
        onClick={() => setIsOpen(true)}
        title="Abrir Glossário"
        className="w-12 h-12 bg-netflix-red hover:bg-netflix-darkRed text-white rounded-full flex items-center justify-center shadow-xl transition-all transform hover:scale-105"
      >
        <BookOpen className="h-5 w-5" />
      </button>

      {/* Glossary Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-netflix-darkGray border border-netflix-gray rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-netflix-gray">
              <div className="flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-netflix-red" />
                <h2 className="text-xl font-bold text-netflix-lightGray">Glossário</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-netflix-red transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
              <MarkdownRenderer content={content} fontSize={15} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingGlossary;
