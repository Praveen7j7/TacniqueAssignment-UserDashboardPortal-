export default function UserRow({ user, onEdit, onDelete }) {
  return (
    <tr className="border-b">
      <td className="p-2">{user.id}</td>
      <td className="p-2">{user.firstName}</td>
      <td className="p-2">{user.lastName}</td>
      <td className="p-2">{user.email}</td>
      <td className="p-2">{user.department}</td>
      <td className="p-2 space-x-2">
        <button onClick={() => onEdit(user)} className="text-blue-600">Edit</button>
        <button onClick={() => onDelete(user.id)} className="text-red-600">Delete</button>
      </td>
    </tr>
  )
}
