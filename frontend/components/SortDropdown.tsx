type SortOrder = "newest" | "oldest" | "updated";
interface SortDropdownProps {
  sortOrder: string;
  onSortChange: (value: SortOrder) => void;
}

export default function SortDropdown({
  sortOrder,
  onSortChange,
}: SortDropdownProps) {
  return (
    <select
      className="sort-dropdown"
      value={sortOrder}
      onChange={(event) => {
        const value = event.target.value;

        if (value === "newest" || value === "oldest" || value === "updated") {
          onSortChange(value);
        }
      }}
    >
      <option value="newest">Newest First</option>
      <option value="oldest">Oldest First</option>
      <option value="updated">Recently Updated</option>
    </select>
  );
}
