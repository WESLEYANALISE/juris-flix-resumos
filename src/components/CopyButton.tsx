
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
      
      // Múltiplas tentativas para garantir que funcione em iframe/mobile
      let copySuccess = false;
      
      // Método 1: Clipboard API moderno
      if (navigator.clipboard && window.isSecureContext && !isInIframe) {
        try {
          await navigator.clipboard.writeText(formattedText);
          copySuccess = true;
        } catch (err) {
          console.log('Clipboard API falhou, tentando método alternativo');
        }
      }
      
      // Método 2: Fallback para iframe e mobile
      if (!copySuccess) {
        const textArea = document.createElement('textarea');
        textArea.value = formattedText;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        textArea.style.opacity = '0';
        textArea.style.pointerEvents = 'none';
        textArea.setAttribute('readonly', '');
        textArea.setAttribute('contenteditable', 'true');
        
        document.body.appendChild(textArea);
        
        try {
          // Para iOS Safari
          if (navigator.userAgent.match(/ipad|iphone/i)) {
            const range = document.createRange();
            range.selectNodeContents(textArea);
            const selection = window.getSelection();
            selection?.removeAllRanges();
            selection?.addRange(range);
            textArea.setSelectionRange(0, 999999);
          } else {
            textArea.select();
            textArea.setSelectionRange(0, 999999);
          }
          
          copySuccess = document.execCommand('copy');
        } catch (err) {
          console.error('Método execCommand falhou:', err);
        } finally {
          document.body.removeChild(textArea);
        }
      }
      
      // Método 3: Tentativa final com seleção manual
      if (!copySuccess && navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(formattedText);
          copySuccess = true;
        } catch (err) {
          console.error('Terceira tentativa falhou:', err);
        }
      }
      
      if (copySuccess) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        throw new Error('Falha em todos os métodos de cópia');
      }
      
    } catch (error) {
      console.error('Erro ao copiar texto:', error);
      // Mostrar mensagem mais amigável
      alert('Não foi possível copiar automaticamente. Tente selecionar o texto manualmente.');
    } finally {
      setIsAnimating(false);
    }
  };

  return (
    <button 
      onClick={handleCopy}
      onTouchStart={handleCopy}
      title={copied ? 'Texto copiado!' : 'Copiar resumo'} 
      className={`
        p-3 rounded-lg transition-all duration-200 
        transform active:scale-95 touch-manipulation select-none
        ${isAnimating ? 'animate-pulse scale-110' : 'hover:scale-105'}
        ${copied 
          ? 'text-green-400 bg-green-500/20 border border-green-500/30' 
          : 'text-netflix-lightGray bg-netflix-red/10 hover:bg-netflix-red/20 border border-netflix-red/30 hover:border-netflix-red/50'
        }
      `}
      style={{ 
        WebkitTapHighlightColor: 'transparent',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      }}
      aria-label={copied ? 'Texto copiado!' : 'Copiar resumo'}
    >
      <div className="flex items-center gap-2">
        {copied ? (
          <Check className={`h-4 w-4 ${isAnimating ? 'animate-bounce' : ''}`} />
        ) : (
          <Copy className={`h-4 w-4 ${isAnimating ? 'animate-pulse' : ''}`} />
        )}
        <span className="text-sm font-medium">
          {copied ? 'Copiado!' : 'Copiar'}
        </span>
      </div>
    </button>
  );
};

export default CopyButton;
