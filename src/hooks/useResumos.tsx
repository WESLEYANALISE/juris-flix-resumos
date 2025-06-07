import { useState, useEffect } from 'react';
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

export const useResumos = () => {
  const [resumos, setResumos] = useState<ResumoData[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [recents, setRecents] = useState<RecentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();

  useEffect(() => {
    fetchResumos();
    if (user) {
      fetchFavorites();
      fetchRecents();
    } else {
      // Limpar dados quando usuário não está logado
      setFavorites([]);
      setRecents([]);
    }
  }, [user]);

  const fetchResumos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('RESUMOS_pro')
        .select('*, exemplo, mapa_mental')
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
      // First try to update existing entry
      const { data: existing } = await supabase
        .from('resumos_recentes')
        .select('id')
        .eq('user_id', user.id)
        .eq('assunto_id', assuntoId)
        .single();

      if (existing) {
        // Update existing entry's timestamp
        const { error } = await supabase
          .from('resumos_recentes')
          .update({ accessed_at: new Date().toISOString() })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // Create new entry
        const { error } = await supabase
          .from('resumos_recentes')
          .insert({
            user_id: user.id,
            area,
            modulo,
            tema,
            assunto,
            assunto_id: assuntoId,
          });

        if (error) throw error;
      }

      await fetchRecents();
    } catch (err) {
      console.error('Error adding to recents:', err);
    }
  };

  const isFavorite = (assuntoId: number) => {
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
        exemplo: resumo.exemplo || '',
        mapaMental: resumo.mapa_mental || ''
      }));
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
