import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Room } from '@/lib/types';

export function useRoomMeta(roomCode: string) {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRoom() {
      setLoading(true);
      const { data } = await supabase
        .from('rooms')
        .select('*')
        .eq('code', roomCode)
        .single();
      setRoom(data as Room || null);
      setLoading(false);
    }
    if (roomCode) fetchRoom();
  }, [roomCode]);

  return { room, loading };
}