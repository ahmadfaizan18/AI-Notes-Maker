import { useState, useEffect } from "react";
import type { Note } from "../../types/Note";
import {
  getNotes,
  postNote,
  patchNote,
  deleteNote,
} from "../services/noteService";

export default function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);

      try {
        const fetchedNotes = await getNotes();
        setNotes(fetchedNotes);
        setError(null);
      } catch (error) {
        console.error(error);
        setError("Failed To Fetch Notes!");
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const createNote = async (title: string, content: string) => {
    const newNote = await postNote(title, content);

    setNotes((prevNotes) => [...prevNotes, newNote]);

    return newNote;
  };

  const editNote = async (id: number, title: string, content: string) => {
    try {
      const updatedNote = await patchNote(id, title, content);
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note.id === id ? updatedNote : note)),
      );
      return updatedNote;
    } catch (error) {
      throw error;
    }
  };

  const removeNote = async (id: number) => {
    setDeletingId(id);
    setDeleteError(null);

    try {
      await deleteNote(id);

      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    } catch (error) {
      console.error(error);
      setDeleteError("Failed To Delete Note!");
      throw error;
    } finally {
      setDeletingId(null);
    }
  };
  return {
    notes,
    setNotes,
    loading,
    error,
    createNote,
    editNote,
    removeNote,
    deletingId,
    deleteError,
  };
}