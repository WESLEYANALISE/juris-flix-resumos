
// Utility to convert markdown text to plain text as displayed to user
export const convertMarkdownToPlainText = (markdown: string): string => {
  if (!markdown) return '';
  
  let text = markdown;
  
  // Convert headers to plain text with line breaks
  text = text.replace(/^### (.*$)/gm, '\n$1\n');
  text = text.replace(/^## (.*$)/gm, '\n$1\n');
  text = text.replace(/^# (.*$)/gm, '\n$1\n');
  
  // Convert bold text
  text = text.replace(/\*\*(.*?)\*\*/g, '$1');
  text = text.replace(/__(.*?)__/g, '$1');
  
  // Convert italic text
  text = text.replace(/\*(.*?)\*/g, '$1');
  text = text.replace(/_(.*?)_/g, '$1');
  
  // Convert unordered lists
  text = text.replace(/^[\s]*[-*+]\s+(.*$)/gm, '• $1');
  
  // Convert ordered lists
  text = text.replace(/^[\s]*\d+\.\s+(.*$)/gm, (match, content, offset, string) => {
    const lines = string.substring(0, offset).split('\n');
    const currentLineIndex = lines.length - 1;
    const listItems = lines.slice(0, currentLineIndex + 1).filter(line => /^\s*\d+\.\s+/.test(line));
    const itemNumber = listItems.length;
    return `${itemNumber}. ${content}`;
  });
  
  // Convert blockquotes
  text = text.replace(/^>\s+(.*$)/gm, '   $1');
  
  // Convert code blocks to plain text
  text = text.replace(/```[\s\S]*?```/g, (match) => {
    const content = match.replace(/```\w*\n?/, '').replace(/```$/, '');
    return content;
  });
  
  // Convert inline code
  text = text.replace(/`(.*?)`/g, '$1');
  
  // Convert links to just the text
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  
  // Clean up extra whitespace and normalize line breaks
  text = text.replace(/\n\s*\n\s*\n/g, '\n\n'); // Remove triple+ line breaks
  text = text.replace(/^\s+|\s+$/g, ''); // Trim start and end
  
  return text;
};
