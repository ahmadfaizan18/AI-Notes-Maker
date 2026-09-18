import { useState, useEffect } from "react";
import type { Note } from "../types/Note";
import CreateNote from "../components/CreateNote.tsx";
import NotesList from "../components/NotesList";

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showNotes, setShowNotes] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/notes", {
          method: "GET",
        });
        if (response.ok) {
          const data = await response.json();
          setNotes(data.data.notes);
        } else throw new Error("Failed To Fetch");
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

  return (
    <>
      <h1>AI Notes Maker</h1>

      <CreateNote onNoteCreated={handleNoteCreated} />

      {showNotes && <NotesList notes={notes} />}
      
      <button onClick={viewNotes}>
        {showNotes ? "Close" : "View Your Notes"}
      </button>

    </>
  );
}
