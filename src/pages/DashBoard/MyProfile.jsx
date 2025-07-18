import React, { useContext } from 'react';
import { AuthContext } from '../../providers/AuthProvider';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import PostCard from '../../components/PostCard';
import { FaCode, FaUsers, FaFire, FaComments, FaArrowUp, FaArrowDown, FaCalendarAlt, FaEdit, FaEye } from 'react-icons/fa';
import Avatar from '../../components/Avatar';
import { BiCodeAlt } from 'react-icons/bi';
import { HiTerminal } from 'react-icons/hi';

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

    // ব্যবহারকারীর সমস্ত পোস্ট থেকে স্ট্যাটিস্টিক্স
    const { data: allPosts = [] } = useQuery({
        queryKey: ['allUserPosts', user?.email],
        enabled: !loading && !!user?.email,
        queryFn: async () => (await axiosSecure.get(`/posts/by-email/${user.email}`)).data
    });

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900">
            <div className="flex flex-col items-center space-y-4">
                <div className="loading loading-spinner loading-lg text-green-500"></div>
                <p className="text-green-400 font-mono">Loading profile...</p>
            </div>
        </div>
    );

    // স্ট্যাটিস্টিক্স গণনা
    const totalPosts = allPosts.length;
    const totalUpvotes = allPosts.reduce((sum, post) => sum + (post.upVote || 0), 0);
    const totalDownvotes = allPosts.reduce((sum, post) => sum + (post.downVote || 0), 0);
    const totalComments = allPosts.reduce((sum, post) => sum + (post.commentsCount || 0), 0);
    const netScore = totalUpvotes - totalDownvotes;

    return (
        <div className="min-h-screen bg-gray-900 text-green-400 p-6">
            {/* Header with Terminal Style */}
            <div className="mb-8">
                <div className="flex items-center space-x-3 mb-4">
                    <HiTerminal className="text-3xl text-green-500" />
                    <h2 className="text-3xl font-bold font-mono text-green-400">~/my-profile</h2>
                </div>
                <div className="h-px bg-green-500 w-full opacity-30"></div>
            </div>

            {/* Profile Card */}
            <div className="bg-gray-800 border border-green-500 rounded-lg p-6 mb-8 shadow-lg shadow-green-500/10">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
                    {/* Profile Image */}
                    <div className="relative">
                        <Avatar user={user} size="w-32 h-32" />
                        <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
                            <FaCode className="text-gray-900 text-lg" />
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="flex-1 text-center lg:text-left">
                        <h3 className="text-2xl font-bold text-white mb-2 font-mono">
                            {user.displayName}
                        </h3>
                        <p className="text-green-300 mb-4 font-mono bg-gray-700 px-3 py-1 rounded inline-block">
                            {user.email}
                        </p>
                        
                        {/* Badge */}
                        <div className="mb-4">
                            {dbUser?.badge === 'Gold' ? (
                                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold rounded-lg shadow-lg">
                                    <FaFire className="mr-2" />
                                    Gold Developer
                                </div>
                            ) : (
                                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-700 to-yellow-800 text-white font-bold rounded-lg shadow-lg">
                                    <BiCodeAlt className="mr-2" />
                                    Bronze Developer
                                </div>
                            )}
                        </div>

                        {/* Status */}
                        <div className="flex items-center justify-center lg:justify-start space-x-2 text-sm">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-green-400 font-mono">Active Developer</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gray-800 border border-green-500/30 rounded-lg p-4 hover:border-green-500 transition-colors">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-300 text-sm font-mono">Total Posts</p>
                            <p className="text-2xl font-bold text-white">{totalPosts}</p>
                        </div>
                        <FaEdit className="text-green-500 text-2xl" />
                    </div>
                </div>

                <div className="bg-gray-800 border border-green-500/30 rounded-lg p-4 hover:border-green-500 transition-colors">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-300 text-sm font-mono">Total Upvotes</p>
                            <p className="text-2xl font-bold text-white">{totalUpvotes}</p>
                        </div>
                        <FaArrowUp className="text-green-500 text-2xl" />
                    </div>
                </div>

                <div className="bg-gray-800 border border-green-500/30 rounded-lg p-4 hover:border-green-500 transition-colors">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-300 text-sm font-mono">Comments</p>
                            <p className="text-2xl font-bold text-white">{totalComments}</p>
                        </div>
                        <FaComments className="text-green-500 text-2xl" />
                    </div>
                </div>

                <div className="bg-gray-800 border border-green-500/30 rounded-lg p-4 hover:border-green-500 transition-colors">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-300 text-sm font-mono">Net Score</p>
                            <p className={`text-2xl font-bold ${netScore >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {netScore >= 0 ? '+' : ''}{netScore}
                            </p>
                        </div>
                        <div className={`text-2xl ${netScore >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {netScore >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Posts Section */}
            <div className="bg-gray-800 border border-green-500/30 rounded-lg p-6 shadow-lg">
                <div className="flex items-center space-x-3 mb-6">
                    <FaEye className="text-green-500 text-xl" />
                    <h3 className="text-2xl font-bold text-white font-mono">Recent Posts</h3>
                    <div className="h-px bg-green-500 flex-1 opacity-30 ml-4"></div>
                </div>

                {recentPosts.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {recentPosts.map(post => (
                            <div key={post._id} className="transform hover:scale-105 transition-transform duration-200">
                                <PostCard post={post} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <BiCodeAlt className="mx-auto text-6xl text-green-500/30 mb-4" />
                        <p className="text-green-300 text-lg font-mono">No posts yet...</p>
                        <p className="text-green-500 text-sm font-mono mt-2">
                            Start sharing your knowledge with the community!
                        </p>
                    </div>
                )}
            </div>

            {/* Activity Timeline Preview */}
            <div className="mt-8 bg-gray-800 border border-green-500/30 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                    <FaCalendarAlt className="text-green-500 text-xl" />
                    <h3 className="text-xl font-bold text-white font-mono">Activity Summary</h3>
                </div>
                
                <div className="space-y-4">
                    <div className="flex items-center space-x-4 text-sm">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-green-300 font-mono">
                            Joined the developer community
                        </span>
                    </div>
                    
                    {totalPosts > 0 && (
                        <div className="flex items-center space-x-4 text-sm">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-green-300 font-mono">
                                Published {totalPosts} posts
                            </span>
                        </div>
                    )}
                    
                    {totalUpvotes > 0 && (
                        <div className="flex items-center space-x-4 text-sm">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <span className="text-green-300 font-mono">
                                Received {totalUpvotes} upvotes from community
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyProfile;