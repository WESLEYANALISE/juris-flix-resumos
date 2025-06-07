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
        return <h2 key={key} className="text-xl font-semibold text-netflix-lightGray mb-4 mt-6" style={{
          fontSize: `${fontSize * 1.4}px`
        }}>
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
        return <div key={key} className="h-4" />;
      }

      // Regular paragraphs
      return <p key={key} style={{
        fontSize: `${fontSize}px`
      }} className="text-gray-300 mb-4 leading-relaxed">
          {parseInlineMarkdown(line)}
        </p>;
    });
  };
  const parseInlineMarkdown = (text: string) => {
    // Bold text
    let result = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-netflix-lightGray">$1</strong>');

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
