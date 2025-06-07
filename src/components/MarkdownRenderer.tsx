
import React from 'react';
interface MarkdownRendererProps {
  content: string;
  fontSize: number;
}
const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  fontSize
}) => {
  const parseMarkdown = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      const key = `line-${index}`;

      // Headers
      if (line.startsWith('### ')) {
        return <h3 key={key} className="text-lg font-semibold text-netflix-lightGray mb-3 mt-4" style={{
          fontSize: `${fontSize * 1.2}px`
        }}>
            {line.replace('### ', '')}
          </h3>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={key} style={{
          fontSize: `${fontSize * 1.4}px`
        }} className="text-xl font-semibold text-netflix-lightGray mb-4 mt-6 mx-0 py-0 my-[12px]">
            {line.replace('## ', '')}
          </h2>;
      }
      if (line.startsWith('# ')) {
        return;
      }

      // Lists
      if (line.startsWith('- ')) {
        return <li key={key} className="text-gray-300 mb-2 ml-4 list-disc leading-relaxed" style={{
          fontSize: `${fontSize}px`,
          marginTop: '8px'
        }}>
            {parseInlineMarkdown(line.replace('- ', ''))}
          </li>;
      }

      // Numbered lists
      if (/^\d+\.\s/.test(line)) {
        return <li key={key} className="text-gray-300 mb-2 ml-4 list-decimal leading-relaxed" style={{
          fontSize: `${fontSize}px`,
          marginTop: '8px'
        }}>
            {parseInlineMarkdown(line.replace(/^\d+\.\s/, ''))}
          </li>;
      }

      // Blockquotes
      if (line.startsWith('> ')) {
        return <blockquote key={key} className="border-l-4 border-netflix-red pl-4 my-4 bg-netflix-darkGray/50 p-4 rounded-r-lg" style={{
          fontSize: `${fontSize}px`
        }}>
            <p className="text-gray-300 italic leading-relaxed">
              {parseInlineMarkdown(line.replace('> ', ''))}
            </p>
          </blockquote>;
      }

      // Empty lines
      if (line.trim() === '') {
        return;
      }

      // Regular paragraphs
      return <p key={key} style={{
        fontSize: `${fontSize}px`
      }} className="text-gray-300 mb-4 leading-relaxed py-[9px]">
          {parseInlineMarkdown(line)}
        </p>;
    });
  };

  const convertImgurUrl = (url: string): string => {
    // Se já é uma URL direta (com extensão), manter como está
    if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return url;
    }
    
    // Converter URL do tipo imgur.com/ID para i.imgur.com/ID.jpg
    const imgurMatch = url.match(/imgur\.com\/([a-zA-Z0-9]+)$/);
    if (imgurMatch) {
      return `https://i.imgur.com/${imgurMatch[1]}.jpg`;
    }
    
    return url;
  };

  const parseInlineMarkdown = (text: string) => {
    // Detectar URLs do Imgur e convertê-las em imagens
    let result = text.replace(
      /(https?:\/\/(?:i\.)?imgur\.com\/[a-zA-Z0-9]+(?:\.[a-zA-Z]{3,4})?)/g,
      (match) => {
        const imageUrl = convertImgurUrl(match);
        return `<img src="${imageUrl}" alt="Imagem" class="max-w-full h-auto rounded-lg border border-netflix-gray my-4 mx-auto block shadow-lg hover:shadow-netflix-red/20 transition-shadow duration-300" style="max-height: 400px; object-fit: contain;" onError="this.style.display='none'" />`;
      }
    );

    // Bold text
    result = result.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-netflix-lightGray">$1</strong>');

    // Italic text
    result = result.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');

    // Inline code
    result = result.replace(/`(.*?)`/g, '<code class="bg-netflix-gray px-2 py-1 rounded text-sm font-mono">$1</code>');
    
    return <span dangerouslySetInnerHTML={{
      __html: result
    }} />;
  };
  
  return <div className="prose prose-invert max-w-none">
      {parseMarkdown(content)}
    </div>;
};
export default MarkdownRenderer;
