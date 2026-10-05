import { useState } from "react";
import type { Note } from "../types/Note";
import { postNote } from "../src/services/noteService";

interface CreateNoteProps {
  onNoteCreated: (note: Note) => void;
}

const CreateNote = ({ onNoteCreated }: CreateNoteProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const note = await postNote(title, content);
      onNoteCreated(note);
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
    <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Note title"
          />

          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Write your note..."
          />

          <button type="submit" disabled={loading}>
            {loading ? "Posting..." : "Save Your Note"}
          </button>
          {error && <p>{error}</p>}
        </div>
    </form>
  );
};

export default CreateNote;
