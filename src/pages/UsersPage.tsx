import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';

interface User {
  name: string;
  surname: string;
  taxCode: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Retrieve the JWT token from localStorage
      const jwtToken = localStorage.getItem('jwtToken');
      if (!jwtToken) {
        throw new Error('User is not authenticated.');
      }

      const response = await axiosClient.get('/users', {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      console.log('Response:', response.data); // Log the response data
      setUsers(response.data.content);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <table className="table-auto border-collapse border border-gray-300 w-full">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Surname</th>
              <th className="border border-gray-300 px-4 py-2">Tax Code</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                <td className="border border-gray-300 px-4 py-2">{user.surname}</td>
                <td className="border border-gray-300 px-4 py-2">{user.taxCode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}