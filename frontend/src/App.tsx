import { useState, useEffect } from "react";
import type { Note } from "../types/Note";
import CreateNote from "../components/CreateNote.tsx";
import NotesList from "../components/NotesList";
import { getNotes, deleteNote, patchNote } from "./services/noteService";
import "./App.css";

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showNotes, setShowNotes] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [showCreateNote, setShowCreateNote] = useState(false);

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
    setDeleteError(null);
    setDeletingId(id);
    try {
      await deleteNote(id);
      setNotes((prevNotes) => prevNotes.filter((ele) => ele.id !== id));
    } catch (error) {
      console.error(error);
      setDeleteError("Failed To Delete The Note :(");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditANote = async (
    id: number,
    title: string,
    content: string,
  ): Promise<void> => {
    try {
      const note = await patchNote(id, title, content);
      setNotes((prevNotes) =>
        prevNotes.map((ele) => (ele.id === id ? note : ele)),
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const showCreateNoteFunc = () => {
    setShowCreateNote(!showCreateNote);
  };

  return (
    <>
      <h1 className="main-title">AI Notes Maker</h1>

      {loading && <p>Loading notes...</p>}
      {error && <p>{error}</p>}

      <div className="main-buttons">
        {showCreateNote ? (
          <CreateNote
            onNoteCreated={handleNoteCreated}
            onCancel={showCreateNoteFunc}
          />
        ) : (
          <button className="create-note-btn" onClick={showCreateNoteFunc}>Create A Note!</button>
        )}
        {showNotes && (
          <NotesList
            notes={notes}
            onNoteDeleted={handleDeleteANote}
            deletingId={deletingId}
            onNoteEdit={handleEditANote}
            deleteError={deleteError}
          />
        )}

        <button className="view-notes-btn" onClick={viewNotes}>
          {showNotes ? "Close" : "View Your Notes"}
        </button>
      </div>
    </>
  );
}
