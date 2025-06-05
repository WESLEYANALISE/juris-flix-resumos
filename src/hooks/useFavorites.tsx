
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export const useFavorites = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('resumo_id')
        .eq('user_id', user.id);

      if (error) throw error;

      setFavorites(data?.map(fav => fav.resumo_id) || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const toggleFavorite = async (resumoId: number) => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para adicionar favoritos",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const isFavorite = favorites.includes(resumoId);

      if (isFavorite) {
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('resumo_id', resumoId);

        if (error) throw error;

        setFavorites(prev => prev.filter(id => id !== resumoId));
        toast({
          title: "Removido dos favoritos",
          description: "Item removido da sua lista de favoritos"
        });
      } else {
        const { error } = await supabase
          .from('user_favorites')
          .insert({
            user_id: user.id,
            resumo_id: resumoId
          });

        if (error) throw error;

        setFavorites(prev => [...prev, resumoId]);
        toast({
          title: "Adicionado aos favoritos",
          description: "Item adicionado à sua lista de favoritos"
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar os favoritos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    favorites,
    toggleFavorite,
    loading,
    isFavorite: (id: number) => favorites.includes(id)
  };
};
