import type { Note } from "../types/Note";
import { useState } from "react";
import "./NotesList.css";

interface NotesListProps {
  notes: Note[];
  onNoteDeleted: (id: number) => void;
  deletingId: number | null;
  onNoteEdit: (id: number, title: string, content: string) => Promise<void>;
  deleteError: string | null;
}

const NotesList = ({
  notes,
  onNoteDeleted,
  deletingId,
  onNoteEdit,
  deleteError,
}: NotesListProps) => {
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [savingNoteId, setSavingNoteId] = useState<number | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  //const [editCancel,setEditCancel]=useState(false)

  const handleEditClick = (note: Note) => {
    setEditingNoteId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };
  const handleSave = async (note: Note) => {
    
    setSavingNoteId(note.id);
    setEditError(null);

    try {
      await onNoteEdit(note.id, editTitle, editContent);
      setEditingNoteId(null);
    } catch (error) {
      setEditError(
        error instanceof Error ? error.message : "Failed To Update Note!",
      );
    } finally {
      setSavingNoteId(null);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  return notes.length === 0 ? (
    <p>You don't have any notes yet!</p>
  ) : (
    <div className="notes-list">
      {notes.map((note) => (
        <div key={note.id} className="note">
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
              <button onClick={()=>{
                setEditingNoteId(null)
                setEditError(null)
              }}>Cancel</button>
              {editError && <p className="edit-error">{editError}</p>}
            </>
          ) : (
            <>
              <h2>{note.title}</h2>
              <p>{note.content}</p>
              <small>Created: {formatDate(note.created_at)}</small>
              <br />
              <small> Updated: {formatDate(note.updated_at)}</small>
            </>
          )}
          <div>
            {editingNoteId !== note.id && (
              <button onClick={() => handleEditClick(note)}>Edit</button>
            )}
            <button
              onClick={() => {
                if (
                  window.confirm("Are you sure you want to delete this note?")
                ) {
                  onNoteDeleted(note.id);
                }
              }}
              disabled={deletingId === note.id}
            >
              {deletingId === note.id ? "Deleting..." : "Delete"}
            </button>
            {deleteError && <p>{deleteError}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotesList;
