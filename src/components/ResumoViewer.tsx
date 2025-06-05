
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, ExternalLink, Loader2 } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';
import FloatingControls from './FloatingControls';
import jsPDF from 'jspdf';

interface ResumoViewerProps {
  area: string;
  tema: string;
  assunto: string;
  resumo: string;
  onBack: () => void;
}

const ResumoViewer: React.FC<ResumoViewerProps> = ({
  area,
  tema,
  assunto,
  resumo,
  onBack
}) => {
  const [fontSize, setFontSize] = useState(15);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const exportToPDF = async () => {
    try {
      setIsGeneratingPDF(true);
      
      const pdf = new jsPDF();
      const margin = 20;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const maxWidth = pageWidth - 2 * margin;

      // Title
      pdf.setFontSize(16);
      pdf.text(assunto, margin, 30);

      // Subtitle
      pdf.setFontSize(12);
      pdf.text(`${area} > ${tema}`, margin, 45);

      // Content (clean markdown)
      const cleanContent = resumo
        .replace(/#{1,6}\s+/g, '')
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/`(.*?)`/g, '$1')
        .replace(/>\s+/g, '');
      
      pdf.setFontSize(10);
      const lines = pdf.splitTextToSize(cleanContent, maxWidth);
      pdf.text(lines, margin, 60);

      // Generate PDF blob
      const pdfBlob = pdf.output('blob');
      const fileName = `${assunto.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;

      // Try multiple download methods for iframe compatibility
      const downloadMethods = [
        // Method 1: Create download link (most compatible)
        () => {
          const link = document.createElement('a');
          link.href = URL.createObjectURL(pdfBlob);
          link.download = fileName;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(link.href);
        },

        // Method 2: Open in new window (fallback)
        () => {
          const pdfUrl = URL.createObjectURL(pdfBlob);
          const newWindow = window.open(pdfUrl, '_blank');
          if (newWindow) {
            newWindow.onload = () => URL.revokeObjectURL(pdfUrl);
          } else {
            URL.revokeObjectURL(pdfUrl);
            throw new Error('Popup blocked');
          }
        },

        // Method 3: Communicate with parent window if in iframe
        () => {
          if (window !== window.parent) {
            const pdfUrl = URL.createObjectURL(pdfBlob);
            window.parent.postMessage({
              type: 'PDF_DOWNLOAD',
              data: {
                url: pdfUrl,
                filename: fileName,
                title: assunto
              }
            }, '*');
          } else {
            throw new Error('Not in iframe');
          }
        }
      ];

      // Try each method until one works
      let success = false;
      for (const method of downloadMethods) {
        try {
          await method();
          success = true;
          break;
        } catch (error) {
          console.log('Download method failed, trying next...', error);
        }
      }

      if (!success) {
        throw new Error('Todos os métodos de download falharam');
      }

    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Tente novamente.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-netflix-black">
      <div className="container mx-auto py-6 max-w-5xl px-[12px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={onBack} 
            className="flex items-center gap-2 text-netflix-red hover:text-netflix-darkRed transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Voltar</span>
          </button>
          
          <button 
            onClick={exportToPDF}
            disabled={isGeneratingPDF}
            className="flex items-center gap-2 px-4 py-2 bg-netflix-darkGray hover:bg-netflix-gray text-netflix-lightGray rounded-lg transition-colors border border-netflix-gray disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingPDF ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm font-medium">Gerando PDF...</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <ExternalLink className="h-4 w-4" />
                <span className="text-sm font-medium">Exportar PDF</span>
              </>
            )}
          </button>
        </div>

        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="text-sm text-gray-400">
            <span>{area}</span>
            <span className="mx-2">›</span>
            <span>{tema}</span>
            <span className="mx-2">›</span>
            <span className="text-netflix-lightGray">{assunto}</span>
          </nav>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-netflix-lightGray mb-8">
          {assunto}
        </h1>

        {/* Content */}
        <div className="bg-netflix-darkGray border border-netflix-gray rounded-xl p-8 px-[13px]">
          <MarkdownRenderer content={resumo} fontSize={fontSize} />
        </div>
      </div>

      {/* Floating Controls */}
      <FloatingControls 
        fontSize={fontSize} 
        onFontSizeChange={setFontSize} 
        onScrollToTop={scrollToTop} 
        showScrollButton={showScrollButton} 
      />
    </div>
  );
};

export default ResumoViewer;
