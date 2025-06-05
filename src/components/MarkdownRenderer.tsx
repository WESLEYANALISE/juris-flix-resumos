
import React from 'react';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
  fontSize: number;
  searchTerm?: string;
  className?: string;
}

const MarkdownRenderer = ({ content, fontSize, searchTerm, className }: MarkdownRendererProps) => {
  const parseMarkdown = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let currentList: React.ReactNode[] = [];
    let listType: 'ul' | 'ol' | null = null;

    const highlightText = (text: string) => {
      if (!searchTerm || !text) return text;
      
      const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      const parts = text.split(regex);
      
      return parts.map((part, index) => 
        regex.test(part) ? (
          <mark key={index} className="bg-yellow-300 text-black px-1 rounded">
            {part}
          </mark>
        ) : part
      );
    };

    const flushList = () => {
      if (currentList.length > 0 && listType) {
        const ListComponent = listType === 'ul' ? 'ul' : 'ol';
        elements.push(
          <ListComponent 
            key={elements.length} 
            className={cn(
              "space-y-2 mb-4",
              listType === 'ul' ? "list-disc list-inside" : "list-decimal list-inside"
            )}
            style={{ fontSize: `${fontSize}px` }}
          >
            {currentList}
          </ListComponent>
        );
        currentList = [];
        listType = null;
      }
    };

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      if (!trimmedLine) {
        flushList();
        return;
      }

      // Headers
      if (trimmedLine.startsWith('### ')) {
        flushList();
        elements.push(
          <h3 
            key={index} 
            className="text-lg font-semibold text-netflix-lightGray mb-3 mt-4"
            style={{ fontSize: `${fontSize * 1.2}px` }}
          >
            {highlightText(trimmedLine.replace('### ', ''))}
          </h3>
        );
      } else if (trimmedLine.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 
            key={index} 
            className="text-xl font-semibold text-netflix-lightGray mb-3 mt-6"
            style={{ fontSize: `${fontSize * 1.4}px` }}
          >
            {highlightText(trimmedLine.replace('## ', ''))}
          </h2>
        );
      } else if (trimmedLine.startsWith('# ')) {
        flushList();
        elements.push(
          <h1 
            key={index} 
            className="text-2xl font-bold text-netflix-lightGray mb-4 mt-8"
            style={{ fontSize: `${fontSize * 1.6}px` }}
          >
            {highlightText(trimmedLine.replace('# ', ''))}
          </h1>
        );
      }
      // Blockquotes
      else if (trimmedLine.startsWith('> ')) {
        flushList();
        elements.push(
          <blockquote 
            key={index} 
            className="border-l-4 border-netflix-red pl-4 py-2 bg-netflix-darkGray/50 rounded-r-lg mb-4"
            style={{ fontSize: `${fontSize}px` }}
          >
            <p className="text-gray-300 italic">
              {highlightText(trimmedLine.replace('> ', ''))}
            </p>
          </blockquote>
        );
      }
      // Numbered lists
      else if (/^\d+\.\s/.test(trimmedLine)) {
        if (listType !== 'ol') {
          flushList();
          listType = 'ol';
        }
        currentList.push(
          <li key={index} className="text-gray-300 mb-1">
            {highlightText(trimmedLine.replace(/^\d+\.\s/, ''))}
          </li>
        );
      }
      // Bullet lists
      else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        if (listType !== 'ul') {
          flushList();
          listType = 'ul';
        }
        currentList.push(
          <li key={index} className="text-gray-300 mb-1">
            {highlightText(trimmedLine.replace(/^[-*]\s/, ''))}
          </li>
        );
      }
      // Regular paragraphs
      else {
        flushList();
        // Process inline formatting
        let processedText = trimmedLine;
        
        // Bold text
        processedText = processedText.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-netflix-lightGray">$1</strong>');
        
        // Italic text
        processedText = processedText.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
        
        // Inline code
        processedText = processedText.replace(/`(.*?)`/g, '<code class="bg-netflix-gray px-2 py-1 rounded text-sm font-mono text-netflix-lightGray">$1</code>');

        elements.push(
          <p 
            key={index} 
            className="text-gray-300 mb-3 leading-relaxed"
            style={{ fontSize: `${fontSize}px` }}
            dangerouslySetInnerHTML={{ __html: processedText }}
          />
        );
      }
    });

    flushList();
    return elements;
  };

  return (
    <div className={cn("prose prose-invert max-w-none", className)}>
      {parseMarkdown(content)}
    </div>
  );
};

export default MarkdownRenderer;
