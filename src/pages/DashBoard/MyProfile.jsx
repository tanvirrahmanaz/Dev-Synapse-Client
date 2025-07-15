import React, { useContext } from 'react';
import { AuthContext } from '../../providers/AuthProvider';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import PostCard from '../../components/PostCard'; // আপনার পোস্ট কার্ড কম্পোনেন্ট

const MyProfile = () => {
    const { user, loading } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();

    // ব্যবহারকারীর ব্যাজ তথ্য আনার জন্য
    const { data: dbUser } = useQuery({
        queryKey: ['dbUser', user?.email],
        enabled: !loading && !!user?.email,
        queryFn: async () => (await axiosSecure.get(`/users/${user.email}`)).data
    });

    // সাম্প্রতিক ৩টি পোস্ট আনার জন্য
    const { data: recentPosts = [] } = useQuery({
        queryKey: ['recentPosts', user?.email],
        enabled: !loading && !!user?.email,
        queryFn: async () => (await axiosSecure.get(`/posts/by-email/${user.email}?limit=3`)).data
    });

    if (loading) return <span className="loading loading-spinner"></span>;

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">My Profile</h2>
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-6">
                <img src={user.photoURL} alt="profile" className="w-32 h-32 rounded-full border-4 border-green-500" />
                <div>
                    <h3 className="text-2xl font-bold">{user.displayName}</h3>
                    <p className="text-gray-600">{user.email}</p>
                    <div className="mt-4">
                        {dbUser?.badge === 'Gold' ? (
                            <div className="badge badge-lg bg-yellow-400 text-black p-4">Gold Badge</div>
                        ) : (
                            <div className="badge badge-lg bg-yellow-700 text-white p-4">Bronze Badge</div>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-2xl font-bold mb-4">My Recent Posts</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {recentPosts.length > 0 ? recentPosts.map(post => <PostCard key={post._id} post={post} />) : <p>You have no posts yet.</p>}
                </div>
            </div>
        </div>
    );
};

export default MyProfile;