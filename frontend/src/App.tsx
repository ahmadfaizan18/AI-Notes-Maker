import { useState } from "react";
import type { Note } from "../types/Note";
import CreateNote from "../components/CreateNote.tsx";

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);

  const handleNoteCreated = (note: Note) => {
    setNotes((prevNotes) => [...prevNotes, note]);
  };

  return (
    <>
      <h1>AI Notes Maker</h1>

      <CreateNote onNoteCreated={handleNoteCreated} />
      
      {notes.map((note) => (
        <div key={note.id}>
          <p>{note.title}</p>
          <p>{note.content}</p>
        </div>
      ))}

      <button>View Your Notes</button>
    </>
  );
}