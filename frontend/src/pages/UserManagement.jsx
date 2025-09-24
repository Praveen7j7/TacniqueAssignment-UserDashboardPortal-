import Header from "../../components/layout/Header"
import UserSearch from "../../components/users/UserSearch"
import UserFilters from "../../components/users/UserFilters"
import UserTable from "../../components/users/UserTable"
import UserPagination from "../../components/users/UserPagination"
import useUsers from "../../hooks/useUsers"

export default function UserManagement() {
  const { users, loading, error } = useUsers()

  return (
    <div className="p-6">
      <Header />
      <div className="my-4">
        <UserSearch query="" onChange={() => {}} />
      </div>
      <UserFilters filters={{}} onChange={() => {}} />
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && <UserTable users={users} sortField="id" sortDir="asc" onSort={() => {}} />}
      <UserPagination page={1} totalPages={1} perPage={10} onPageChange={() => {}} onPerPageChange={() => {}} />
    </div>
  )
}
