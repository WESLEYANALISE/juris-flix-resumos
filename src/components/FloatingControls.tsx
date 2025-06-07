
import React, { useState } from 'react';
import { ArrowUp, Type } from 'lucide-react';

interface FloatingControlsProps {
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  onScrollToTop: () => void;
  showScrollButton: boolean;
}

const FloatingControls: React.FC<FloatingControlsProps> = ({
  fontSize,
  onFontSizeChange,
  onScrollToTop,
  showScrollButton
}) => {
  const [showFontControls, setShowFontControls] = useState(false);

  const adjustFontSize = (increment: number) => {
    const newSize = Math.max(12, Math.min(24, fontSize + increment));
    onFontSizeChange(newSize);
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40 items-end">
      {/* Font Control - Now with red styling */}
      <div className="relative">
        <button
          onClick={() => setShowFontControls(!showFontControls)}
          className="w-12 h-12 bg-netflix-red border border-netflix-red rounded-full flex items-center justify-center shadow-xl hover:bg-netflix-darkRed transition-colors"
        >
          <Type className="h-5 w-5 text-white" />
        </button>
        
        {showFontControls && (
          <div className="absolute bottom-14 right-0 bg-netflix-darkGray border border-netflix-gray rounded-lg p-3 shadow-xl min-w-[120px]">
            <div className="flex items-center gap-2 mb-2">
              <Type className="h-4 w-4 text-netflix-lightGray" />
              <span className="text-sm text-netflix-lightGray font-medium">Fonte</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => adjustFontSize(-1)}
                className="w-8 h-8 bg-netflix-gray hover:bg-netflix-red text-netflix-lightGray rounded flex items-center justify-center transition-colors"
              >
                -
              </button>
              <span className="text-sm text-netflix-lightGray min-w-[2rem] text-center">
                {fontSize}
              </span>
              <button
                onClick={() => adjustFontSize(1)}
                className="w-8 h-8 bg-netflix-gray hover:bg-netflix-red text-netflix-lightGray rounded flex items-center justify-center transition-colors"
              >
                +
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Scroll to Top Button */}
      {showScrollButton && (
        <button
          onClick={onScrollToTop}
          className="w-12 h-12 bg-netflix-red hover:bg-netflix-darkRed text-white rounded-full flex items-center justify-center shadow-xl transition-all transform hover:scale-105"
        >
          <ArrowUp className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default FloatingControls;
