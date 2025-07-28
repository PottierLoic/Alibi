import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Player } from '@/lib/types';

export function useRoomPlayers(roomId: string | undefined) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roomId) return;

    let subscription: any;

    async function fetchPlayers() {
      const { data } = await supabase
        .from('players')
        .select('*')
        .eq('room_id', roomId);
      setPlayers((data as Player[]) || []);
      setLoading(false);
    }

    fetchPlayers();

    subscription = supabase
      .channel('players-room-' + roomId)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'players', filter: `room_id=eq.${roomId}` },
        () => {
          fetchPlayers();
        }
      )
      .subscribe();

    return () => {
      if (subscription) supabase.removeChannel(subscription);
    };
  }, [roomId]);

  return { players, loading };
}