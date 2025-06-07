
interface DriveFile {
  id: string;
  webViewLink: string;
  webContentLink: string;
}

export const uploadPDFToDrive = async (pdfBlob: Blob, fileName: string): Promise<string> => {
  try {
    // Simulação da API do Google Drive
    // Em produção, você precisaria configurar a API do Google Drive
    const formData = new FormData();
    formData.append('file', pdfBlob, fileName);
    formData.append('name', fileName);
    formData.append('parents', 'temp_folder_id'); // Corrigido: passa string diretamente

    // Simular resposta da API do Google Drive
    // const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${accessToken}`,
    //   },
    //   body: formData
    // });

    // Por enquanto, criamos um URL temporário local que será baixado
    const tempUrl = URL.createObjectURL(pdfBlob);
    
    // Criar um link de download
    const link = document.createElement('a');
    link.href = tempUrl;
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    
    // Programar limpeza do URL após 5 minutos
    setTimeout(() => {
      URL.revokeObjectURL(tempUrl);
      document.body.removeChild(link);
    }, 5 * 60 * 1000);

    return tempUrl;
  } catch (error) {
    console.error('Erro ao fazer upload para o Drive:', error);
    throw error;
  }
};

export const createDownloadLink = (pdfBlob: Blob, fileName: string): string => {
  // Cria um URL temporário que pode ser baixado
  const url = URL.createObjectURL(pdfBlob);
  
  // Criar elemento de link para download
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.style.display = 'none';
  document.body.appendChild(link);
  
  // Programar limpeza após 5 minutos
  setTimeout(() => {
    URL.revokeObjectURL(url);
    if (document.body.contains(link)) {
      document.body.removeChild(link);
    }
  }, 5 * 60 * 1000);
  
  return url;
};

export const downloadPDF = (pdfBlob: Blob, fileName: string): void => {
  const url = createDownloadLink(pdfBlob, fileName);
  
  // Criar e clicar no link de download
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  
  // Limpeza imediata do elemento
  setTimeout(() => {
    document.body.removeChild(link);
  }, 100);
};
