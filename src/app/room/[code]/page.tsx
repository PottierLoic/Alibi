'use client';

import { useState } from 'react';
import { useRoom } from '@/hooks/useRoom';
import { useRenamePlayer } from '@/hooks/useRenamePlayer';
import { useParams } from 'next/navigation';

export default function RoomPage() {
  const params = useParams();
  const roomCode = typeof params.code === 'string' ? params.code : Array.isArray(params.code) ? params.code[0] : '';
  const { room, host, duo1, duo2, spectators, loading } = useRoom(roomCode);
  const { renamePlayer } = useRenamePlayer();

  const [copied, setCopied] = useState(false);
  const [editingHost, setEditingHost] = useState(false);
  const [hostName, setHostName] = useState(host?.pseudo || '');

  const myPseudo = typeof window !== 'undefined' ? localStorage.getItem('pseudo') : '';

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
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-green-300 mb-2 text-center">Duo 1</h2>
            <ul className="flex flex-col gap-2 items-center">
              {duo1.length > 0 ? (
                duo1.map((p) => (
                  <li key={p.id} className="bg-gray-700 rounded-lg px-4 py-1 text-gray-100 w-full text-center">{p.pseudo}</li>
                ))
              ) : (
                <li className="text-gray-500 w-full text-center">None</li>
              )}
            </ul>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-pink-300 mb-2 text-center">Duo 2</h2>
            <ul className="flex flex-col gap-2 items-center">
              {duo2.length > 0 ? (
                duo2.map((p) => (
                  <li key={p.id} className="bg-gray-700 rounded-lg px-4 py-1 text-gray-100 w-full text-center">{p.pseudo}</li>
                ))
              ) : (
                <li className="text-gray-500 w-full text-center">None</li>
              )}
            </ul>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-300 mb-2 text-center">Spectators</h2>
            <ul className="flex flex-col gap-2 items-center">
              {spectators.length > 0 ? (
                spectators.map((s) => (
                  <li key={s.id} className="bg-gray-700 rounded-lg px-4 py-1 text-gray-100 w-full text-center">{s.pseudo}</li>
                ))
              ) : (
                <li className="text-gray-500 w-full text-center">None</li>
              )}
            </ul>
          </div>
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