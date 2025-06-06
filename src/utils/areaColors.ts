
export interface AreaColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  gradient: string;
  textColor: string;
}

export const getAreaColors = (area: string): AreaColorScheme => {
  const lowerArea = area.toLowerCase();
  
  if (lowerArea.includes('civil')) {
    return {
      primary: '#1E40AF',
      secondary: '#3B82F6', 
      accent: '#60A5FA',
      background: '#EFF6FF',
      gradient: 'from-blue-600 to-blue-800',
      textColor: 'text-blue-50'
    };
  }
  
  if (lowerArea.includes('penal') || lowerArea.includes('criminal')) {
    return {
      primary: '#DC2626',
      secondary: '#EF4444',
      accent: '#F87171', 
      background: '#FEF2F2',
      gradient: 'from-red-600 to-red-800',
      textColor: 'text-red-50'
    };
  }
  
  if (lowerArea.includes('constitucional')) {
    return {
      primary: '#F59E0B',
      secondary: '#FBBF24',
      accent: '#FCD34D',
      background: '#FFFBEB', 
      gradient: 'from-yellow-600 to-amber-700',
      textColor: 'text-yellow-50'
    };
  }
  
  if (lowerArea.includes('tributário') || lowerArea.includes('fiscal')) {
    return {
      primary: '#059669',
      secondary: '#10B981',
      accent: '#34D399',
      background: '#ECFDF5',
      gradient: 'from-green-600 to-emerald-700', 
      textColor: 'text-green-50'
    };
  }
  
  if (lowerArea.includes('trabalhista')) {
    return {
      primary: '#7C3AED',
      secondary: '#8B5CF6',
      accent: '#A78BFA',
      background: '#F5F3FF',
      gradient: 'from-purple-600 to-violet-700',
      textColor: 'text-purple-50'
    };
  }
  
  if (lowerArea.includes('processual')) {
    return {
      primary: '#6B7280',
      secondary: '#9CA3AF', 
      accent: '#D1D5DB',
      background: '#F9FAFB',
      gradient: 'from-gray-600 to-slate-700',
      textColor: 'text-gray-50'
    };
  }
  
  // Default (netflix theme)
  return {
    primary: '#e50914',
    secondary: '#f40612',
    accent: '#ff1e2d', 
    background: '#181818',
    gradient: 'from-netflix-red to-netflix-darkRed',
    textColor: 'text-netflix-lightGray'
  };
};

export const getAreaIcon = (area: string) => {
  const lowerArea = area.toLowerCase();
  
  if (lowerArea.includes('civil')) return 'Scale';
  if (lowerArea.includes('penal') || lowerArea.includes('criminal')) return 'Gavel';
  if (lowerArea.includes('constitucional')) return 'BookOpen';
  if (lowerArea.includes('processual')) return 'FileText';
  if (lowerArea.includes('tributário') || lowerArea.includes('fiscal')) return 'Calculator';
  if (lowerArea.includes('trabalhista')) return 'Users';
  if (lowerArea.includes('fundamental') || lowerArea.includes('direitos')) return 'Shield';
  
  return 'Scale'; // Default
};
