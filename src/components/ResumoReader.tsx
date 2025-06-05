
import React, { useEffect } from 'react';
import { ArrowLeft, Heart, Download, Share2 } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';
import FloatingFontControl from './FloatingFontControl';
import ScrollToTop from './ScrollToTop';
import ReadingProgress from './ReadingProgress';
import { useFavorites } from '@/hooks/useFavorites';
import { useReadingProgress } from '@/hooks/useReadingProgress';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import { Button } from './ui/button';

interface ResumoData {
  id: number;
  Area: string;
  Tema: string;
  Assunto: string;
  Resumo: string;
}

interface ResumoReaderProps {
  resumo: ResumoData;
  onBack: () => void;
  searchTerm?: string;
}

const ResumoReader = ({ resumo, onBack, searchTerm }: ResumoReaderProps) => {
  const { isFavorite, toggleFavorite, loading: favLoading } = useFavorites();
  const { fontSize, updateFontSize } = useReadingProgress(resumo.id);
  const { toast } = useToast();

  const handleExportPDF = async () => {
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      const maxWidth = pageWidth - 2 * margin;
      
      // Title
      pdf.setFontSize(16);
      pdf.text(resumo.Assunto, margin, 30);
      
      // Area and Tema
      pdf.setFontSize(12);
      pdf.text(`Área: ${resumo.Area}`, margin, 45);
      pdf.text(`Tema: ${resumo.Tema}`, margin, 55);
      
      // Content - simplified markdown to text
      const content = resumo.Resumo
        .replace(/#{1,6}\s+/g, '')
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/`(.*?)`/g, '$1')
        .replace(/>\s+/g, '');
      
      pdf.setFontSize(10);
      const lines = pdf.splitTextToSize(content, maxWidth);
      pdf.text(lines, margin, 70);
      
      pdf.save(`${resumo.Assunto}.pdf`);
      
      toast({
        title: "PDF exportado",
        description: "O arquivo foi baixado com sucesso"
      });
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar o PDF",
        variant: "destructive"
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: resumo.Assunto,
          text: `${resumo.Area} - ${resumo.Tema}`,
          url: window.location.href
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback - copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copiado",
          description: "O link foi copiado para a área de transferência"
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível copiar o link",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-netflix-black text-netflix-lightGray">
      <ReadingProgress />
      
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-netflix-red hover:text-netflix-darkRed transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar
          </button>
          
          <div className="flex gap-2">
            <Button
              onClick={() => toggleFavorite(resumo.id)}
              disabled={favLoading}
              variant="outline"
              size="sm"
              className={`${
                isFavorite(resumo.id)
                  ? 'bg-netflix-red text-white border-netflix-red'
                  : 'bg-netflix-darkGray text-netflix-lightGray border-netflix-gray'
              }`}
            >
              <Heart className={`h-4 w-4 mr-2 ${isFavorite(resumo.id) ? 'fill-current' : ''}`} />
              {isFavorite(resumo.id) ? 'Favoritado' : 'Favoritar'}
            </Button>
            
            <Button
              onClick={handleExportPDF}
              variant="outline"
              size="sm"
              className="bg-netflix-darkGray text-netflix-lightGray border-netflix-gray hover:bg-netflix-gray"
            >
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
            
            <Button
              onClick={handleShare}
              variant="outline"
              size="sm"
              className="bg-netflix-darkGray text-netflix-lightGray border-netflix-gray hover:bg-netflix-gray"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
          </div>
        </div>

        {/* Content */}
        <article className="bg-netflix-darkGray border border-netflix-gray rounded-lg p-6 lg:p-8">
          {/* Article Header */}
          <header className="mb-6 pb-4 border-b border-netflix-gray">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="px-3 py-1 bg-netflix-red text-white text-sm rounded-full">
                {resumo.Area}
              </span>
              <span className="px-3 py-1 bg-netflix-gray text-netflix-lightGray text-sm rounded-full">
                {resumo.Tema}
              </span>
            </div>
            <h1 
              className="text-2xl lg:text-3xl font-bold text-netflix-lightGray leading-tight"
              style={{ fontSize: `${fontSize * 1.6}px` }}
            >
              {resumo.Assunto}
            </h1>
          </header>

          {/* Article Content */}
          <MarkdownRenderer
            content={resumo.Resumo}
            fontSize={fontSize}
            searchTerm={searchTerm}
            className="prose-lg"
          />
        </article>
      </div>

      {/* Floating Controls */}
      <FloatingFontControl
        fontSize={fontSize}
        onFontSizeChange={updateFontSize}
      />
      <ScrollToTop />
    </div>
  );
};

export default ResumoReader;
