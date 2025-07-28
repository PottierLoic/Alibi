'use client';

import { useState } from 'react';
import { useRoomMeta } from '@/hooks/useRoomMeta';
import { useRoomPlayers } from '@/hooks/useRoomPlayers';
import { useRenamePlayer } from '@/hooks/useRenamePlayer';
import { useMovePlayer } from '@/hooks/useMovePlayer';
import { useParams } from 'next/navigation';
import { PlayerList } from '@/components/PlayerList';

export default function RoomPage() {
  const params = useParams();
  const roomCode = typeof params.code === 'string' ? params.code : Array.isArray(params.code) ? params.code[0] : '';
  const { room } = useRoomMeta(roomCode);
  const { players } = useRoomPlayers(room?.id);
  const { renamePlayer } = useRenamePlayer();
  const { movePlayer } = useMovePlayer();

  // Split players
  const host = players.find((p) => p.is_host) || null;
  const duo1 = players.filter((p) => p.duo === 1);
  const duo2 = players.filter((p) => p.duo === 2);
  const spectators = players.filter((p) => p.duo === null && !p.is_host);

  const [copied, setCopied] = useState(false);
  const [editingHost, setEditingHost] = useState(false);
  const [hostName, setHostName] = useState(host?.pseudo || '');

  const myPseudo = typeof window !== 'undefined' ? localStorage.getItem('pseudo') ?? '' : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleStart = () => {
    alert('Game started!');
  };

  const handleHostRename = async () => {
    if (host && hostName.trim() && hostName !== host.pseudo) {
      const success = await renamePlayer(host.id, hostName.trim());
      if (success) {
        setEditingHost(false);
        setHostName(hostName.trim());
        if (myPseudo === host.pseudo) {
          localStorage.setItem('pseudo', hostName.trim());
        }
        host.pseudo = hostName.trim();
      }
    }
  };

  const handlePlayerRename = async (playerId: string, oldPseudo: string, newPseudo: string) => {
    if (newPseudo.trim() && newPseudo !== oldPseudo) {
      const success = await renamePlayer(playerId, newPseudo.trim());
      if (success && myPseudo === oldPseudo) {
        localStorage.setItem('pseudo', newPseudo.trim());
      }
    }
  };

  const handleMovePlayer = async (playerId: string, duo: 1 | 2 | null) => {
    await movePlayer(playerId, duo);
  };

  const myPlayer = players.find((p) => p.pseudo === myPseudo);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-gray-100 p-6">
      <div className="w-full max-w-5xl bg-gray-800/80 rounded-xl shadow-lg p-6 mt-8 flex flex-col">
        <div className="flex flex-col items-center mb-8">
          <span className="text-3xl font-bold tracking-widest text-indigo-400">{roomCode}</span>
          <button
            onClick={handleCopy}
            className="mt-2 text-sm text-gray-300 hover:text-indigo-300 transition-colors"
          >
            {copied ? 'Copied!' : 'Click to copy/share'}
          </button>
        </div>
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-lg font-semibold text-indigo-300 mb-2 text-center">Host</h2>
          <ul className="flex flex-col gap-2 items-center">
            {host ? (
              <li className="bg-gray-700 rounded-lg p-2 px-4 text-gray-100 w-full text-center flex items-center justify-center gap-2">
                {editingHost ? (
                  <>
                    <input
                      className="bg-gray-800 text-gray-100 rounded px-2 py-1 w-32"
                      value={hostName}
                      onChange={e => setHostName(e.target.value)}
                      autoFocus
                    />
                    <button
                      className="text-green-400 hover:text-green-600"
                      onClick={handleHostRename}
                      title="Save"
                    >
                      ✔
                    </button>
                    <button
                      className="text-red-400 hover:text-red-600"
                      onClick={() => {
                        setEditingHost(false);
                        setHostName(host.pseudo);
                      }}
                      title="Cancel"
                    >
                      ✖
                    </button>
                  </>
                ) : (
                  <>
                    {host.pseudo}
                    {myPseudo === host.pseudo && (
                      <button
                        className="ml-2 text-indigo-400 hover:text-indigo-600"
                        onClick={() => setEditingHost(true)}
                        title="Edit name"
                      >
                        ✎
                      </button>
                    )}
                  </>
                )}
              </li>
            ) : (
              <li className="text-gray-500 w-full text-center">None</li>
            )}
          </ul>
        </div>
        <div className="flex flex-row gap-6 justify-center items-start w-full">
          <PlayerList
            title="Duo 1"
            players={duo1}
            myPlayer={myPlayer}
            onRename={handlePlayerRename}
            onMove={() => myPlayer?.id && handleMovePlayer(myPlayer.id, 1)}
            teamValue={1}
          />
          <PlayerList
            title="Duo 2"
            players={duo2}
            myPlayer={myPlayer}
            onRename={handlePlayerRename}
            onMove={() => myPlayer?.id && handleMovePlayer(myPlayer.id, 2)}
            teamValue={2}
          />
          <PlayerList
            title="Spectators"
            players={spectators}
            myPlayer={myPlayer}
            onRename={handlePlayerRename}
            onMove={() => myPlayer?.id && handleMovePlayer(myPlayer.id, null)}
            teamValue={null}
          />
        </div>
        <button
          onClick={handleStart}
          className="mt-10 w-full py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors shadow"
        >
          Start Game
        </button>
      </div>
    </div>
  );
}