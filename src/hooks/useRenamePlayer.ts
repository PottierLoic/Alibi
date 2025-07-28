import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useRenamePlayer() {
  const [loading, setLoading] = useState(false);

  const renamePlayer = async (playerId: string, newPseudo: string) => {
    setLoading(true);
    const { error } = await supabase
      .from('players')
      .update({ pseudo: newPseudo })
      .eq('id', playerId);
    setLoading(false);
    return !error;
  };

  return { renamePlayer, loading };
}