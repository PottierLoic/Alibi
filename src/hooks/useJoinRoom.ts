import { useState } from 'react';
import { supabase } from '@/lib/supabase';

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

    const { error: playerError } = await supabase
      .from('players')
      .insert({
        pseudo: username,
        duo: null,
        is_host: false,
        room_id: room.id,
      });

    setLoading(false);
    if (playerError) {
      return { error: 'Could not join room' };
    }
    return { success: true };
  };

  return { joinRoom, loading };
}