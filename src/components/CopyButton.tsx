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
    .replace(/\n\s*\n/g, '\n\n').trim();
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
  return <button onClick={handleCopy} title={copied ? 'Texto copiado!' : 'Copiar texto'} className="p-2 rounded-full text-gray-400 hover:text-netflix-lightGray hover:bg-netflix-gray/20 transition-colors duration-200 px-[13px] py-[13px]">
      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
    </button>;
};
export default CopyButton;