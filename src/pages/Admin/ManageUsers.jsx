import React, { useState, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import { FaUsers, FaUserShield } from 'react-icons/fa';
import { AuthContext } from '../../providers/AuthProvider';

const ManageUsers = () => {
    const { user: loggedInUser } = useContext(AuthContext);
    const [search, setSearch] = useState('');
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const { data: users = [], isLoading, refetch } = useQuery({
        queryKey: ['users', search],
        queryFn: async () => (await axiosSecure.get(`/users?search=${search}`)).data,
    });

    // ভূমিকা পরিবর্তনের জন্য useMutation
    const { mutate: changeRole } = useMutation({
        mutationFn: ({ userId, role }) => axiosSecure.patch(`/users/role/${userId}`, { role }),
        onSuccess: () => {
            toast.success('User role updated successfully!');
            queryClient.invalidateQueries({ queryKey: ['users', search] });
        },
        onError: (err) => toast.error(err.response?.data?.message || 'Failed to update role.'),
    });

    const handleRoleChange = (user, newRole) => {
        if (window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
            changeRole({ userId: user._id, role: newRole });
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        refetch();
    };

    if (isLoading) return <div className="text-center"><span className="loading loading-spinner"></span></div>;

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Manage All Users ({users.length})</h2>
            <form onSubmit={handleSearch} className="mb-6 flex gap-2">
                <input type="text" onChange={(e) => setSearch(e.target.value)} placeholder="Search by user name..." className="input input-bordered w-full max-w-xs" />
                <button type="submit" className="btn btn-primary">Search</button>
            </form>

            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                <table className="table w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th>#</th>
                            <th>User Name</th>
                            <th>User Email</th>
                            <th>Change Role</th>
                            <th>Subscription</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user._id}>
                                <th>{index + 1}</th>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    {/* প্রধান অ্যাডমিনকে পরিবর্তন করার অপশন দেখানো হবে না */}
                                    {user.email === 'admin@gmail.com' ? (
                                        <span className="font-bold text-blue-600 flex items-center gap-1"><FaUserShield /> Main Admin</span>
                                    ) : user.role === 'admin' ? (
                                        <button onClick={() => handleRoleChange(user, 'user')} className="btn btn-sm btn-warning">
                                            Remove Admin
                                        </button>
                                    ) : (
                                        <button onClick={() => handleRoleChange(user, 'admin')} className="btn btn-sm btn-success text-white">
                                            Make Admin
                                        </button>
                                    )}
                                </td>
                                <td>
                                    {user.badge === 'Gold' ? (
                                        <span className="badge bg-yellow-400 text-black">Gold</span>
                                    ) : (
                                        <span className="badge bg-yellow-700 text-white">Bronze</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;