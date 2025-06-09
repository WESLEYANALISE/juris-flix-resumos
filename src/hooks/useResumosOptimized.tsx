
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface ResumoData {
  id: number;
  area: string;
  numero_do_modulo: string;
  nome_do_modulo: string;
  numero_do_tema: string;
  nome_do_tema: string;
  numero_do_assunto: string;
  titulo_do_assunto: string;
  texto: string;
  glossario: string;
  exemplo?: string;
  mapa_mental?: string;
}

interface FavoriteItem {
  id: string;
  area: string;
  modulo: string;
  tema: string;
  assunto: string;
  assunto_id: number;
  created_at: string;
}

interface RecentItem {
  id: string;
  area: string;
  modulo: string;
  tema: string;
  assunto: string;
  assunto_id: number;
  accessed_at: string;
}

// Cache global otimizado
let globalResumos: ResumoData[] = [];
let isDataLoaded = false;
let loadingPromise: Promise<ResumoData[]> | null = null;

// Cache pré-computado para performance
let precomputedAreas: any[] = [];
let precomputedModulos: Map<string, any[]> = new Map();
let precomputedTemas: Map<string, any[]> = new Map();
let precomputedAssuntos: Map<string, any[]> = new Map();

const precomputeData = (resumos: ResumoData[]) => {
  console.log('Pré-computando dados para performance máxima...');
  
  // Pré-computar áreas
  const areasMap = new Map<string, number>();
  resumos.forEach(resumo => {
    areasMap.set(resumo.area, (areasMap.get(resumo.area) || 0) + 1);
  });
  precomputedAreas = Array.from(areasMap.entries()).map(([area, resumosCount]) => ({
    area,
    resumosCount
  }));

  // Pré-computar módulos por área
  precomputedModulos.clear();
  const areasSet = new Set(resumos.map(r => r.area));
  areasSet.forEach(area => {
    const modulosMap = new Map();
    resumos
      .filter(r => r.area === area)
      .forEach(r => {
        const moduloKey = `${r.numero_do_modulo}-${r.nome_do_modulo}`;
        if (!modulosMap.has(moduloKey)) {
          modulosMap.set(moduloKey, {
            numero: r.numero_do_modulo,
            nome: r.nome_do_modulo,
            temas: new Set(),
            assuntos: new Set()
          });
        }
        modulosMap.get(moduloKey).temas.add(`${r.numero_do_tema}-${r.nome_do_tema}`);
        modulosMap.get(moduloKey).assuntos.add(r.id);
      });

    precomputedModulos.set(area, Array.from(modulosMap.entries()).map(([key, modulo]) => ({
      numero: modulo.numero,
      nome: modulo.nome,
      temasCount: modulo.temas.size,
      assuntosCount: modulo.assuntos.size
    })));
  });

  // Pré-computar temas por módulo
  precomputedTemas.clear();
  precomputedModulos.forEach((modulos, area) => {
    modulos.forEach(modulo => {
      const cacheKey = `${area}-${modulo.numero}`;
      const temasMap = new Map();
      resumos
        .filter(r => r.area === area && r.numero_do_modulo === modulo.numero)
        .forEach(r => {
          const temaKey = `${r.numero_do_tema}-${r.nome_do_tema}`;
          if (!temasMap.has(temaKey)) {
            temasMap.set(temaKey, {
              numero: r.numero_do_tema,
              nome: r.nome_do_tema,
              assuntos: new Set()
            });
          }
          temasMap.get(temaKey).assuntos.add(r.titulo_do_assunto);
        });

      precomputedTemas.set(cacheKey, Array.from(temasMap.entries()).map(([key, tema]) => ({
        numero: tema.numero,
        nome: tema.nome,
        assuntosCount: tema.assuntos.size
      })));
    });
  });

  // Pré-computar assuntos por tema
  precomputedAssuntos.clear();
  precomputedTemas.forEach((temas, moduleKey) => {
    const [area, numeroModulo] = moduleKey.split('-');
    temas.forEach(tema => {
      const cacheKey = `${area}-${numeroModulo}-${tema.numero}`;
      const assuntos = resumos
        .filter(r => 
          r.area === area && 
          r.numero_do_modulo === numeroModulo && 
          r.numero_do_tema === tema.numero
        )
        .map(r => ({
          id: r.id,
          numero: r.numero_do_assunto,
          titulo: r.titulo_do_assunto,
          texto: r.texto,
          glossario: r.glossario,
          exemplo: r.exemplo || '',
          mapaMental: r.mapa_mental || ''
        }));
      
      precomputedAssuntos.set(cacheKey, assuntos);
    });
  });

  console.log('Dados pré-computados com sucesso!');
};

