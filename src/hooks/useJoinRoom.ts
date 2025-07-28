import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export function useJoinRoom() {
  const [loading, setLoading] = useState(false);

  const joinRoom = async (code: string, username: string) => {
    setLoading(true);
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('id')
      .eq('code', code)
      .single();

    if (roomError || !room) {
      setLoading(false);
      return { error: 'Room not found' };
    }

    const playerId = uuidv4();

    const { error: playerError } = await supabase
      .from('players')
      .insert({
        id: playerId,
        pseudo: username,
        duo: null,
        is_host: false,
        room_id: room.id,
      });

    setLoading(false);
    if (playerError) {
      return { error: 'Could not join room' };
    }
    return { success: true, playerId };
  };

  return { joinRoom, loading };
}