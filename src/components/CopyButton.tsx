
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

  const copyToClipboard = async (text: string): Promise<boolean> => {
    // Método principal: execCommand (funciona em todos os contextos)
    const fallbackCopyTextToClipboard = (text: string): boolean => {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      
      // Configurações para máxima compatibilidade
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
      textArea.style.opacity = '0';
      textArea.style.pointerEvents = 'none';
      textArea.setAttribute('readonly', '');
      textArea.setAttribute('contenteditable', 'true');
      
      document.body.appendChild(textArea);
      
      try {
        textArea.focus();
        textArea.select();
        
        // Configuração especial para iOS
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
          const range = document.createRange();
          range.selectNodeContents(textArea);
          const selection = window.getSelection();
          selection?.removeAllRanges();
          selection?.addRange(range);
          textArea.setSelectionRange(0, 999999);
        } else {
          textArea.setSelectionRange(0, 999999);
        }

        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        return successful;
      } catch (err) {
        document.body.removeChild(textArea);
        return false;
      }
    };

    // Tenta primeiro o método moderno (se disponível e em contexto seguro)
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        // Se falhar, usa o fallback
        return fallbackCopyTextToClipboard(text);
      }
    }

    // Usa diretamente o fallback para iframe e contextos inseguros
    return fallbackCopyTextToClipboard(text);
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
        // Fallback final: prompt do usuário
        const userAgent = navigator.userAgent.toLowerCase();
        const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
        
        if (isMobile) {
          // Para mobile, usa alert com texto selecionável
          setTimeout(() => {
            prompt('Texto para copiar (Ctrl+C ou Cmd+C):', formattedText);
          }, 100);
        } else {
          // Para desktop, abre nova janela
          const newWindow = window.open('', '_blank', 'width=600,height=400');
          if (newWindow) {
            newWindow.document.write(`
              <html>
                <head>
                  <title>Texto para Copiar</title>
                  <style>
                    body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
                    textarea { width: 100%; height: 300px; padding: 10px; font-size: 14px; }
                    button { margin-top: 10px; padding: 10px 20px; font-size: 16px; }
                  </style>
                </head>
                <body>
                  <h2>Selecione e copie o texto abaixo:</h2>
                  <textarea readonly onclick="this.select()">${formattedText}</textarea>
                  <br>
                  <button onclick="window.close()">Fechar</button>
                  <script>
                    document.querySelector('textarea').select();
                  </script>
                </body>
              </html>
            `);
          }
        }
      }
      
    } catch (error) {
      console.error('Erro ao copiar texto:', error);
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
