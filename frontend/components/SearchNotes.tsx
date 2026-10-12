import type { Note } from "../types/Note";
import sortNotes from "../src/utils/sortNotes";
import { useState, useMemo } from "react";
import NotesList from "./NotesList";
import SortDropdown from "./SortDropdown";

interface SearchNotesProps {
  notes: Note[];
  onNoteDeleted: (id: number) => void;
  deletingId: number | null;
  onNoteEdit: (id: number, title: string, content: string) => Promise<void>;
  deleteError: string | null;
  onClose: () => void;
}

export default function SearchNotes({
  notes,
  onNoteDeleted,
  deletingId,
  onNoteEdit,
  deleteError,
  onClose,
}: SearchNotesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSortOrder, setSearchSortOrder] = useState<
    "newest" | "oldest" | "updated"
  >("newest");
  const searchedNotes = useMemo(() => {
    const filterNotes = notes.filter(
      (note) =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    return sortNotes(filterNotes, searchSortOrder);
  }, [notes, searchQuery, searchSortOrder]);
  return (
    <>
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
            setSearchQuery("");
            onClose();
          }}
        >
          Close
        </button>
      </div>
      {searchQuery.trim() !== "" && (
        <div className="notes-section">
          <SortDropdown
            sortOrder={searchSortOrder}
            onSortChange={setSearchSortOrder}
          />
          {searchedNotes.length > 0 ? (
            <NotesList
              notes={searchedNotes}
              onNoteDeleted={onNoteDeleted}
              deletingId={deletingId}
              onNoteEdit={onNoteEdit}
              deleteError={deleteError}
            />
          ) : (
            <p className="no-search-results">No Matching Results Found</p>
          )}
        </div>
      )}
    </>
  );
}
