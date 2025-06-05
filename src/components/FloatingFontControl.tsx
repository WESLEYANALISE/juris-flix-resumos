
import React from 'react';
import { Plus, Minus, Type } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingFontControlProps {
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  className?: string;
}

const FloatingFontControl = ({ fontSize, onFontSizeChange, className }: FloatingFontControlProps) => {
  const increaseFontSize = () => {
    if (fontSize < 24) {
      onFontSizeChange(fontSize + 1);
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > 12) {
      onFontSizeChange(fontSize - 1);
    }
  };

  return (
    <div className={cn(
      "fixed bottom-6 right-6 bg-netflix-darkGray border border-netflix-gray rounded-lg p-2 shadow-lg z-50",
      "flex items-center gap-2",
      className
    )}>
      <Type className="h-4 w-4 text-netflix-lightGray" />
      <button
        onClick={decreaseFontSize}
        disabled={fontSize <= 12}
        className="p-1 rounded hover:bg-netflix-gray disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Minus className="h-4 w-4 text-netflix-lightGray" />
      </button>
      <span className="text-sm text-netflix-lightGray min-w-[2rem] text-center">
        {fontSize}px
      </span>
      <button
        onClick={increaseFontSize}
        disabled={fontSize >= 24}
        className="p-1 rounded hover:bg-netflix-gray disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Plus className="h-4 w-4 text-netflix-lightGray" />
      </button>
    </div>
  );
};

export default FloatingFontControl;
