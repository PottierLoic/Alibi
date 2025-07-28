'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { useJoinRoom } from '@/hooks/useJoinRoom';

export default function JoinPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code') || '';
  const [username, setUsername] = useState('');
  const { joinRoom, loading } = useJoinRoom();

  const handleJoin = async () => {
    const result = await joinRoom(code, username);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    localStorage.setItem('pseudo', username);
    router.push(`/room/${code}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-gray-100 p-4">
      <div className="w-full max-w-sm bg-gray-800/80 rounded-xl shadow-lg p-6 space-y-6">
        <h1 className="text-2xl font-bold text-indigo-400 mb-2 text-center">Join Room</h1>
        <p className="text-center text-gray-300 mb-4">
          Enter your username to join party <span className="font-mono text-indigo-300">{code}</span>
        </p>
        <input
          className="w-full py-2 px-3 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          type="text"
          placeholder="Your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          maxLength={20}
          disabled={loading}
        />
        <button
          onClick={handleJoin}
          disabled={loading}
          className="w-full py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors shadow disabled:opacity-50"
        >
          {loading ? 'Joining...' : 'Enter'}
        </button>
      </div>
    </div>
  );
}