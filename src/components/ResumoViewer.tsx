import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, ExternalLink, Loader2, Share } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';
import FloatingControls from './FloatingControls';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';

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
  const [downloadStatus, setDownloadStatus] = useState<string>('');

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
      setDownloadStatus('Gerando PDF...');
      
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

      const fileName = `${assunto.replace(/[^a-zA-Z0-9]/g, '_')}.pdf';
      
      setDownloadStatus('Iniciando download...');

      // Method 1: Try native Share API (mobile only)
      if (navigator.share && /mobile|android|iphone|ipad/i.test(navigator.userAgent)) {
        try {
          const pdfBlob = pdf.output('blob');
          const file = new File([pdfBlob], fileName, { type: 'application/pdf' });
          
          await navigator.share({
            files: [file],
            title: assunto,
            text: `Resumo: ${assunto}`
          });
          
          setDownloadStatus('Compartilhado com sucesso!');
          return;
        } catch (shareError) {
          console.log('Share API failed, trying FileSaver...', shareError);
        }
      }

      // Method 2: Try FileSaver.js (best for mobile)
      try {
        const pdfBlob = pdf.output('blob');
        saveAs(pdfBlob, fileName);
        setDownloadStatus('Download iniciado via FileSaver!');
        return;
      } catch (fileSaverError) {
        console.log('FileSaver failed, trying data URL...', fileSaverError);
      }

      // Method 3: Data URL approach (more stable in iframe)
      try {
        const pdfDataUri = pdf.output('dataurlstring');
        const link = document.createElement('a');
        link.href = pdfDataUri;
        link.download = fileName;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        
        // Add to DOM temporarily for mobile compatibility
        link.style.display = 'none';
        document.body.appendChild(link);
        
        // Small delay for mobile compatibility
        setTimeout(() => {
          link.click();
          document.body.removeChild(link);
          setDownloadStatus('Download iniciado!');
        }, 100);
        
        return;
      } catch (dataUrlError) {
        console.log('Data URL failed, trying postMessage...', dataUrlError);
      }

      // Method 4: PostMessage for iframe communication
      try {
        if (window !== window.parent) {
          const pdfBase64 = pdf.output('datauristring');
          
          window.parent.postMessage({
            type: 'PDF_DOWNLOAD',
            data: {
              base64: pdfBase64,
              filename: fileName,
              title: assunto,
              mimeType: 'application/pdf'
            }
          }, '*');
          
          setDownloadStatus('PDF enviado para janela pai!');
          return;
        }
      } catch (postMessageError) {
        console.log('PostMessage failed, trying final fallback...', postMessageError);
      }

      // Method 5: Final fallback - new window
      try {
        const pdfBlob = pdf.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        
        const newWindow = window.open('', '_blank', 'noopener,noreferrer');
        if (newWindow) {
          newWindow.location.href = pdfUrl;
          setDownloadStatus('PDF aberto em nova janela!');
          
          // Clean up after some time
          setTimeout(() => URL.revokeObjectURL(pdfUrl), 10000);
        } else {
          throw new Error('Nova janela bloqueada');
        }
      } catch (fallbackError) {
        console.error('Todos os métodos falharam:', fallbackError);
        setDownloadStatus('Erro: Não foi possível baixar o PDF. Tente novamente.');
        
        // Show instructions for manual download
        alert(`Não foi possível baixar automaticamente. 
               Instruções para mobile:
               1. Toque e segure no botão de download
               2. Selecione "Abrir em nova aba"
               3. O PDF será aberto para download manual`);
      }

    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      setDownloadStatus('Erro ao gerar PDF');
      alert('Erro ao gerar PDF. Tente novamente.');
    } finally {
      setIsGeneratingPDF(false);
      // Clear status after 3 seconds
      setTimeout(() => setDownloadStatus(''), 3000);
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
          
          <div className="flex flex-col items-end gap-2">
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
                  {/mobile|android|iphone|ipad/i.test(navigator.userAgent) && navigator.share ? (
                    <Share className="h-4 w-4" />
                  ) : (
                    <ExternalLink className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium">
                    {/mobile|android|iphone|ipad/i.test(navigator.userAgent) && navigator.share 
                      ? 'Compartilhar PDF' 
                      : 'Exportar PDF'
                    }
                  </span>
                </>
              )}
            </button>
            
            {downloadStatus && (
              <p className="text-xs text-netflix-red bg-netflix-darkGray px-2 py-1 rounded">
                {downloadStatus}
              </p>
            )}
          </div>
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
