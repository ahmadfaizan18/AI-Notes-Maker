import type { Note } from "../types/Note";

interface NotesListProps {
  notes: Note[];
}

const NotesList = ({ notes }: NotesListProps) => {
  return (
    <div>
      {notes.map((note) => (
        <div key={note.id}>
          <h2>{note.title}</h2>
          <p>{note.content}</p>
          <button>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default NotesList;