import { supabase } from '@/lib/supabase';

export function useMovePlayer() {
  const movePlayer = async (playerId: string, duo: 1 | 2 | null) => {
    const { error } = await supabase
      .from('players')
      .update({ duo })
      .eq('id', playerId);
    return !error;
  };
  return { movePlayer };
}