import { useState } from "react";
import type { Note } from "../types/Note";
import "./CreateNote.css";

interface CreateNoteProps {
  onNoteCreated: (title: string, content: string) => Promise<Note>;
  onCancel: () => void;
}

const CreateNote = ({ onNoteCreated, onCancel }: CreateNoteProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      await onNoteCreated(title, content);
      setTitle("");
      setContent("");
      //setLoading(false);
      setError(null);
    } catch (error) {
      console.log(error);
      setError("Failed To Creata A Note!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="create-note-form" onSubmit={handleSubmit}>
      <div>
        <input
          className="note-title-input"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Note title"
          required
        />

        <textarea
          className="note-content-input"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Write your note..."
          required
        />

        <div className="note-form-buttons">
          <button className="save-note-btn" type="submit" disabled={loading}>
            {loading ? "Posting..." : "Save Your Note"}
          </button>
          <button className="cancel-note-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
        {error && <p>{error}</p>}
      </div>
    </form>
  );
};

export default CreateNote;
