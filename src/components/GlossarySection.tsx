
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

interface GlossarySectionProps {
  content: string;
}

const GlossarySection: React.FC<GlossarySectionProps> = ({ content }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!content || content.trim() === '') {
    return null;
  }

  return (
    <div className="mt-6 bg-netflix-darkGray/50 border border-netflix-gray rounded-xl overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-netflix-gray/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <BookOpen className="h-5 w-5 text-netflix-red" />
          <span className="text-lg font-semibold text-netflix-lightGray">Glossário</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </button>
      
      {isExpanded && (
        <div className="p-4 pt-0 border-t border-netflix-gray/30">
          <div className="prose prose-invert max-w-none">
            <div 
              className="text-gray-300 leading-relaxed whitespace-pre-wrap"
              style={{ fontSize: '15px' }}
            >
              {content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlossarySection;
