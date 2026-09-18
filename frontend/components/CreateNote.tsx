import { useState } from "react";
import type { Note } from "../types/Note";

interface CreateNoteProps {
  onNoteCreated: (note: Note) => void;
}

const CreateNote = ({ onNoteCreated }: CreateNoteProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await fetch("http://localhost:3000/api/v1/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body:JSON.stringify({
        title:title,
        content:content
    })
    });

    const data = await response.json();

    const note:Note=data.data.note;

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
