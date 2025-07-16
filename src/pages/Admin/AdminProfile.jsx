import React, { useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '../../providers/AuthProvider';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const AdminProfile = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const { register, handleSubmit, reset } = useForm();

    // সাইটের পরিসংখ্যান আনার জন্য useQuery
    const { data: stats, isLoading: isStatsLoading } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => (await axiosSecure.get('/admin-stats')).data
    });

    // ট্যাগ যোগ করার জন্য useMutation
    const { mutate: addTag } = useMutation({
        mutationFn: (newTag) => axiosSecure.post('/tags', newTag),
        onSuccess: () => {
            toast.success('Tag added successfully!');
            reset();
            // ট্যাগ তালিকা রিফ্রেশ করার জন্য (যদি অন্য কোথাও দেখানো হয়)
            queryClient.invalidateQueries({ queryKey: ['tags'] });
        },
        onError: (err) => toast.error(err.response.data.message || 'Failed to add tag')
    });

    const onTagSubmit = (data) => {
        addTag({ name: data.tagName });
    };

    // পাই চার্টের জন্য ডেটা এবং রঙ
    const chartData = [
        { name: 'Total Posts', value: stats?.postsCount || 0 },
        { name: 'Total Users', value: stats?.usersCount || 0 },
        { name: 'Total Comments', value: stats?.commentsCount || 0 },
    ];
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

    if (isStatsLoading) return <div className="text-center"><span className="loading loading-spinner"></span></div>;

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Admin Profile & Site Statistics</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* প্রোফাইল এবং ট্যাগ ফর্ম */}
                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-6">
                        <img src={user?.photoURL} alt="admin profile" className="w-24 h-24 rounded-full border-4 border-green-500"/>
                        <div>
                            <h3 className="text-2xl font-bold">{user?.displayName}</h3>
                            <p className="text-gray-600">{user?.email}</p>
                            <span className="badge badge-lg bg-green-600 text-white mt-2">Admin</span>
                        </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-bold mb-4">Add a New Tag</h3>
                        <form onSubmit={handleSubmit(onTagSubmit)} className="flex gap-2">
                            <input 
                                {...register('tagName', { required: true })}
                                type="text"
                                placeholder="Enter new tag name"
                                className="input input-bordered w-full"
                            />
                            <button type="submit" className="btn btn-primary bg-green-500">Add Tag</button>
                        </form>
                    </div>
                </div>

                {/* পরিসংখ্যান এবং পাই চার্ট */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold mb-4">Site Analytics</h3>
                    <div className="flex justify-around text-center mb-4">
                        <div>
                            <p className="text-3xl font-bold text-blue-500">{stats.postsCount}</p>
                            <p className="text-gray-500">Posts</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-green-500">{stats.usersCount}</p>
                            <p className="text-gray-500">Users</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-yellow-500">{stats.commentsCount}</p>
                            <p className="text-gray-500">Comments</p>
                        </div>
                    </div>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
                                    {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;