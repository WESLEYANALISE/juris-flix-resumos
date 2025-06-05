
import { useState } from 'react';
import { LegalSubject } from '../types/legal';
import jsPDF from 'jspdf';

interface ArticleViewProps {
  subject: LegalSubject;
  onBack: () => void;
  onToggleFavorite: (subjectId: string) => void;
}

const ArticleView = ({ subject, onBack, onToggleFavorite }: ArticleViewProps) => {
  const [isExporting, setIsExporting] = useState(false);

  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      const maxWidth = pageWidth - 2 * margin;
      
      // Title
      pdf.setFontSize(20);
      pdf.text(subject.title, margin, 30);
      
      // Content (simplified markdown to text conversion)
      const content = subject.content
        .replace(/#{1,6}\s+/g, '') // Remove markdown headers
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold formatting
        .replace(/\*(.*?)\*/g, '$1') // Remove italic formatting
        .replace(/`(.*?)`/g, '$1'); // Remove code formatting
      
      pdf.setFontSize(12);
      const lines = pdf.splitTextToSize(content, maxWidth);
      pdf.text(lines, margin, 50);
      
      pdf.save(`${subject.title}.pdf`);
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="text-netflix-red hover:text-netflix-darkRed transition-colors"
        >
          ← Voltar
        </button>
        
        <div className="flex gap-4">
          <button
            onClick={() => onToggleFavorite(subject.id)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              subject.isFavorite
                ? 'bg-netflix-red text-white'
                : 'bg-netflix-darkGray text-netflix-lightGray hover:bg-netflix-gray'
            }`}
          >
            {subject.isFavorite ? '★ Favoritado' : '☆ Favoritar'}
          </button>
          
          <button
            onClick={exportToPDF}
            disabled={isExporting}
            className="px-4 py-2 bg-netflix-darkGray text-netflix-lightGray rounded-lg hover:bg-netflix-gray transition-colors disabled:opacity-50"
          >
            {isExporting ? 'Exportando...' : '📄 Exportar PDF'}
          </button>
        </div>
      </div>
      
      <article className="bg-netflix-darkGray border border-netflix-gray rounded-lg p-8">
        <div className="prose prose-invert max-w-none">
          {subject.content.split('\n').map((line, index) => {
            if (line.startsWith('# ')) {
              return <h1 key={index} className="text-3xl font-bold text-netflix-lightGray mb-4">{line.replace('# ', '')}</h1>;
            }
            if (line.startsWith('## ')) {
              return <h2 key={index} className="text-2xl font-semibold text-netflix-lightGray mb-3 mt-6">{line.replace('## ', '')}</h2>;
            }
            if (line.startsWith('### ')) {
              return <h3 key={index} className="text-xl font-semibold text-netflix-lightGray mb-2 mt-4">{line.replace('### ', '')}</h3>;
            }
            if (line.startsWith('- ')) {
              return <li key={index} className="text-gray-300 mb-1">{line.replace('- ', '')}</li>;
            }
            if (line.trim() === '') {
              return <br key={index} />;
            }
            return <p key={index} className="text-gray-300 mb-3 leading-relaxed">{line}</p>;
          })}
        </div>
      </article>
    </div>
  );
};

export default ArticleView;
