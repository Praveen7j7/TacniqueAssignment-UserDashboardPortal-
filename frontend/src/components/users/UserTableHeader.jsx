export default function UserTableHeader({ sortField, sortDir, onSort }) {
  const headers = ["id", "firstName", "lastName", "email", "department"]

  return (
    <thead className="bg-gray-100">
      <tr>
        {headers.map(h => (
          <th
            key={h}
            className="p-2 cursor-pointer"
            onClick={() => onSort(h)}
          >
            {h.toUpperCase()}
            {sortField === h ? (sortDir === "asc" ? " ▲" : " ▼") : ""}
          </th>
        ))}
        <th className="p-2">Actions</th>
      </tr>
    </thead>
  )
}
