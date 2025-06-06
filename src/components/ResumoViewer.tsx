import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, ExternalLink, Loader2 } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';
import FloatingControls from './FloatingControls';
import GlossarySection from './GlossarySection';
import CopyButton from './CopyButton';
import { useResumos } from '../hooks/useResumos';
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
  const {
    addToRecents
  } = useResumos();
  useEffect(() => {
    // Add to recent access when component mounts
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
      pdf.text(`${area} > ${modulo} > ${tema}`, margin, 45);

      // Content (clean markdown)
      const cleanContent = resumo.replace(/#{1,6}\s+/g, '').replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1').replace(/`(.*?)`/g, '$1').replace(/>\s+/g, '');
      pdf.setFontSize(10);
      const lines = pdf.splitTextToSize(cleanContent, maxWidth);
      pdf.text(lines, margin, 60);
      const fileName = `${assunto.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      setDownloadStatus('Abrindo PDF no navegador...');

      // Create PDF blob
      const pdfBlob = pdf.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Open in new tab outside the app
      const newWindow = window.open(pdfUrl, '_blank', 'noopener,noreferrer');
      if (newWindow) {
        setDownloadStatus('PDF aberto no navegador!');
        setTimeout(() => {
          URL.revokeObjectURL(pdfUrl);
        }, 30000);
      } else {
        // Fallback: create download link if popup is blocked
        setDownloadStatus('Popup bloqueado, iniciando download...');
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = fileName;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => {
          URL.revokeObjectURL(pdfUrl);
        }, 1000);
        setDownloadStatus('Download iniciado!');
      }
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      setDownloadStatus('Erro ao gerar PDF');
      alert('Erro ao gerar PDF. Tente novamente.');
    } finally {
      setIsGeneratingPDF(false);
      setTimeout(() => setDownloadStatus(''), 3000);
    }
  };
  return <div className="min-h-screen bg-netflix-black">
      <div className="container mx-auto py-6 max-w-5xl px-[8px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="flex items-center gap-2 text-netflix-red hover:text-netflix-darkRed transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Voltar</span>
          </button>
          
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <CopyButton text={resumo} assunto={assunto} />

              <button onClick={exportToPDF} disabled={isGeneratingPDF} className="flex items-center gap-2 px-4 py-2 bg-netflix-darkGray hover:bg-netflix-gray text-netflix-lightGray rounded-lg transition-colors border border-netflix-gray disabled:opacity-50 disabled:cursor-not-allowed">
                {isGeneratingPDF ? <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm font-medium">Gerando PDF...</span>
                  </> : <>
                    <Download className="h-4 w-4" />
                    <ExternalLink className="h-4 w-4" />
                    <span className="text-sm font-medium">Baixar PDF</span>
                  </>}
              </button>
            </div>
            
            {downloadStatus && <p className="text-xs text-netflix-red bg-netflix-darkGray px-2 py-1 rounded">
                {downloadStatus}
              </p>}
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="text-sm text-gray-400">
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
        <h1 className="font-bold text-netflix-lightGray mb-8 text-xl py-0 px-[6px]">
          {assunto}
        </h1>

        {/* Content */}
        <div className="bg-netflix-darkGray border border-netflix-gray rounded-xl p-8 px-[13px] py-[3px]">
          <MarkdownRenderer content={resumo} fontSize={fontSize} />
        </div>

        {/* Glossary Section */}
        <GlossarySection content={glossario} />
      </div>

      {/* Floating Controls */}
      <FloatingControls fontSize={fontSize} onFontSizeChange={setFontSize} onScrollToTop={scrollToTop} showScrollButton={showScrollButton} />
    </div>;
};
export default ResumoViewer;