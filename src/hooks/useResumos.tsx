
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

export const useResumos = () => {
  const [resumos, setResumos] = useState<ResumoData[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [recents, setRecents] = useState<RecentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetchResumos();
    
    // Check initial auth state
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      if (session) {
        fetchFavorites();
        fetchRecents();
      }
    };
    
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const wasAuthenticated = isAuthenticated;
      const isNowAuthenticated = !!session;
      setIsAuthenticated(isNowAuthenticated);
      
      if (isNowAuthenticated && !wasAuthenticated) {
        // User just logged in
        fetchFavorites();
        fetchRecents();
      } else if (!isNowAuthenticated && wasAuthenticated) {
        // User just logged out
        setFavorites([]);
        setRecents([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchResumos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('RESUMOS_pro')
        .select('*, exemplo')
        .order('area', { ascending: true })
        .order('numero_do_modulo', { ascending: true })
        .order('numero_do_tema', { ascending: true })
        .order('numero_do_assunto', { ascending: true });

      if (error) throw error;
      setResumos(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar resumos');
      console.error('Error fetching resumos:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    if (!isAuthenticated) return;
    
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFavorites(data || []);
    } catch (err) {
      console.error('Error fetching favorites:', err);
    }
  };

  const fetchRecents = async () => {
    if (!isAuthenticated) return;
    
    try {
      const { data, error } = await supabase
        .from('user_recents')
        .select('*')
        .order('accessed_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setRecents(data || []);
    } catch (err) {
      console.error('Error fetching recents:', err);
    }
  };

  const addToFavorites = async (area: string, modulo: string, tema: string, assunto: string, assuntoId: number) => {
    if (!isAuthenticated) {
      console.error('User not authenticated');
      return;
    }

    try {
      const { error } = await supabase
        .from('user_favorites')
        .insert({
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
    if (!isAuthenticated) {
      console.error('User not authenticated');
      return;
    }

    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('assunto_id', assuntoId);

      if (error) throw error;
      await fetchFavorites();
    } catch (err) {
      console.error('Error removing from favorites:', err);
    }
  };

  const addToRecents = async (area: string, modulo: string, tema: string, assunto: string, assuntoId: number) => {
    if (!isAuthenticated) {
      console.error('User not authenticated');
      return;
    }

    try {
      const { error } = await supabase.rpc('update_user_recent', {
        p_area: area,
        p_modulo: modulo,
        p_tema: tema,
        p_assunto: assunto,
        p_assunto_id: assuntoId
      });

      if (error) throw error;
      await fetchRecents();
    } catch (err) {
      console.error('Error adding to recents:', err);
    }
  };

  const isFavorite = (assuntoId: number) => {
    if (!isAuthenticated) return false;
    return favorites.some(fav => fav.assunto_id === assuntoId);
  };

  const getAreas = () => {
    const areasMap = new Map();
    resumos.forEach(resumo => {
      if (!areasMap.has(resumo.area)) {
        areasMap.set(resumo.area, 0);
      }
      areasMap.set(resumo.area, areasMap.get(resumo.area) + 1);
    });
    
    return Array.from(areasMap.entries()).map(([area, resumosCount]) => ({
      area,
      resumosCount
    }));
  };

  const getModulosByArea = (area: string) => {
    const modulosMap = new Map();
    resumos
      .filter(resumo => resumo.area === area)
      .forEach(resumo => {
        const moduloKey = `${resumo.numero_do_modulo}-${resumo.nome_do_modulo}`;
        if (!modulosMap.has(moduloKey)) {
          modulosMap.set(moduloKey, {
            numero: resumo.numero_do_modulo,
            nome: resumo.nome_do_modulo,
            temas: new Set(),
            assuntos: new Set()
          });
        }
        modulosMap.get(moduloKey).temas.add(`${resumo.numero_do_tema}-${resumo.nome_do_tema}`);
        modulosMap.get(moduloKey).assuntos.add(resumo.id);
      });

    return Array.from(modulosMap.entries()).map(([key, modulo]) => ({
      numero: modulo.numero,
      nome: modulo.nome,
      temasCount: modulo.temas.size,
      assuntosCount: modulo.assuntos.size
    }));
  };

  const getTemasByModulo = (area: string, numeroModulo: string) => {
    const temasMap = new Map();
    resumos
      .filter(resumo => resumo.area === area && resumo.numero_do_modulo === numeroModulo)
      .forEach(resumo => {
        const temaKey = `${resumo.numero_do_tema}-${resumo.nome_do_tema}`;
        if (!temasMap.has(temaKey)) {
          temasMap.set(temaKey, {
            numero: resumo.numero_do_tema,
            nome: resumo.nome_do_tema,
            assuntos: new Set()
          });
        }
        temasMap.get(temaKey).assuntos.add(resumo.titulo_do_assunto);
      });

    return Array.from(temasMap.entries()).map(([key, tema]) => ({
      numero: tema.numero,
      nome: tema.nome,
      assuntosCount: tema.assuntos.size
    }));
  };

  const getAssuntosByTema = (area: string, numeroModulo: string, numeroTema: string) => {
    return resumos
      .filter(resumo => 
        resumo.area === area && 
        resumo.numero_do_modulo === numeroModulo && 
        resumo.numero_do_tema === numeroTema
      )
      .map(resumo => ({
        id: resumo.id,
        numero: resumo.numero_do_assunto,
        titulo: resumo.titulo_do_assunto,
        texto: resumo.texto,
        glossario: resumo.glossario,
        exemplo: resumo.exemplo || ''
      }));
  };

  return {
    resumos,
    favorites,
    recents,
    loading,
    error,
    isAuthenticated,
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
