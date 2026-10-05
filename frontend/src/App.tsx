import { useState, useEffect } from "react";
import type { Note } from "../types/Note";
import CreateNote from "../components/CreateNote.tsx";
import NotesList from "../components/NotesList";
import { getNotes, deleteNote, patchNote } from "./services/noteService";

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showNotes, setShowNotes] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const notes = await getNotes();
        setError(null);
        setNotes(notes);
      } catch (error) {
        console.error(error);
        setError("failed to fetch notes");
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const handleNoteCreated = (note: Note) => {
    setNotes((prevNotes) => [...prevNotes, note]);
  };
  const viewNotes = () => {
    setShowNotes(!showNotes);
  };
  const handleDeleteANote = async (id: number) => {
    setDeletingId(id);
    try {
      await deleteNote(id);
      setNotes((prevNotes) => prevNotes.filter((ele) => ele.id !== id));
    } catch (error) {
      console.error(error);
      setDeletingId(null);
      throw error;
    }
  };

  const handleEditANote = async (
    id: number,
    title: string,
    content: string,
  ) => {
    try {
      const note = await patchNote(id, title, content);
      setNotes((prevNotes) =>
        prevNotes.map((ele) => (ele.id === id ? note : ele)),
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h1>AI Notes Maker</h1>

      {loading && <p>Loading notes...</p>}
      {error && <p>{error}</p>}
      <CreateNote onNoteCreated={handleNoteCreated} />

      {showNotes && (
        <NotesList
          notes={notes}
          onNoteDeleted={handleDeleteANote}
          deletingId={deletingId}
          onNoteEdit={handleEditANote}
        />
      )}

      <button onClick={viewNotes}>
        {showNotes ? "Close" : "View Your Notes"}
      </button>
    </>
  );
}
