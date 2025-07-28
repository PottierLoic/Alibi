import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { generateRoomCode } from '@/lib/utils';

export function useCreateRoom() {
  const [loading, setLoading] = useState(false);

  const createRoom = async () => {
    setLoading(true);
    const playerId = uuidv4();
    const roomCode = generateRoomCode();
    const pseudo = 'Host';

    const { data: roomData, error: roomError } = await supabase
      .from('rooms')
      .insert({
        code: roomCode,
        status: 'lobby',
        host_id: playerId,
        alibi: 'Default Alibi',
      })
      .select()
      .single();

    if (roomError || !roomData) {
      setLoading(false);
      return { error: 'Error creating room' };
    }

    const { error: playerError } = await supabase
      .from('players')
      .insert({
        id: playerId,
        room_id: roomData.id,
        pseudo,
        is_host: true,
      });

    setLoading(false);

    if (playerError) {
      return { error: 'Error joining as host' };
    }

    return { roomCode, playerId, pseudo };
  };

  return { createRoom, loading };
}