import { useState, useEffect, useRef } from "react";
import NoteCard from "../components/NoteCard";
import SearchBar from "../components/SearchBar";
import NotePage from "./NotePage";
import type { Note } from "../models/Note";
import { useNotes } from "../hooks/useNotes";
import { useAuth } from '../context/AuthContext'; 

const MainPage = () => {
  const { isLoggedIn } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const { notes, saveNote, archiveNote, deleteNote, loading, error } = useNotes(showArchived);
  const [selectedNote, setSelectedNote] = useState<Note | Partial<Note> | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    noteId: string | null;
    x: number;
    y: number;
  }>({
    visible: false,
    noteId: null,
    x: 0,
    y: 0,
  });
  
  const handleContextMenu = (e: React.MouseEvent, noteId: string) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      noteId,
      x: e.pageX,
      y: e.pageY,
    });
  };
  
  const handleArchiveNote = async () => {
    if (!contextMenu.noteId) return;
    const note = notes.find((n) => String(n.id) === String(contextMenu.noteId));
    if (!note) return;
    
    await archiveNote(note.id as any, !note.isArchived);
    setContextMenu({ ...contextMenu, visible: false });
};


const handleDeleteNote = async () => {
  if (!contextMenu.noteId) return;
  await deleteNote(contextMenu.noteId);
  setContextMenu({ ...contextMenu, visible: false });
};

const filteredNotes = notes.filter((note) => {
  const matchesSearch =
  note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
  note.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
  return matchesSearch;
});

useEffect(() => { const handleClickOutside = (event: MouseEvent) => {
    if (contextMenu.visible && contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
      setContextMenu({ ...contextMenu, visible: false });}};
  document.addEventListener("mousedown", handleClickOutside);
  return () => { document.removeEventListener("mousedown", handleClickOutside); };}, [contextMenu]);

if (!isLoggedIn) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600 dark:text-gray-300 text-lg">
        Please, log in to be able to see your notes.
      </p>
    </div>
  );
}

return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 font-sans flex flex-col items-center p-4">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-6">Notes</h1>

      <div className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex space-x-2">
          <button
            onClick={() => {
              if (showArchived) {
                setShowArchived(false);
                setSearchTerm("");
              }}}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              !showArchived
                ? "bg-blue-500 text-white shadow-lg"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
            }`}
          >
            All Notes
          </button>
          <button
            onClick={() => {
              if (!showArchived) {
                setShowArchived(true);
                setSearchTerm("");
              }}}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              showArchived
                ? "bg-blue-500 text-white shadow-lg"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
            }`}
          >
            Archived
          </button>
          <button
            onClick={() => setSelectedNote({})}
            className="px-4 py-2 rounded-lg font-medium bg-green-500 text-white shadow-lg transition-colors duration-200 hover:bg-green-600"
          >
            New Note
          </button>
        </div>
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
      </div>

      {loading && <p className="text-gray-500 dark:text-gray-400">Loading notes...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onClick={() => setSelectedNote(note)}
              onContextMenu={(e) => handleContextMenu(e, note.id as any)}
            />
          ))
        ) : (
          <p className="col-span-3 text-center text-gray-500 dark:text-gray-400">
            No notes found.
          </p>
        )}
      </div>

      {contextMenu.visible && (
        <div
          ref = {contextMenuRef}
          className="absolute z-50 bg-white dark:bg-gray-700 shadow-lg rounded-lg py-2"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onBlur={() => setContextMenu({ ...contextMenu, visible: false })}
        >
          <button
            onClick={handleArchiveNote}
            className="w-full text-left px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            {(() => {
              const note = notes.find((n) => String(n.id) === String(contextMenu.noteId));
              return note && note.isArchived ? "Unarchive" : "Archive";
            })()} Note
          </button>
          <button
            onClick={handleDeleteNote}
            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900"
          >
            Delete Note
          </button>
        </div>
      )}

      {selectedNote && (
        <NotePage
          note={selectedNote}
          onClose={() => setSelectedNote(null)}
          onSave={saveNote}
        />
      )}
    </div>
  );
};

export default MainPage;
