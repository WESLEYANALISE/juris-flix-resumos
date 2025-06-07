
import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { convertMarkdownToPlainText } from '@/utils/textConverter';

interface CopyButtonProps {
  text: string;
  className?: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ text, className = '' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const plainText = convertMarkdownToPlainText(text);
      await navigator.clipboard.writeText(plainText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar texto:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`
        flex items-center gap-2 px-4 py-2 bg-netflix-gray hover:bg-netflix-gray/80 
        text-netflix-lightGray hover:text-white border border-netflix-gray 
        hover:border-netflix-red rounded-lg transition-all duration-300
        transform hover:scale-105 active:scale-95 group
        ${className}
      `}
      title="Copiar texto"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-green-400" />
          <span className="text-sm font-medium text-green-400">Copiado!</span>
        </>
      ) : (
        <>
          <Copy className="h-4 w-4 group-hover:text-netflix-red transition-colors" />
          <span className="text-sm font-medium">Copiar</span>
        </>
      )}
    </button>
  );
};

export default CopyButton;
