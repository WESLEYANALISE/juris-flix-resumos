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

  useEffect(() => {
    fetchResumos();
    // Temporarily disable favorites and recents until tables are properly set up
    // fetchFavorites();
    // fetchRecents();
  }, []);

  const fetchResumos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('RESUMOS_pro')
        .select('*')
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

  // Temporarily disable these functions until proper tables are set up
  const addToFavorites = async (area: string, modulo: string, tema: string, assunto: string, assuntoId: number) => {
    console.log('Add to favorites:', { area, modulo, tema, assunto, assuntoId });
    // Will implement when proper tables are available
  };

  const removeFromFavorites = async (assuntoId: number) => {
    console.log('Remove from favorites:', assuntoId);
    // Will implement when proper tables are available
  };

  const addToRecents = async (area: string, modulo: string, tema: string, assunto: string, assuntoId: number) => {
    console.log('Add to recents:', { area, modulo, tema, assunto, assuntoId });
    // Will implement when proper tables are available
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
            temas: new Set()
          });
        }
        modulosMap.get(moduloKey).temas.add(`${resumo.numero_do_tema}-${resumo.nome_do_tema}`);
      });

    return Array.from(modulosMap.entries()).map(([key, modulo]) => ({
      numero: modulo.numero,
      nome: modulo.nome,
      temasCount: modulo.temas.size
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
        glossario: resumo.glossario
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
