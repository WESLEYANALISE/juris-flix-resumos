
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
      
      // Configuração para funcionar em todos os dispositivos e contextos
      textArea.style.position = 'fixed';
      textArea.style.top = '-999px';
      textArea.style.left = '-999px';
      textArea.style.width = '2em';
      textArea.style.height = '2em';
      textArea.style.padding = '0';
      textArea.style.border = 'none';
      textArea.style.outline = 'none';
      textArea.style.boxShadow = 'none';
      textArea.style.background = 'transparent';
      textArea.style.fontSize = '16px';
      textArea.style.opacity = '0';
      textArea.setAttribute('readonly', '');
      textArea.setAttribute('tabindex', '-1');
      
      document.body.appendChild(textArea);
      
      // Configuração especial para iOS Safari
      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        textArea.contentEditable = 'true';
        textArea.readOnly = false;
        const range = document.createRange();
        range.selectNodeContents(textArea);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
        textArea.setSelectionRange(0, 999999);
      } else {
        textArea.focus();
        textArea.select();
        textArea.setSelectionRange(0, 999999);
      }

      let successful = false;
      try {
        successful = document.execCommand('copy');
      } catch (err) {
        console.warn('Fallback copy failed:', err);
      }

      document.body.removeChild(textArea);
      resolve(successful);
    });
  };

  const modernCopyToClipboard = async (text: string): Promise<boolean> => {
    if (!navigator.clipboard) return false;
    
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('Modern clipboard API failed:', err);
      return false;
    }
  };

  const copyToClipboard = async (text: string): Promise<boolean> => {
    // Tentar primeiro o método moderno (se disponível e em contexto seguro)
    if (!isInIframe && window.isSecureContext) {
      const modernSuccess = await modernCopyToClipboard(text);
      if (modernSuccess) return true;
    }

    // Fallback para todos os casos (mobile, iframe, contexto inseguro)
    const fallbackSuccess = await fallbackCopyTextToClipboard(text);
    if (fallbackSuccess) return true;

    // Última tentativa com clipboard API mesmo em contexto inseguro
    const lastAttempt = await modernCopyToClipboard(text);
    return lastAttempt;
  };

  const showTextModal = (text: string) => {
    // Criar um modal simples para mostrar o texto
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      padding: 20px;
      box-sizing: border-box;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
      background: #1a1a1a;
      border: 1px solid #333;
      border-radius: 8px;
      padding: 20px;
      max-width: 90%;
      max-height: 80%;
      overflow: auto;
      color: white;
    `;

    const title = document.createElement('h3');
    title.textContent = 'Copie o texto abaixo:';
    title.style.marginBottom = '15px';

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.cssText = `
      width: 100%;
      height: 300px;
      padding: 10px;
      background: #333;
      border: 1px solid #555;
      border-radius: 4px;
      color: white;
      font-family: monospace;
      resize: vertical;
    `;
    textarea.readOnly = true;

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Fechar';
    closeBtn.style.cssText = `
      margin-top: 15px;
      padding: 10px 20px;
      background: #e50914;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    `;

    closeBtn.onclick = () => document.body.removeChild(modal);
    modal.onclick = (e) => e.target === modal && document.body.removeChild(modal);

    content.appendChild(title);
    content.appendChild(textarea);
    content.appendChild(closeBtn);
    modal.appendChild(content);
    document.body.appendChild(modal);

    // Selecionar o texto automaticamente
    setTimeout(() => textarea.select(), 100);
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
        // Mostrar modal para cópia manual
        showTextModal(formattedText);
      }
      
    } catch (error) {
      console.error('Erro ao copiar texto:', error);
      const cleanText = removeMarkdown(text);
      const formattedText = `${assunto}\n\n${cleanText}`;
      showTextModal(formattedText);
    } finally {
      setIsAnimating(false);
    }
  };

  return (
    <button 
      onClick={handleCopy}
      onTouchStart={isMobile ? handleCopy : undefined}
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
