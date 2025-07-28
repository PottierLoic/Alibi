'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useCreateRoom } from '@/hooks/useCreateRoom';

export default function Home() {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState('');
  const { createRoom, loading } = useCreateRoom();

  const handleCreateParty = async () => {
    const result = await createRoom();
    if (result.error) {
      toast.error(result.error);
      return;
    }

    localStorage.setItem('playerId', result.playerId ?? '');
    localStorage.setItem('pseudo', result.pseudo ?? '');

    toast.success(`Room created: ${result.roomCode}`);
    router.push(`/room/${result.roomCode}`);
  };

  const handleJoinParty = () => {
    if (!joinCode.trim()) {
      toast.error('Enter a valid code');
      return;
    }
    router.push(`/join?code=${joinCode}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-gray-100 p-4">
      <h1 className="text-4xl font-extrabold mb-6 text-white drop-shadow-lg">Alibi Game</h1>
      <p className="text-center mb-8 max-w-md text-gray-300">
        Inspired by Squeezie&apos;s Alibi! Two duos learn an alibi, fill in the blanks together, then get interrogated separately. Match answers to score points!
      </p>
      <div className="w-full max-w-sm space-y-6 bg-gray-800/80 rounded-xl shadow-lg p-6">
        <button
          onClick={handleCreateParty}
          disabled={loading}
          className="w-full py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors shadow disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Party'}
        </button>
        <div className="flex flex-col space-y-3">
          <input
            className="w-full py-2 px-3 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            type="text"
            placeholder="Enter party code"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
          />
          <button
            onClick={handleJoinParty}
            className="w-full py-3 px-4 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors shadow"
          >
            Join Party
          </button>
        </div>
      </div>
    </div>
  );
}