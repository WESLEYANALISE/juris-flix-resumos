
import React from 'react';

interface MiniMarkdownRendererProps {
  content: string;
  maxLength?: number;
}

const MiniMarkdownRenderer: React.FC<MiniMarkdownRendererProps> = ({
  content,
  maxLength = 200
}) => {
  const parseInlineMarkdown = (text: string) => {
    // Truncate if needed
    const truncatedText = text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    
    // Bold text
    let result = truncatedText.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-netflix-lightGray">$1</strong>');

    // Italic text
    result = result.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');

    // Inline code
    result = result.replace(/`(.*?)`/g, '<code class="bg-netflix-gray px-1 py-0.5 rounded text-xs font-mono">$1</code>');

    // Remove headers
    result = result.replace(/#{1,6}\s+/g, '');

    // Remove quotes
    result = result.replace(/>\s+/g, '');

    return <span dangerouslySetInnerHTML={{ __html: result }} />;
  };

  return (
    <div className="text-sm text-gray-300 leading-relaxed">
      {parseInlineMarkdown(content)}
    </div>
  );
};

export default MiniMarkdownRenderer;
