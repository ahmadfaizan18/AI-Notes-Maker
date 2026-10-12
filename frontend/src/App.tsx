import { useState, useEffect, useMemo } from "react";
import type { Note } from "../types/Note";
import CreateNote from "../components/CreateNote.tsx";
import NotesList from "../components/NotesList";
import { getNotes, deleteNote, patchNote } from "./services/noteService";
import "./App.css";

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showNotes, setShowNotes] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [showCreateNote, setShowCreateNote] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [searchSortOrder, setSearchSortOrder] = useState("newest");

  const sortedNotes = useMemo(() => {
    const notesCopy = [...notes];

    if (sortOrder === "newest") {
      return notesCopy.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    }

    if (sortOrder === "oldest") {
      return notesCopy.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      );
    }

    return notesCopy.sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    );
  }, [notes, sortOrder]);

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const notes = await getNotes();
        setError(null);
        setNotes(notes);
      } catch (error) {
        console.error(error);
        setError("failed To Fetch Notes!");
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const handleNoteCreated = (note: Note) => {
    setNotes((prevNotes) => [...prevNotes, note]);
  };
  const viewNotes = () => {
    setShowNotes((prev) => !prev);
  };
  const handleDeleteANote = async (id: number) => {
    setDeleteError(null);
    setDeletingId(id);
    try {
      await deleteNote(id);
      setNotes((prevNotes) => prevNotes.filter((ele) => ele.id !== id));
    } catch (error) {
      console.error(error);
      setDeleteError("Failed To Delete The Note :(");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditANote = async (
    id: number,
    title: string,
    content: string,
  ): Promise<void> => {
    try {
      const note = await patchNote(id, title, content);
      setNotes((prevNotes) =>
        prevNotes.map((ele) => (ele.id === id ? note : ele)),
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const showCreateNoteFunc = () => {
    setShowCreateNote((prev) => !prev);
  };

  const searchedNotes = useMemo(() => {
    const filterNotes = notes.filter(
      (note) =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    return filterNotes.sort((a, b) => {
      if (searchSortOrder === "newest")
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      else if (searchSortOrder == "oldest")
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      return (
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    });
  }, [notes, searchQuery, searchSortOrder]);

  return (
    <>
      <h1 className="main-title">AI Notes Maker</h1>

      {loading && <p>Loading notes...</p>}
      {error && <p>{error}</p>}

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
        {showNotes && (
          <div className="notes-section">
            <select
              className="sort-dropdown"
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="updated">Recently Updated</option>
            </select>
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
          <div>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search by text or content..."
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                }}
                required
              ></input>
              <button
                type="button"
                onClick={() => {
                  setShowSearch(false);
                  setSearchQuery("");
                }}
              >
                Close
              </button>
            </div>
            {searchQuery.trim() !== "" && (
              <div className="notes-section">
                <select
                  className="sort-dropdown"
                  value={searchSortOrder}
                  onChange={(event) => setSearchSortOrder(event.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="updated">Recently Updated</option>
                </select>
                {searchedNotes.length > 0 ? (
                  <NotesList
                    notes={searchedNotes}
                    onNoteDeleted={handleDeleteANote}
                    deletingId={deletingId}
                    onNoteEdit={handleEditANote}
                    deleteError={deleteError}
                  />
                ) : (
                  <p className="no-search-results">No Matching Results Found</p>
                )}
              </div>
            )}
          </div>
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
