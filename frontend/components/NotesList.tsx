import type { Note } from "../types/Note";
import { useState } from "react";

interface NotesListProps {
  notes: Note[];
  onNoteDeleted: (id: number) => void;
  deletingId: number | null;
  onNoteEdit: (id: number, title: string, content: string) => void;
}

const NotesList = ({
  notes,
  onNoteDeleted,
  deletingId,
  onNoteEdit,
}: NotesListProps) => {
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [savingNoteId, setSavingNoteId] = useState<number | null>(null);
  const handleEditClick = (note: Note) => {
    setEditingNoteId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };
  const handleSave = async (note: Note) => {
    setSavingNoteId(note.id);

    try {
      await onNoteEdit(note.id, editTitle, editContent);
      setEditingNoteId(null);
    } finally {
      setSavingNoteId(null);
    }
  };
  return (
    <div>
      {notes.map((note) => (
        <div key={note.id}>
          {editingNoteId === note.id ? (
            <>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
              <button
                onClick={() => handleSave(note)}
                disabled={savingNoteId === note.id}
              >
                {savingNoteId === note.id ? "Saving..." : "Save"}
              </button>
            </>
          ) : (
            <>
              <h2>{note.title}</h2>
              <p>{note.content}</p>
            </>
          )}
          <button onClick={() => handleEditClick(note)}>Edit</button>
          <button
            onClick={() => onNoteDeleted(note.id)}
            disabled={deletingId === note.id}
          >
            {deletingId === note.id ? "Deleting..." : "Delete"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotesList;
