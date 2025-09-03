import type { Note } from "../models/Note";

const API_URL = import.meta.env.VITE_API_URL;

interface APIResponse<T> {
  result: T;
  statusCode: number;
  isSuccess: boolean;
  errorMessages?: string[];
}

export class NotesService {
    private static getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    const headers: { [key: string]: string } = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  static async getAllNotes(isArchived: boolean): Promise<Note[]> {
    const url = `${API_URL}?archived=${isArchived}`;
    const res = await fetch(url, {
      headers: NotesService.getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch notes");
    const data: APIResponse<Note[]> = await res.json();
    return data.result;
  }

  static async getNote(id: string): Promise<Note> {
    const res = await fetch(`${API_URL}/${id}`, {
      headers: NotesService.getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch note");
    const data: APIResponse<Note> = await res.json();
    return data.result;
  }

  static async saveNote(note: Note): Promise<Note> {
    const method = note.id ? "PUT" : "POST";
    const url = note.id ? `${API_URL}/${note.id}` : API_URL;

    const res = await fetch(url, {
      method,
      headers: NotesService.getAuthHeaders(),
      body: JSON.stringify(note),
    });

    const data: APIResponse<Note> = await res.json();
    if (!data.isSuccess) throw new Error(data.errorMessages?.join(", ") || "Failed to save note");
    return data.result;
  }

  static async updateNote(id: string, isArchived: boolean): Promise<Note> {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: NotesService.getAuthHeaders(),
      body: JSON.stringify([{ op: "replace", path: "/IsArchived", value: isArchived }]),
    });

    const data: APIResponse<Note> = await res.json();
    if (!data.isSuccess) throw new Error(data.errorMessages?.join(", ") || "Failed to update note");
    return data.result;
  }

  static async deleteNote(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/${id}`, { 
      method: "DELETE",
      headers: NotesService.getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete note");
  }

  static async updateNoteArchive(id: string, isArchived: boolean) {
    const response = await fetch(`${API_URL}/${id}/archive`, {
      method: "PATCH",
      headers: NotesService.getAuthHeaders(),
      body: JSON.stringify(isArchived),
    });

    if (!response.ok) {
      throw new Error("Failed to archive note");
    }
    return await response.json();
  }
}
  