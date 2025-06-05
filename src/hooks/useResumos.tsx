
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ResumoData {
  id: number;
  Area: string;
  Tema: string;
  Assunto: string;
  Resumo: string;
}

export const useResumos = () => {
  const [resumos, setResumos] = useState<ResumoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResumos();
  }, []);

  const fetchResumos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('RESUMOS_pro')
        .select('*')
        .order('Area', { ascending: true });

      if (error) throw error;
      setResumos(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar resumos');
      console.error('Error fetching resumos:', err);
    } finally {
      setLoading(false);
    }
  };

  const getAreas = () => {
    const areasMap = new Map();
    resumos.forEach(resumo => {
      if (!areasMap.has(resumo.Area)) {
        areasMap.set(resumo.Area, new Set());
      }
      areasMap.get(resumo.Area).add(resumo.Tema);
    });
    
    return Array.from(areasMap.entries()).map(([area, temas]) => ({
      area,
      temasCount: temas.size
    }));
  };

  const getTemasByArea = (area: string) => {
    const temasMap = new Map();
    resumos
      .filter(resumo => resumo.Area === area)
      .forEach(resumo => {
        if (!temasMap.has(resumo.Tema)) {
          temasMap.set(resumo.Tema, new Set());
        }
        temasMap.get(resumo.Tema).add(resumo.Assunto);
      });

    return Array.from(temasMap.entries()).map(([tema, assuntos]) => ({
      tema,
      assuntosCount: assuntos.size
    }));
  };

  const getAssuntosByTema = (area: string, tema: string) => {
    return resumos
      .filter(resumo => resumo.Area === area && resumo.Tema === tema)
      .map(resumo => ({
        id: resumo.id,
        assunto: resumo.Assunto,
        resumo: resumo.Resumo
      }));
  };

  return {
    resumos,
    loading,
    error,
    getAreas,
    getTemasByArea,
    getAssuntosByTema
  };
};
