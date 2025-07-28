import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Room, Player } from '@/lib/types';

export function useRoom(roomCode: string) {
  const [room, setRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let subscription: any;

    async function fetchRoomAndPlayers() {
      setLoading(true);
      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .select('*')
        .eq('code', roomCode)
        .single();

      if (roomError || !roomData) {
        setRoom(null);
        setPlayers([]);
        setLoading(false);
        return;
      }

      setRoom(roomData as Room);

      const { data: playerData } = await supabase
        .from('players')
        .select('*')
        .eq('room_id', roomData.id);

      setPlayers((playerData as Player[]) || []);
      setLoading(false);

      subscription = supabase
        .channel('players-room-' + roomData.id)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'players', filter: `room_id=eq.${roomData.id}` },
          payload => {
            fetchRoomAndPlayers();
          }
        )
        .subscribe();
    }

    if (roomCode) fetchRoomAndPlayers();

    return () => {
      if (subscription) supabase.removeChannel(subscription);
    };
  }, [roomCode]);

  const host = players.find((p) => p.is_host) || null;
  const duo1 = players.filter((p) => p.duo === 1);
  const duo2 = players.filter((p) => p.duo === 2);
  const spectators = players.filter((p) => p.duo === null && !p.is_host);

  return { room, host, duo1, duo2, spectators, loading };
}