export const useResumosOptimized = () => {
  const [resumos, setResumos] = useState<ResumoData[]>(globalResumos);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [recents, setRecents] = useState<RecentItem[]>([]);
  const [loading, setLoading] = useState(!isDataLoaded);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();

  const fetchResumos = async (): Promise<ResumoData[]> => {
    if (loadingPromise) {
      return loadingPromise;
    }

    if (isDataLoaded && globalResumos.length > 0) {
      return globalResumos;
    }

    loadingPromise = (async () => {
      try {
        console.log('Carregando resumos com cache otimizado...');
        const { data, error } = await supabase
          .from('RESUMOS_pro')
          .select('*')
          .order('area', { ascending: true })
          .order('numero_do_modulo', { ascending: true })
          .order('numero_do_tema', { ascending: true })
          .order('numero_do_assunto', { ascending: true });

        if (error) throw error;
        
        globalResumos = data || [];
        isDataLoaded = true;
        precomputeData(globalResumos);
        console.log(`${globalResumos.length} resumos carregados e otimizados`);
        
        return globalResumos;
      } catch (err) {
        console.error('Erro ao carregar resumos:', err);
        throw err;
      } finally {
        loadingPromise = null;
      }
    })();

    return loadingPromise;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchResumos();
        setResumos(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar resumos');
        console.error('Error fetching resumos:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (user) {
      fetchFavorites();
      fetchRecents();
    } else {
      setFavorites([]);
      setRecents([]);
    }
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('resumos_favoritos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFavorites(data || []);
    } catch (err) {
      console.error('Error fetching favorites:', err);
    }
  };

  const fetchRecents = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('resumos_recentes')
        .select('*')
        .order('accessed_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setRecents(data || []);
    } catch (err) {
      console.error('Error fetching recents:', err);
    }
  };

  // Funções otimizadas usando cache pré-computado
  const getAreas = () => precomputedAreas;

  const getModulosByArea = (area: string) => {
    return precomputedModulos.get(area) || [];
  };

  const getTemasByModulo = (area: string, numeroModulo: string) => {
    return precomputedTemas.get(`${area}-${numeroModulo}`) || [];
  };

  const getAssuntosByTema = (area: string, numeroModulo: string, numeroTema: string) => {
    return precomputedAssuntos.get(`${area}-${numeroModulo}-${numeroTema}`) || [];
  };

  const addToFavorites = async (area: string, modulo: string, tema: string, assunto: string, assuntoId: number) => {
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    try {
      const { error } = await supabase
        .from('resumos_favoritos')
        .insert({
          user_id: user.id,
          area,
          modulo,
          tema,
          assunto,
          assunto_id: assuntoId,
        });

      if (error) throw error;
      await fetchFavorites();
    } catch (err) {
      console.error('Error adding to favorites:', err);
    }
  };

  const removeFromFavorites = async (assuntoId: number) => {
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    try {
      const { error } = await supabase
        .from('resumos_favoritos')
        .delete()
        .eq('user_id', user.id)
        .eq('assunto_id', assuntoId);

      if (error) throw error;
      await fetchFavorites();
    } catch (err) {
      console.error('Error removing from favorites:', err);
    }
  };

  const addToRecents = async (area: string, modulo: string, tema: string, assunto: string, assuntoId: number) => {
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    try {
      const { error } = await supabase
        .from('resumos_recentes')
        .upsert({
          user_id: user.id,
          area,
          modulo,
          tema,
          assunto,
          assunto_id: assuntoId,
          accessed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,assunto_id'
        });

      if (error) throw error;
      await fetchRecents();
    } catch (err) {
      console.error('Error adding to recents:', err);
    }
  };

  const isFavorite = (assuntoId: number) => {
    return favorites.some(fav => fav.assunto_id === assuntoId);
  };

  const searchInContent = (term: string) => {
    if (!term || term.length < 2) return [];
    
    const searchLower = term.toLowerCase();
    return resumos.filter(resumo => 
      resumo.area?.toLowerCase().includes(searchLower) ||
      resumo.nome_do_modulo?.toLowerCase().includes(searchLower) ||
      resumo.nome_do_tema?.toLowerCase().includes(searchLower) ||
      resumo.titulo_do_assunto?.toLowerCase().includes(searchLower) ||
      resumo.texto?.toLowerCase().includes(searchLower)
    );
  };

  return {
    resumos,
    favorites,
    recents,
    loading,
    error,
    getAreas,
    getModulosByArea,
    getTemasByModulo,
    getAssuntosByTema,
    addToFavorites,
    removeFromFavorites,
    addToRecents,
    isFavorite,
    searchInContent
  };
};
