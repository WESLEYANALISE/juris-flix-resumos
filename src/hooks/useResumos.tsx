
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

// Cache global para evitar múltiplas requisições
let globalResumos: ResumoData[] = [];
let isDataLoaded = false;
let loadingPromise: Promise<ResumoData[]> | null = null;

export const useResumos = () => {
  const [resumos, setResumos] = useState<ResumoData[]>(globalResumos);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [recents, setRecents] = useState<RecentItem[]>([]);
  const [loading, setLoading] = useState(!isDataLoaded);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();

  const fetchResumos = async (): Promise<ResumoData[]> => {
    // Se já temos uma requisição em andamento, aguarda ela
    if (loadingPromise) {
      return loadingPromise;
    }

    // Se os dados já foram carregados, retorna do cache
    if (isDataLoaded && globalResumos.length > 0) {
      return globalResumos;
    }

    // Cria nova requisição
    loadingPromise = (async () => {
      try {
        console.log('Carregando resumos do Supabase...');
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
        console.log(`${globalResumos.length} resumos carregados`);
        
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

  // Memoização otimizada com cache de resultados
  const areasCache = useMemo(() => {
    const areasMap = new Map<string, number>();
    resumos.forEach(resumo => {
      areasMap.set(resumo.area, (areasMap.get(resumo.area) || 0) + 1);
    });
    
    return Array.from(areasMap.entries()).map(([area, resumosCount]) => ({
      area,
      resumosCount
    }));
  }, [resumos]);

  const modulosCache = useMemo(() => {
    const cache = new Map<string, any[]>();
    
    resumos.forEach(resumo => {
      const cacheKey = resumo.area;
      if (!cache.has(cacheKey)) {
        const modulosMap = new Map();
        resumos
          .filter(r => r.area === resumo.area)
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

        cache.set(cacheKey, Array.from(modulosMap.entries()).map(([key, modulo]) => ({
          numero: modulo.numero,
          nome: modulo.nome,
          temasCount: modulo.temas.size,
          assuntosCount: modulo.assuntos.size
        })));
      }
    });
    
    return cache;
  }, [resumos]);

  const temasCache = useMemo(() => {
    const cache = new Map<string, any[]>();
    
    resumos.forEach(resumo => {
      const cacheKey = `${resumo.area}-${resumo.numero_do_modulo}`;
      if (!cache.has(cacheKey)) {
        const temasMap = new Map();
        resumos
          .filter(r => r.area === resumo.area && r.numero_do_modulo === resumo.numero_do_modulo)
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

        cache.set(cacheKey, Array.from(temasMap.entries()).map(([key, tema]) => ({
          numero: tema.numero,
          nome: tema.nome,
          assuntosCount: tema.assuntos.size
        })));
      }
    });
    
    return cache;
  }, [resumos]);

  const assuntosCache = useMemo(() => {
    const cache = new Map<string, any[]>();
    
    resumos.forEach(resumo => {
      const cacheKey = `${resumo.area}-${resumo.numero_do_modulo}-${resumo.numero_do_tema}`;
      if (!cache.has(cacheKey)) {
        cache.set(cacheKey, resumos
          .filter(r => 
            r.area === resumo.area && 
            r.numero_do_modulo === resumo.numero_do_modulo && 
            r.numero_do_tema === resumo.numero_do_tema
          )
          .map(r => ({
            id: r.id,
            numero: r.numero_do_assunto,
            titulo: r.titulo_do_assunto,
            texto: r.texto,
            glossario: r.glossario,
            exemplo: r.exemplo || '',
            mapaMental: r.mapa_mental || ''
          })));
      }
    });
    
    return cache;
  }, [resumos]);

  const getAreas = () => areasCache;

  const getModulosByArea = (area: string) => {
    return modulosCache.get(area) || [];
  };

  const getTemasByModulo = (area: string, numeroModulo: string) => {
    return temasCache.get(`${area}-${numeroModulo}`) || [];
  };

  const getAssuntosByTema = (area: string, numeroModulo: string, numeroTema: string) => {
    return assuntosCache.get(`${area}-${numeroModulo}-${numeroTema}`) || [];
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
    isFavorite
  };
};
