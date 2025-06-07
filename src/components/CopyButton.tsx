
import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  assunto: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  assunto
}) => {
  const [copied, setCopied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const removeMarkdown = (text: string): string => {
    return text
      .replace(/#{1,6}\s+/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`(.*?)`/g, '$1')
      .replace(/>\s+/g, '')
      .replace(/^[-*+]\s+/gm, '')
      .replace(/^\d+\.\s+/gm, '')
      .replace(/\n\s*\n/g, '\n\n')
      .trim();
  };

  const isInIframe = window !== window.parent;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const handleCopy = async (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAnimating(true);
    
    try {
      const cleanText = removeMarkdown(text);
      const formattedText = `${assunto}\n\n${cleanText}`;
      
      // Try different copy methods for iframe/mobile compatibility
      if (isInIframe || isMobile) {
        // For iframe/mobile, use fallback methods
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(formattedText);
        } else {
          // Fallback for iframe/mobile
          const textArea = document.createElement('textarea');
          textArea.value = formattedText;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          
          try {
            document.execCommand('copy');
          } catch (err) {
            console.error('Fallback copy failed:', err);
            throw err;
          } finally {
            document.body.removeChild(textArea);
          }
        }
      } else {
        await navigator.clipboard.writeText(formattedText);
      }
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar texto:', error);
      // Show user-friendly error
      alert('Não foi possível copiar o texto. Tente selecionar e copiar manualmente.');
    } finally {
      setIsAnimating(false);
    }
  };

  return (
    <button 
      onClick={handleCopy}
      onTouchStart={handleCopy}
      title={copied ? 'Texto copiado!' : 'Copiar texto'} 
      className={`
        p-2 rounded-full transition-all duration-200 
        hover:bg-netflix-gray/20 transform active:scale-95
        touch-manipulation select-none
        ${isAnimating ? 'animate-pulse scale-110' : 'hover:scale-105'}
        ${copied ? 'text-green-500' : 'text-gray-400 hover:text-netflix-lightGray'}
      `}
      style={{ 
        WebkitTapHighlightColor: 'transparent',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      }}
      aria-label={copied ? 'Texto copiado!' : 'Copiar texto'}
    >
      {copied ? (
        <Check className={`h-4 w-4 ${isAnimating ? 'animate-bounce' : ''}`} />
      ) : (
        <Copy className={`h-4 w-4 ${isAnimating ? 'animate-pulse' : ''}`} />
      )}
    </button>
  );
};

export default CopyButton;
