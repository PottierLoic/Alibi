import React, { useState } from 'react';
import { Player } from '@/lib/types';

interface PlayerListProps {
  title: string;
  players: Player[];
  myPlayer?: Player;
  onRename: (id: string, oldPseudo: string, newPseudo: string) => void;
  onMove?: () => void;
  teamValue?: 1 | 2 | null;
}

export function PlayerList({
  title,
  players,
  myPlayer,
  onRename,
  onMove,
  teamValue,
}: PlayerListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>('');

  const canMove =
    onMove &&
    myPlayer &&
    !myPlayer.is_host &&
    myPlayer.duo !== teamValue &&
    (teamValue === null || players.length < 2);

  return (
    <div className="flex-1">
      <h2 className="text-lg font-semibold mb-2 text-center">{title}</h2>
      <ul className="flex flex-col gap-2 items-center">
        {players.length > 0 ? (
          players.map((p) => (
            <li key={p.id} className="bg-gray-700 rounded-lg px-4 py-1 text-gray-100 w-full text-center flex items-center justify-center gap-2">
              {editingId === p.id ? (
                <>
                  <input
                    className="bg-gray-800 text-gray-100 rounded px-2 py-1 w-32"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    autoFocus
                  />
                  <button
                    className="text-green-400 hover:text-green-600"
                    onClick={() => {
                      onRename(p.id, p.pseudo, editName);
                      setEditingId(null);
                    }}
                    title="Save"
                  >
                    ✔
                  </button>
                  <button
                    className="text-red-400 hover:text-red-600"
                    onClick={() => {
                      setEditingId(null);
                      setEditName(p.pseudo);
                    }}
                    title="Cancel"
                  >
                    ✖
                  </button>
                </>
              ) : (
                <>
                  {p.pseudo}
                  {myPlayer && myPlayer.id === p.id && (
                    <button
                      className="ml-2 text-indigo-400 hover:text-indigo-600"
                      onClick={() => {
                        setEditingId(p.id);
                        setEditName(p.pseudo);
                      }}
                      title="Edit name"
                    >
                      ✎
                    </button>
                  )}
                </>
              )}
            </li>
          ))
        ) : (
          <li className="text-gray-500 w-full text-center">None</li>
        )}
      </ul>
      {canMove && (
        <button
          className="mt-3 w-full py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
          onClick={onMove}
        >
          Move yourself here
        </button>
      )}
    </div>
  );
}