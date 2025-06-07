
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

  const fallbackCopyTextToClipboard = (text: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      
      // Estilo para garantir que funcione em todos os dispositivos
      textArea.style.position = 'fixed';
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.width = '2em';
      textArea.style.height = '2em';
      textArea.style.padding = '0';
      textArea.style.border = 'none';
      textArea.style.outline = 'none';
      textArea.style.boxShadow = 'none';
      textArea.style.background = 'transparent';
      textArea.style.fontSize = '16px'; // Previne zoom no iOS
      
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      // Para iOS Safari - configuração especial
      if (navigator.userAgent.match(/ipad|iphone/i)) {
        textArea.contentEditable = 'true';
        textArea.readOnly = false;
        const range = document.createRange();
        range.selectNodeContents(textArea);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
        textArea.setSelectionRange(0, 999999);
      } else {
        textArea.setSelectionRange(0, 999999);
      }

      let successful = false;
      try {
        successful = document.execCommand('copy');
      } catch (err) {
        console.warn('Fallback: Oops, unable to copy', err);
      }

      document.body.removeChild(textArea);
      resolve(successful);
    });
  };

  const copyToClipboard = async (text: string): Promise<boolean> => {
    // Método 1: Clipboard API moderno (quando disponível e em contexto seguro)
    if (navigator.clipboard && window.isSecureContext && !isInIframe) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.warn('Clipboard API failed, trying fallback');
      }
    }

    // Método 2: Fallback para mobile e iframe
    const fallbackSuccess = await fallbackCopyTextToClipboard(text);
    if (fallbackSuccess) {
      return true;
    }

    // Método 3: Última tentativa com Clipboard API (mesmo em contexto inseguro)
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.warn('Final clipboard attempt failed');
      }
    }

    return false;
  };

  const handleCopy = async (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAnimating(true);
    
    try {
      const cleanText = removeMarkdown(text);
      const formattedText = `${assunto}\n\n${cleanText}`;
      
      const success = await copyToClipboard(formattedText);
      
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Se falhou, mostrar o texto em um modal/alert para cópia manual
        if (confirm('Não foi possível copiar automaticamente. Deseja ver o texto para copiar manualmente?')) {
          const newWindow = window.open('', '_blank');
          if (newWindow) {
            newWindow.document.write(`
              <html>
                <head><title>Texto para Copiar</title></head>
                <body style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
                  <h2>Selecione e copie o texto abaixo:</h2>
                  <textarea style="width: 100%; height: 400px; padding: 10px;" readonly>${formattedText}</textarea>
                  <button onclick="window.close()" style="margin-top: 10px; padding: 10px 20px;">Fechar</button>
                </body>
              </html>
            `);
          } else {
            // Fallback para quando popup é bloqueado
            alert(`Texto para copiar:\n\n${formattedText}`);
          }
        }
      }
      
    } catch (error) {
      console.error('Erro ao copiar texto:', error);
      alert('Erro ao copiar. Tente novamente.');
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
