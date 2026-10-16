import { useState, useMemo, useRef } from "react";
import CreateNote from "../components/CreateNote.tsx";
import NotesList from "../components/NotesList";
import SortDropdown from "../components/SortDropdown.tsx";
import sortNotes from "./utils/sortNotes";
import "./App.css";
import SearchNotes from "../components/SearchNotes";
import useNotes from "./hooks/useNotes";

export default function App() {
  const {
    notes,
    loading,
    error,
    createNote,
    editNote,
    removeNote,
    deletingId,
    deleteError,
  } = useNotes();
  const [showNotes, setShowNotes] = useState(false);
  const [showCreateNote, setShowCreateNote] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "updated">(
    "newest",
  );
  const [savedMessage, setSavedMessage] = useState("");
  const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sortedNotes = useMemo(() => {
    const notesCopy = [...notes];

    return sortNotes(notesCopy, sortOrder);
  }, [notes, sortOrder]);

  const handleNoteCreated = async (title: string, content: string) => {
    const note = await createNote(title, content);

    setShowCreateNote(false);
    setSavedMessage("Note Created Succesfully!");

    if (successTimer.current !== null) clearTimeout(successTimer.current);
    successTimer.current = setTimeout(() => {
      setSavedMessage("");
    }, 10000);
    return note;
  };

  const viewNotes = () => {
    setShowNotes((prev) => !prev);
  };

  const handleDeleteANote = async (id: number) => {
    await removeNote(id);
  };

  const handleEditANote = async (
    id: number,
    title: string,
    content: string,
  ) => {
    return editNote(id, title, content);
  };

  const showCreateNoteFunc = () => {
    setShowCreateNote((prev) => !prev);
  };

  return (
    <>
      <h1 className="main-title">AI Notes Maker</h1>

      {loading && <p>Loading notes...</p>}
      {error && <p className="fetch-error">{error}</p>}

      <div className="main-buttons">
        {showCreateNote ? (
          <CreateNote
            onNoteCreated={handleNoteCreated}
            onCancel={showCreateNoteFunc}
          />
        ) : (
            <button className="create-note-btn" onClick={showCreateNoteFunc}>
              Create A Note!
            </button>
        )}
        {savedMessage && <p className="success-message">{savedMessage}</p>}
        {showNotes && (
          <div className="notes-section">
            <SortDropdown sortOrder={sortOrder} onSortChange={setSortOrder} />
            <NotesList
              notes={sortedNotes}
              onNoteDeleted={handleDeleteANote}
              deletingId={deletingId}
              onNoteEdit={handleEditANote}
              deleteError={deleteError}
            />
          </div>
        )}

        <button className="view-notes-btn" onClick={viewNotes}>
          {showNotes ? "Close" : "View Your Notes"}
        </button>
        {showSearch ? (
          <SearchNotes
            notes={notes}
            onNoteDeleted={handleDeleteANote}
            deletingId={deletingId}
            onNoteEdit={handleEditANote}
            deleteError={deleteError}
            onClose={() => setShowSearch(false)}
          />
        ) : (
          <button
            className="search-notes-btn"
            onClick={() => setShowSearch((prev) => !prev)}
          >
            Search...
          </button>
        )}
      </div>
    </>
  );
}
