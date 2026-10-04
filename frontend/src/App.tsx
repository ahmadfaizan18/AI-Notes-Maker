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
  const handleDeleteANote = async (id: number) => {
    console.log("delete clicked");
    try {
      const response = await fetch(`http://localhost:3000/api/v1/notes/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setNotes((prevNotes) => prevNotes.filter((ele) => ele.id != id));
      } else throw new Error("Failed To Fetch");
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditANote = async (
    id: number,
    title: string,
    content: string,
  ) => {
    console.log("edit clicked");
    try {
      const response = await fetch(`http://localhost:3000/api/v1/notes/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          content: content,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setNotes((prevNotes) =>
          prevNotes.map((ele) => (ele.id === id ? data.data.note : ele)),
        );
      } else throw new Error("Failed To Fetch");
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
