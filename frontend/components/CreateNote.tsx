import { useState } from "react";
import type { Note } from "../types/Note";

interface CreateNoteProps {
  onNoteCreated: (note: Note) => void;
}

const CreateNote = ({ onNoteCreated }: CreateNoteProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const note: Note = {
      id: Date.now(),
      title: title,
      content: content,
      created_at: new Date().toISOString(),
      modified_at: new Date().toISOString(),
    };

    onNoteCreated(note);

    setTitle("");
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit}>
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

      <button type="submit">Save Your Note</button>
    </form>
  );
};

export default CreateNote;