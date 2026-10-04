import { useState, useEffect } from "react";
import type { Note } from "../types/Note";
import CreateNote from "../components/CreateNote.tsx";
import NotesList from "../components/NotesList";
import { getNotes, deleteNote, patchNote } from "./services/noteService";

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showNotes, setShowNotes] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const notes = await getNotes();
        setNotes(notes);
      } catch (error) {
        console.error(error);
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
    try {
      await deleteNote(id);
      setNotes((prevNotes) => prevNotes.filter((ele) => ele.id != id));
    } catch (error) {
      console.error(error);
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
        prevNotes.map((ele) => (ele.id === id ? note: ele)),
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h1>AI Notes Maker</h1>

      <CreateNote onNoteCreated={handleNoteCreated} />

      {showNotes && (
        <NotesList
          notes={notes}
          onNoteDeleted={handleDeleteANote}
          onNoteEdit={handleEditANote}
        />
      )}

      <button onClick={viewNotes}>
        {showNotes ? "Close" : "View Your Notes"}
      </button>
    </>
  );
}
