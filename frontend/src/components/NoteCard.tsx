import React from 'react';
import type { Note } from '../models/Note';

const NoteCard = ({ note, onClick, onContextMenu }: { 
    note: Note; 
    onClick: () => void; 
    onContextMenu: (e: React.MouseEvent) => void; 
  }) => {
  return (
    <div
      onClick={onClick}
      onContextMenu={onContextMenu}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-500 ease-in-out p-6 flex flex-col justify-between transform hover:scale-105 cursor-pointer"
      style={{
        height: '200px', 
      }}
    >
      <div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">{note.title || "Untitled"}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 4,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>{note.content}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {note.tags && note.tags.map(tag => (
          <span key={tag} className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default NoteCard;