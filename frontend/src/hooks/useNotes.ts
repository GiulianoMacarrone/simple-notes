import { useState, useEffect } from "react";
import { NotesService } from "../services/NotesService";
import type { Note } from "../models/Note";

export const useNotes = (showArchived: boolean) => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchNotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await NotesService.getAllNotes(showArchived); 
      setNotes(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
    };

    useEffect(() => {
        fetchNotes();
    }, [showArchived]);

    const saveNote = async (note: Note | Partial<Note>) => {
        try {
            await NotesService.saveNote(note as Note);
            await fetchNotes();
        } catch (err: any) {
            setError(err.message || "Failed to save note");
        }
    };

    const archiveNote = async (id: string, isArchived: boolean) => {
    try {
        await NotesService.updateNoteArchive(id, isArchived);
        await fetchNotes();
    } catch (err: any) {
        setError(err.message || "Failed to archive note");
    }
    };
    const deleteNote = async (id: string) => {
        try {
            await NotesService.deleteNote(id);
            await fetchNotes();
        } catch (err: any) {
            setError(err.message || "Failed to delete note");
        }
    };

    return {
        notes,
        loading,
        error,
        saveNote,
        archiveNote,
        deleteNote,
        fetchNotes,
    };
}