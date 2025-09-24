import { useEffect, useState } from "react"
import { getUsers, addUser, updateUser, deleteUser } from "../services/api"

export default function useUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    getUsers()
      .then(res => setUsers(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return { users, setUsers, loading, error, addUser, updateUser, deleteUser }
}
