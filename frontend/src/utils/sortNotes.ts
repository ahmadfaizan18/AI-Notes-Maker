import type { Note } from "../../types/Note";
type SortOrder = "newest" | "oldest" | "updated";

export default function sortNotes(
  notes: Note[],
  sortOrder: SortOrder,
): Note[] {
  return [...notes].sort((a, b) => {
    if (sortOrder === "newest") {
      return (
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
      );
    }

    if (sortOrder === "oldest") {
      return (
        new Date(a.created_at).getTime() -
        new Date(b.created_at).getTime()
      );
    }

    return (
      new Date(b.updated_at).getTime() -
      new Date(a.updated_at).getTime()
    );
  });
}