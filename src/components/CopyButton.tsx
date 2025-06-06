
import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  assunto: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ text, assunto }) => {
  const [copied, setCopied] = useState(false);

  const removeMarkdown = (text: string): string => {
    return text
      // Remove headers
      .replace(/#{1,6}\s+/g, '')
      // Remove bold
      .replace(/\*\*(.*?)\*\*/g, '$1')
      // Remove italic
      .replace(/\*(.*?)\*/g, '$1')
      // Remove inline code
      .replace(/`(.*?)`/g, '$1')
      // Remove blockquotes
      .replace(/>\s+/g, '')
      // Remove list markers
      .replace(/^[-*+]\s+/gm, '')
      // Remove numbered list markers
      .replace(/^\d+\.\s+/gm, '')
      // Clean up extra whitespace
      .replace(/\n\s*\n/g, '\n\n')
      .trim();
  };

  const handleCopy = async () => {
    try {
      const cleanText = removeMarkdown(text);
      const formattedText = `${assunto}\n\n${cleanText}`;
      
      await navigator.clipboard.writeText(formattedText);
      setCopied(true);
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar texto:', error);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 px-4 py-2 bg-netflix-darkGray hover:bg-netflix-gray text-netflix-lightGray rounded-lg transition-colors border border-netflix-gray"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-green-500" />
          <span className="text-sm font-medium">Copiado!</span>
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          <span className="text-sm font-medium">Copiar Texto</span>
        </>
      )}
    </button>
  );
};

export default CopyButton;
