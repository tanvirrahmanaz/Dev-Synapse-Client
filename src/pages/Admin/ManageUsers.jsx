// src/pages/Admin/ManageUsers.jsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';

const ManageUsers = () => {
    const [search, setSearch] = useState('');
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const { data: users = [], refetch } = useQuery({
        queryKey: ['users', search],
        queryFn: async () => (await axiosSecure.get(`/users?search=${search}`)).data
    });

    const makeAdminMutation = useMutation({
        mutationFn: (userId) => axiosSecure.patch(`/users/admin/${userId}`),
        onSuccess: () => {
            toast.success('User has been promoted to Admin!');
            refetch();
        }
    });

    const handleMakeAdmin = (user) => {
        if(user.role === 'admin') return;
        makeAdminMutation.mutate(user._id);
    };

    const handleSearch = e => {
        e.preventDefault();
        refetch();
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Manage Users</h2>
            <form onSubmit={handleSearch} className="mb-4 flex gap-2">
                <input type="text" onChange={(e) => setSearch(e.target.value)} placeholder="Search by username" className="input input-bordered w-full max-w-xs" />
                <button type="submit" className="btn btn-primary">Search</button>
            </form>
            {/* ... টেবিল আকারে ইউজারদের দেখানোর কোড ... */}
        </div>
    );
};
export default ManageUsers;