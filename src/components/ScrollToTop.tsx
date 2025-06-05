
import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScrollToTopProps {
  className?: string;
}

const ScrollToTop = ({ className }: ScrollToTopProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-6 left-6 bg-netflix-red hover:bg-netflix-darkRed",
        "text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50",
        "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-netflix-red focus:ring-offset-2",
        className
      )}
      aria-label="Voltar ao topo"
    >
      <ChevronUp className="h-5 w-5" />
    </button>
  );
};

export default ScrollToTop;
