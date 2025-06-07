import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, Loader2, ExternalLink } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';
import FloatingControls from './FloatingControls';
import FloatingGlossary from './FloatingGlossary';
import FavoriteButton from './FavoriteButton';
import CopyButton from './CopyButton';
import AuthDialog from './AuthDialog';
import { useResumos } from '../hooks/useResumos';
import { useIsMobile } from '../hooks/useIsMobile';
import { downloadPDF, createDownloadLink } from '../utils/driveUtils';
import jsPDF from 'jspdf';

interface ResumoViewerProps {
  area: string;
  modulo: string;
  tema: string;
  assunto: string;
  resumo: string;
  glossario: string;
  assuntoId: number;
  onBack: () => void;
}

const ResumoViewer: React.FC<ResumoViewerProps> = ({
  area,
  modulo,
  tema,
  assunto,
  resumo,
  glossario,
  assuntoId,
  onBack
}) => {
  const [fontSize, setFontSize] = useState(16);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<string>('');
  const [downloadLink, setDownloadLink] = useState<string>('');
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const isMobile = useIsMobile();
  
  const {
    addToRecents,
    addToFavorites,
    removeFromFavorites,
    isFavorite
  } = useResumos();
  
  const isItemFavorited = isFavorite(assuntoId);

  useEffect(() => {
    addToRecents(area, modulo, tema, assunto, assuntoId);
  }, [assuntoId, addToRecents, area, modulo, tema, assunto]);

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

  const handleExportClick = () => {
    setShowAuthDialog(true);
  };

  const handleFavoriteToggle = () => {
    if (isItemFavorited) {
      removeFromFavorites(assuntoId);
    } else {
      addToFavorites(area, modulo, tema, assunto, assuntoId);
    }
  };

  const cleanMarkdownForPDF = (text: string) => {
    let cleaned = text;
    cleaned = cleaned.replace(/^#{1,6}\s+(.+)$/gm, '$1');
    cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, '$1');
    cleaned = cleaned.replace(/\*(.*?)\*/g, '$1');
    cleaned = cleaned.replace(/`(.*?)`/g, '$1');
    cleaned = cleaned.replace(/^>\s+(.+)$/gm, '$1');
    cleaned = cleaned.replace(/\n\s*\n\s*\n/g, '\n\n');
    cleaned = cleaned.trim();
    return cleaned;
  };

  const handleAuthenticate = async (email: string, password: string) => {
    try {
      setIsGeneratingPDF(true);
      setDownloadStatus('Gerando PDF...');
      setDownloadLink('');
      
      const pdf = new jsPDF();
      const margin = 20;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const maxWidth = pageWidth - 2 * margin;
      let currentY = 30;

      // Title
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      const titleLines = pdf.splitTextToSize(assunto, maxWidth);
      pdf.text(titleLines, margin, currentY);
      currentY += titleLines.length * 8 + 10;

      // Subtitle
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      const subtitle = `${area} > ${modulo} > ${tema}`;
      const subtitleLines = pdf.splitTextToSize(subtitle, maxWidth);
      pdf.text(subtitleLines, margin, currentY);
      currentY += subtitleLines.length * 6 + 15;

      // Content
      const cleanContent = cleanMarkdownForPDF(resumo);
      if (!cleanContent || cleanContent.trim().length === 0) {
        throw new Error('Conteúdo vazio após limpeza');
      }

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');

      const contentLines = pdf.splitTextToSize(cleanContent, maxWidth);
      for (let i = 0; i < contentLines.length; i++) {
        if (currentY + 6 > pageHeight - margin) {
          pdf.addPage();
          currentY = margin;
        }
        pdf.text(contentLines[i], margin, currentY);
        currentY += 6;
      }

      const fileName = `${assunto.replace(/[^a-zA-Z0-9\s]/g, '_').replace(/\s+/g, '_')}.pdf`;
      const pdfBlob = pdf.output('blob');
      
      setDownloadStatus('Criando link de download...');
      
      if (isMobile) {
        // No mobile, criar link de download direto
        const downloadUrl = createDownloadLink(pdfBlob, fileName);
        setDownloadLink(downloadUrl);
        setDownloadStatus('Link de download criado!');
      } else {
        // No desktop, fazer download automático
        downloadPDF(pdfBlob, fileName);
        setDownloadStatus('Download iniciado!');
      }
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      setDownloadStatus('Erro ao gerar PDF');
      alert(`Erro ao gerar PDF: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsGeneratingPDF(false);
      setTimeout(() => {
        setDownloadStatus('');
        setDownloadLink('');
      }, 10000);
    }
  };

  return (
    <div className="min-h-screen bg-netflix-black animate-fade-in">
      <div className="container mx-auto py-6 max-w-5xl px-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-slide-in-top px-[14px]">
          <button 
            onClick={onBack} 
            className="flex items-center gap-2 text-netflix-red hover:text-netflix-darkRed transition-all duration-300 hover:scale-105 transform"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Voltar</span>
          </button>
          
          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-1 py-0 px-[13px]">
              <FavoriteButton 
                assuntoId={assuntoId} 
                isFavorited={isItemFavorited} 
                onToggle={handleFavoriteToggle} 
              />
              
              <CopyButton text={resumo} assunto={assunto} />

              <button 
                onClick={handleExportClick} 
                disabled={isGeneratingPDF} 
                title={isGeneratingPDF ? 'Gerando PDF...' : 'Baixar PDF'} 
                className="p-2 rounded-full text-gray-400 hover:text-netflix-lightGray hover:bg-netflix-gray/20 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed py-[13px] px-[13px]"
              >
                {isGeneratingPDF ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
              </button>
            </div>
            
            {downloadStatus && (
              <div className="text-xs text-netflix-red bg-netflix-darkGray px-3 py-2 rounded animate-pulse">
                <p>{downloadStatus}</p>
                {downloadLink && (
                  <a 
                    href={downloadLink} 
                    download={`${assunto.replace(/[^a-zA-Z0-9\s]/g, '_').replace(/\s+/g, '_')}.pdf`}
                    className="flex items-center gap-1 mt-2 text-netflix-lightGray hover:text-white transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Clique para baixar
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="mb-6 animate-slide-in-left">
          <nav className="text-sm text-gray-400 py-0 px-[14px]">
            <span>{area}</span>
            <span className="mx-2">›</span>
            <span>{modulo}</span>
            <span className="mx-2">›</span>
            <span>{tema}</span>
            <span className="mx-2">›</span>
            <span className="text-netflix-lightGray">{assunto}</span>
          </nav>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-netflix-lightGray mb-8 animate-slide-in-up px-[14px]">
          {assunto}
        </h1>

        {/* Content */}
        <div className="bg-netflix-darkGray border border-netflix-gray rounded-xl p-8 px-[22px] animate-fade-in-up transition-all duration-500 hover:shadow-2xl hover:shadow-netflix-red/10 py-[15px]">
          <MarkdownRenderer content={resumo} fontSize={fontSize} />
        </div>
      </div>

      {/* Floating Controls with Glossary */}
      <FloatingControls 
        fontSize={fontSize} 
        onFontSizeChange={setFontSize} 
        onScrollToTop={scrollToTop} 
        showScrollButton={showScrollButton}
        glossaryContent={glossario}
      />

      {/* Auth Dialog */}
      <AuthDialog 
        isOpen={showAuthDialog} 
        onClose={() => setShowAuthDialog(false)} 
        onAuthenticate={handleAuthenticate} 
        title={assunto} 
      />
    </div>
  );
};

export default ResumoViewer;
