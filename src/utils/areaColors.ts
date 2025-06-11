
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
  
  if (lowerArea.includes('civil') || lowerArea.includes('cível')) {
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
  
  if (lowerArea.includes('tributário') || lowerArea.includes('fiscal') || lowerArea.includes('tribut')) {
    return {
      primary: '#059669',
      secondary: '#10B981',
      accent: '#34D399',
      background: '#ECFDF5',
      gradient: 'from-green-600 to-emerald-700', 
      textColor: 'text-green-50'
    };
  }
  
  if (lowerArea.includes('trabalhista') || lowerArea.includes('trabalho')) {
    return {
      primary: '#7C3AED',
      secondary: '#8B5CF6',
      accent: '#A78BFA',
      background: '#F5F3FF',
      gradient: 'from-purple-600 to-violet-700',
      textColor: 'text-purple-50'
    };
  }
  
  if (lowerArea.includes('processual') || lowerArea.includes('processo')) {
    return {
      primary: '#6B7280',
      secondary: '#9CA3AF', 
      accent: '#D1D5DB',
      background: '#F9FAFB',
      gradient: 'from-gray-600 to-slate-700',
      textColor: 'text-gray-50'
    };
  }
  
  if (lowerArea.includes('administrativo') || lowerArea.includes('admin')) {
    return {
      primary: '#EA580C',
      secondary: '#FB923C',
      accent: '#FDBA74',
      background: '#FFF7ED',
      gradient: 'from-orange-600 to-orange-800',
      textColor: 'text-orange-50'
    };
  }
  
  if (lowerArea.includes('empresarial') || lowerArea.includes('comercial')) {
    return {
      primary: '#0F766E',
      secondary: '#14B8A6',
      accent: '#5EEAD4',
      background: '#F0FDFA',
      gradient: 'from-teal-700 to-teal-900',
      textColor: 'text-teal-50'
    };
  }
  
  if (lowerArea.includes('ambiental') || lowerArea.includes('ambiente')) {
    return {
      primary: '#166534',
      secondary: '#22C55E',
      accent: '#86EFAC',
      background: '#F0FDF4',
      gradient: 'from-green-700 to-green-900',
      textColor: 'text-green-50'
    };
  }
  
  if (lowerArea.includes('consumidor') || lowerArea.includes('consumer')) {
    return {
      primary: '#BE185D',
      secondary: '#EC4899',
      accent: '#F9A8D4',
      background: '#FDF2F8',
      gradient: 'from-pink-700 to-pink-900',
      textColor: 'text-pink-50'
    };
  }
  
  if (lowerArea.includes('eleitoral') || lowerArea.includes('eleição')) {
    return {
      primary: '#7C2D12',
      secondary: '#EA580C',
      accent: '#FB923C',
      background: '#FFF7ED',
      gradient: 'from-orange-800 to-orange-950',
      textColor: 'text-orange-50'
    };
  }
  
  if (lowerArea.includes('previdenciário') || lowerArea.includes('previdência')) {
    return {
      primary: '#4338CA',
      secondary: '#6366F1',
      accent: '#A5B4FC',
      background: '#F8FAFC',
      gradient: 'from-indigo-700 to-indigo-900',
      textColor: 'text-indigo-50'
    };
  }
  
  if (lowerArea.includes('internacional') || lowerArea.includes('internac')) {
    return {
      primary: '#581C87',
      secondary: '#9333EA',
      accent: '#C4B5FD',
      background: '#FAF5FF',
      gradient: 'from-violet-800 to-violet-950',
      textColor: 'text-violet-50'
    };
  }
  
  if (lowerArea.includes('família') || lowerArea.includes('family') || lowerArea.includes('sucessões')) {
    return {
      primary: '#BE123C',
      secondary: '#F43F5E',
      accent: '#FDA4AF',
      background: '#FFF1F2',
      gradient: 'from-rose-700 to-rose-900',
      textColor: 'text-rose-50'
    };
  }
  
  if (lowerArea.includes('financeiro') || lowerArea.includes('bancário')) {
    return {
      primary: '#0F172A',
      secondary: '#475569',
      accent: '#94A3B8',
      background: '#F8FAFC',
      gradient: 'from-slate-800 to-slate-950',
      textColor: 'text-slate-50'
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
  if (lowerArea.includes('administrativo')) return 'Building';
  if (lowerArea.includes('empresarial') || lowerArea.includes('comercial')) return 'Briefcase';
  if (lowerArea.includes('ambiental')) return 'Leaf';
  if (lowerArea.includes('consumidor')) return 'ShoppingCart';
  if (lowerArea.includes('eleitoral')) return 'Vote';
  if (lowerArea.includes('previdenciário')) return 'Shield';
  if (lowerArea.includes('internacional')) return 'Globe';
  if (lowerArea.includes('família')) return 'Heart';
  if (lowerArea.includes('financeiro') || lowerArea.includes('bancário')) return 'DollarSign';
  
  return 'Scale'; // Default
};
