
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useReadingProgress = (resumoId: number) => {
  const { user } = useAuth();
  const [fontSize, setFontSize] = useState(15);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    if (user && resumoId) {
      loadReadingProgress();
    }
  }, [user, resumoId]);

  useEffect(() => {
    if (user && resumoId) {
      const saveProgress = () => {
        const currentScroll = window.pageYOffset;
        setScrollPosition(currentScroll);
        saveReadingProgress(currentScroll, fontSize);
      };

      const handleScroll = () => {
        clearTimeout((window as any).scrollTimeout);
        (window as any).scrollTimeout = setTimeout(saveProgress, 1000);
      };

      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
        clearTimeout((window as any).scrollTimeout);
      };
    }
  }, [user, resumoId, fontSize]);

  const loadReadingProgress = async () => {
    if (!user || !resumoId) return;

    try {
      const { data, error } = await supabase
        .from('user_reading_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('resumo_id', resumoId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setFontSize(data.font_size || 15);
        setScrollPosition(data.scroll_position || 0);
        
        // Restore scroll position after a short delay
        setTimeout(() => {
          window.scrollTo({ top: data.scroll_position || 0, behavior: 'smooth' });
        }, 100);
      }
    } catch (error) {
      console.error('Error loading reading progress:', error);
    }
  };

  const saveReadingProgress = async (scroll: number, font: number) => {
    if (!user || !resumoId) return;

    try {
      const { error } = await supabase
        .from('user_reading_progress')
        .upsert({
          user_id: user.id,
          resumo_id: resumoId,
          scroll_position: scroll,
          font_size: font,
          last_read: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving reading progress:', error);
    }
  };

  const updateFontSize = (newSize: number) => {
    setFontSize(newSize);
    if (user && resumoId) {
      saveReadingProgress(scrollPosition, newSize);
    }
  };

  return {
    fontSize,
    updateFontSize,
    scrollPosition
  };
};
