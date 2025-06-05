import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, ExternalLink } from 'lucide-react';
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
  const exportToPDF = () => {
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
    const cleanContent = resumo.replace(/#{1,6}\s+/g, '').replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1').replace(/`(.*?)`/g, '$1').replace(/>\s+/g, '');
    pdf.setFontSize(10);
    const lines = pdf.splitTextToSize(cleanContent, maxWidth);
    pdf.text(lines, margin, 60);

    // Save PDF
    const pdfBlob = pdf.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);

    // Open Google Drive upload page
    const driveUrl = `https://drive.google.com/drive/my-drive`;

    // Download PDF locally
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${assunto}.pdf`;
    link.click();

    // Open Google Drive in new tab
    window.open(driveUrl, '_blank');
    URL.revokeObjectURL(pdfUrl);
  };
  return <div className="min-h-screen bg-netflix-black">
      <div className="container mx-auto py-6 max-w-5xl px-[12px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="flex items-center gap-2 text-netflix-red hover:text-netflix-darkRed transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Voltar</span>
          </button>
          
          <button onClick={exportToPDF} className="flex items-center gap-2 px-4 py-2 bg-netflix-darkGray hover:bg-netflix-gray text-netflix-lightGray rounded-lg transition-colors border border-netflix-gray">
            <Download className="h-4 w-4" />
            <ExternalLink className="h-4 w-4" />
            <span className="text-sm font-medium">PDF & Drive</span>
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
      <FloatingControls fontSize={fontSize} onFontSizeChange={setFontSize} onScrollToTop={scrollToTop} showScrollButton={showScrollButton} />
    </div>;
};
export default ResumoViewer;