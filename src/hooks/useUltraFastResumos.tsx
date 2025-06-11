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

// Cache localStorage otimizado para evitar quota exceeded
const CACHE_KEY = 'resumos_cache_v2';
const CACHE_VERSION = '2.0';
const CACHE_EXPIRY = 12 * 60 * 60 * 1000; // 12 horas (reduzido)

// Cache global em memória - ultra rápido
let globalResumos: ResumoData[] = [];
let isDataLoaded = false;
let loadingPromise: Promise<ResumoData[]> | null = null;

// Pre-computed cache para acesso instantâneo
let areasCache: any[] = [];
let modulosCache = new Map<string, any[]>();
let temasCache = new Map<string, any[]>();
let assuntosCache = new Map<string, any[]>();

const loadFromLocalStorage = (): ResumoData[] | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp, version } = JSON.parse(cached);
      if (
        version === CACHE_VERSION &&
        Date.now() - timestamp < CACHE_EXPIRY &&
        Array.isArray(data) &&
        data.length > 0
      ) {
        console.log('📦 Carregando dados do cache localStorage');
        return data;
      }
    }
  } catch (error) {
    console.warn('Erro ao carregar cache localStorage:', error);
    // Limpa cache corrompido
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch (e) {
      console.warn('Erro ao limpar cache corrompido:', e);
    }
  }
  return null;
};

const saveToLocalStorage = (data: ResumoData[]) => {
  try {
    // Compacta os dados removendo campos desnecessários para cache
    const compactData = data.map(item => ({
      id: item.id,
      area: item.area,
      numero_do_modulo: item.numero_do_modulo,
      nome_do_modulo: item.nome_do_modulo,
      numero_do_tema: item.numero_do_tema,
      nome_do_tema: item.nome_do_tema,
      numero_do_assunto: item.numero_do_assunto,
      titulo_do_assunto: item.titulo_do_assunto,
      // Não salva texto completo no localStorage para economizar espaço
      texto: item.texto?.substring(0, 200) + '...' || '',
      glossario: item.glossario?.substring(0, 100) + '...' || ''
    }));

    const cacheData = {
      data: compactData,
      timestamp: Date.now(),
      version: CACHE_VERSION
    };

    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    console.log('💾 Cache compacto salvo no localStorage');
  } catch (error) {
    console.warn('Erro ao salvar cache localStorage (quota excedida):', error);
    // Tenta limpar cache antigo e salvar novamente
    try {
      localStorage.clear();
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: data.slice(0, 100), // Salva apenas os primeiros 100 para garantir que cabe
        timestamp: Date.now(),
        version: CACHE_VERSION
      }));
      console.log('💾 Cache reduzido salvo após limpeza');
    } catch (e) {
      console.warn('Não foi possível salvar no localStorage:', e);
    }
  }
};

const precomputeCache = (resumos: ResumoData[]) => {
  console.log('⚡ Pré-computando cache para acesso instantâneo...');
  
  // Áreas com contagem
  const areasMap = new Map<string, number>();
  resumos.forEach(resumo => {
    areasMap.set(resumo.area, (areasMap.get(resumo.area) || 0) + 1);
  });
  areasCache = Array.from(areasMap.entries()).map(([area, resumosCount]) => ({
    area,
    resumosCount
  }));

  // Módulos por área
  modulosCache.clear();
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

    modulosCache.set(area, Array.from(modulosMap.entries()).map(([_, modulo]) => ({
      numero: modulo.numero,
      nome: modulo.nome,
      temasCount: modulo.temas.size,
      assuntosCount: modulo.assuntos.size
    })));
  });

  // Temas por módulo
  temasCache.clear();
  modulosCache.forEach((modulos, area) => {
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

      temasCache.set(cacheKey, Array.from(temasMap.entries()).map(([_, tema]) => ({
        numero: tema.numero,
        nome: tema.nome,
        assuntosCount: tema.assuntos.size
      })));
    });
  });

  // Assuntos por tema
  assuntosCache.clear();
  temasCache.forEach((temas, moduleKey) => {
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
      
      assuntosCache.set(cacheKey, assuntos);
    });
  });

  console.log('✅ Cache pré-computado com sucesso!');
};

export const useUltraFastResumos = () => {
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
        console.log('🚀 Carregamento ultra-rápido iniciado...');
        
        // Primeiro, tenta carregar do localStorage
        const cachedData = loadFromLocalStorage();
        if (cachedData && cachedData.length > 0) {
          // Se temos cache, carrega ele primeiro para exibir algo rapidamente
          globalResumos = cachedData;
          isDataLoaded = true;
          precomputeCache(globalResumos);
          console.log(`⚡ ${globalResumos.length} resumos carregados do cache!`);
          
          // Depois carrega os dados completos do banco em background
          setTimeout(async () => {
            try {
              console.log('🔄 Atualizando dados em background...');
              const { data, error } = await supabase
                .from('RESUMOS_pro')
                .select(`
                  id,
                  area,
                  numero_do_modulo,
                  nome_do_modulo,
                  numero_do_tema,
                  nome_do_tema,
                  numero_do_assunto,
                  titulo_do_assunto,
                  texto,
                  glossario,
                  exemplo,
                  mapa_mental
                `)
                .order('area')
                .order('numero_do_modulo')
                .order('numero_do_tema')
                .order('numero_do_assunto');

              if (!error && data) {
                globalResumos = data;
                precomputeCache(globalResumos);
                saveToLocalStorage(globalResumos);
                console.log('🔄 Dados atualizados em background');
              }
            } catch (err) {
              console.warn('Erro ao atualizar dados em background:', err);
            }
          }, 100);
          
          return globalResumos;
        }

        // Se não tem cache, carrega do banco com seleção otimizada
        console.log('📡 Carregando do banco de dados...');
        const { data, error } = await supabase
          .from('RESUMOS_pro')
          .select(`
            id,
            area,
            numero_do_modulo,
            nome_do_modulo,
            numero_do_tema,
            nome_do_tema,
            numero_do_assunto,
            titulo_do_assunto,
            texto,
            glossario,
            exemplo,
            mapa_mental
          `)
          .order('area')
          .order('numero_do_modulo')
          .order('numero_do_tema')
          .order('numero_do_assunto');

        if (error) throw error;
        
        globalResumos = data || [];
        isDataLoaded = true;
        
        // Salva no localStorage para próximas sessões
        saveToLocalStorage(globalResumos);
        
        // Pré-computa cache
        precomputeCache(globalResumos);
        
        console.log(`🎉 ${globalResumos.length} resumos carregados e otimizados!`);
        return globalResumos;
      } catch (err) {
        console.error('❌ Erro ao carregar resumos:', err);
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

  // Funções de acesso instantâneo usando cache pré-computado
  const getAreas = () => areasCache;
  const getModulosByArea = (area: string) => modulosCache.get(area) || [];
  const getTemasByModulo = (area: string, numeroModulo: string) => temasCache.get(`${area}-${numeroModulo}`) || [];
  const getAssuntosByTema = (area: string, numeroModulo: string, numeroTema: string) => assuntosCache.get(`${area}-${numeroModulo}-${numeroTema}`) || [];

  const addToFavorites = async (area: string, modulo: string, tema: string, assunto: string, assuntoId: number) => {
    if (!user) return;

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
    if (!user) return;

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
    if (!user) return;

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
