
// Função para remover acentos de strings para facilitar a busca
export const removeAccents = (str: string): string => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

// Função para comparar strings ignorando acentos e case
export const searchMatch = (text: string, searchTerm: string): boolean => {
  const normalizedText = removeAccents(text.toLowerCase());
  const normalizedSearch = removeAccents(searchTerm.toLowerCase());
  return normalizedText.includes(normalizedSearch);
};
