
import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  assunto: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ text, assunto }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      // Format text for WhatsApp with line breaks
      const formattedText = `*${assunto}*\n\n${text.replace(/\n\s*\n/g, '\n\n')}`;
      
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
