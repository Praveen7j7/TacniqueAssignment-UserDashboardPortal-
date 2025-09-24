import UserTableHeader from "./UserTableHeader"
import UserRow from "./UserRow"

export default function UserTable({ users, sortField, sortDir, onSort, onEdit, onDelete }) {
  return (
    <table className="w-full border-collapse border">
      <UserTableHeader sortField={sortField} sortDir={sortDir} onSort={onSort} />
      <tbody>
        {users.map(user => (
          <UserRow key={user.id} user={user} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </tbody>
    </table>
  )
}
