import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import { FaUsers, FaUserShield } from 'react-icons/fa';

const ManageUsers = () => {
    const [search, setSearch] = useState('');
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    // Tanstack Query দিয়ে সব ইউজারদের ডেটা আনা হচ্ছে
    const { data: users = [], isLoading, refetch } = useQuery({
        // search স্টেট পরিবর্তন হলে এই কোয়েরি আবার রান হবে
        queryKey: ['users', search],
        queryFn: async () => (await axiosSecure.get(`/users?search=${search}`)).data,
    });

    // কোনো ইউজারকে অ্যাডমিন বানানোর জন্য useMutation
    const { mutate: makeAdmin } = useMutation({
        mutationFn: (userId) => axiosSecure.patch(`/users/admin/${userId}`),
        onSuccess: () => {
            toast.success('User role updated to Admin!');
            // সফল হওয়ার পর ইউজার তালিকা রিফ্রেশ করার জন্য
            queryClient.invalidateQueries({ queryKey: ['users', search] });
        },
        onError: () => toast.error('Failed to update role.'),
    });

    const handleMakeAdmin = (user) => {
        // যদি ইউজার আগে থেকেই অ্যাডমিন হয়, তাহলে কিছু হবে না
        if (user.role === 'admin') return;
        makeAdmin(user._id);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        refetch(); // সার্চ বাটনে ক্লিক করলে ডেটা রি-ফেচ হবে
    };

    if (isLoading) return <div className="text-center"><span className="loading loading-spinner"></span></div>;

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Manage All Users ({users.length})</h2>

            {/* সার্চ বার */}
            <form onSubmit={handleSearch} className="mb-6 flex gap-2">
                <input 
                    type="text" 
                    defaultValue={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by user name..." 
                    className="input input-bordered w-full max-w-xs" 
                />
                <button type="submit" className="btn btn-primary bg-green-500">Search</button>
            </form>

            {/* ইউজারদের টেবিল */}
            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                <table className="table w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th>#</th>
                            <th>User Name</th>
                            <th>User Email</th>
                            <th>Make Admin</th>
                            <th>Subscription Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user._id}>
                                <th>{index + 1}</th>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    {user.role === 'admin' ? (
                                        <span className="font-semibold text-green-600">Admin</span>
                                    ) : (
                                        <button 
                                            onClick={() => handleMakeAdmin(user)}
                                            className="btn btn-ghost btn-lg text-2xl text-orange-500 hover:text-green-600"
                                            title="Make Admin"
                                            // আপনার নিজের অ্যাকাউন্টে বাটনটি ডিজেবল করা যেতে পারে
                                            disabled={user.email === 'admin@gmail.com'}
                                        >
                                            <FaUsers />
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