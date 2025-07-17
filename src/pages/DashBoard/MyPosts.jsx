import React, { useContext } from 'react';
import { AuthContext } from '../../providers/AuthProvider';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaTrash, FaCommentDots, FaThumbsUp, FaThumbsDown, FaCalendarAlt, FaUser, FaEye, FaEdit } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

const MyPosts = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    
    const { data: myPosts = [], refetch, isLoading } = useQuery({
        queryKey: ['myPosts', user?.email],
        enabled: !!user?.email,
        queryFn: async () => (await axiosSecure.get(`/posts/by-email/${user.email}`)).data,
    });
    
    const deleteMutation = useMutation({
        mutationFn: (id) => axiosSecure.delete(`/posts/${id}`),
        onSuccess: () => {
            toast.success('Post deleted successfully!');
            refetch();
        },
        onError: () => {
            toast.error('Failed to delete post!');
        }
    });

    const handleDelete = async (post) => {
        const result = await Swal.fire({
            title: 'Delete Post?',
            html: `
                <div style="text-align: left; margin: 20px 0;">
                    <p style="margin-bottom: 15px; color: #64748b;"><strong>Title:</strong> ${post.postTitle}</p>
                    <p style="margin-bottom: 15px; color: #64748b;"><strong>Created:</strong> ${new Date(post.postTime).toLocaleDateString()}</p>
                    <p style="color: #ef4444; font-weight: 600;">This action cannot be undone!</p>
                </div>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '🗑️ Delete',
            cancelButtonText: '❌ Cancel',
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            background: '#1f2937',
            color: '#f3f4f6',
            customClass: {
                popup: 'swal-dark-popup',
                title: 'swal-dark-title',
                confirmButton: 'swal-delete-btn',
                cancelButton: 'swal-cancel-btn'
            }
        });

        if (result.isConfirmed) {
            deleteMutation.mutate(post._id);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getVoteScore = (post) => {
        const upVotes = post.upVotedBy?.length || 0;
        const downVotes = post.downVotedBy?.length || 0;
        return upVotes - downVotes;
    };

    const getVoteColor = (score) => {
        if (score > 0) return 'text-green-400';
        if (score < 0) return 'text-red-400';
        return 'text-gray-400';
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="loading loading-spinner loading-lg text-green-400"></div>
            </div>
        );
    }

    return (
        <>
            {/* Custom CSS for SweetAlert2 */}
            <style jsx global>{`
                .swal-dark-popup {
                    background: #1f2937 !important;
                    border: 1px solid #374151 !important;
                }
                .swal-dark-title {
                    color: #f3f4f6 !important;
                }
                .swal-delete-btn {
                    background: #ef4444 !important;
                    border: none !important;
                    border-radius: 8px !important;
                    font-weight: 600 !important;
                    padding: 12px 24px !important;
                    transition: all 0.3s ease !important;
                }
                .swal-delete-btn:hover {
                    background: #dc2626 !important;
                    transform: translateY(-2px) !important;
                }
                .swal-cancel-btn {
                    background: #6b7280 !important;
                    border: none !important;
                    border-radius: 8px !important;
                    font-weight: 600 !important;
                    padding: 12px 24px !important;
                    transition: all 0.3s ease !important;
                }
                .swal-cancel-btn:hover {
                    background: #4b5563 !important;
                    transform: translateY(-2px) !important;
                }
            `}</style>

            <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <FaUser className="text-green-400 text-2xl" />
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                                My Posts
                            </h1>
                            <span className="bg-gray-800 text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
                                {myPosts.length}
                            </span>
                        </div>
                        <Link 
                            to="/dashboard/add-post" 
                            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center gap-2"
                        >
                            <FaEdit />
                            New Post
                        </Link>
                    </div>
                    <p className="text-gray-400 mt-2">Manage and track your published posts</p>
                </div>

                {myPosts.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="mb-6">
                            <FaEdit className="text-6xl text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-400 mb-2">No Posts Yet</h3>
                            <p className="text-gray-500">Start sharing your knowledge with the community!</p>
                        </div>
                        <Link 
                            to="/dashboard/add-post" 
                            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 inline-flex items-center gap-2"
                        >
                            <FaEdit />
                            Create Your First Post
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Desktop View */}
                        <div className="hidden lg:block">
                            <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 shadow-xl">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-700">
                                            <tr>
                                                <th className="text-left p-4 text-gray-300 font-semibold">#</th>
                                                <th className="text-left p-4 text-gray-300 font-semibold">Post Title</th>
                                                <th className="text-left p-4 text-gray-300 font-semibold">Date</th>
                                                <th className="text-left p-4 text-gray-300 font-semibold">Votes</th>
                                                <th className="text-left p-4 text-gray-300 font-semibold">Comments</th>
                                                <th className="text-left p-4 text-gray-300 font-semibold">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {myPosts.map((post, index) => {
                                                const voteScore = getVoteScore(post);
                                                return (
                                                    <tr key={post._id} className="border-b border-gray-700 hover:bg-gray-750 transition-colors">
                                                        <td className="p-4 text-gray-400 font-medium">
                                                            {index + 1}
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="max-w-md">
                                                                <h3 className="text-gray-100 font-semibold mb-1 truncate">
                                                                    {post.postTitle}
                                                                </h3>
                                                                <div className="flex flex-wrap gap-1">
                                                                    {post.tags?.slice(0, 3).map((tag, i) => (
                                                                        <span key={i} className="bg-green-400/20 text-green-400 px-2 py-1 rounded text-xs">
                                                                            {tag}
                                                                        </span>
                                                                    ))}
                                                                    {post.tags?.length > 3 && (
                                                                        <span className="text-gray-400 text-xs">+{post.tags.length - 3} more</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 text-gray-400">
                                                            <div className="flex items-center gap-2">
                                                                <FaCalendarAlt className="text-xs" />
                                                                {formatDate(post.postTime)}
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="flex items-center gap-3">
                                                                <span className={`font-semibold ${getVoteColor(voteScore)}`}>
                                                                    {voteScore > 0 ? '+' : ''}{voteScore}
                                                                </span>
                                                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                                                    <FaThumbsUp className="text-green-400" />
                                                                    {post.upVotedBy?.length || 0}
                                                                    <FaThumbsDown className="text-red-400 ml-2" />
                                                                    {post.downVotedBy?.length || 0}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            <Link 
                                                                to={`/dashboard/comments/${post._id}`} 
                                                                className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 px-3 py-2 rounded-lg transition-all duration-200 inline-flex items-center gap-2 text-sm font-medium"
                                                            >
                                                                <FaCommentDots />
                                                                {post.commentsCount || 0}
                                                            </Link>
                                                        </td>
                                                        <td className="p-4">
                                                            <button 
                                                                onClick={() => handleDelete(post)}
                                                                disabled={deleteMutation.isLoading}
                                                                className="bg-red-500/20 text-red-400 hover:bg-red-500/30 px-3 py-2 rounded-lg transition-all duration-200 inline-flex items-center gap-2 text-sm font-medium disabled:opacity-50"
                                                            >
                                                                <FaTrash />
                                                                {deleteMutation.isLoading ? 'Deleting...' : 'Delete'}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Mobile View */}
                        <div className="lg:hidden space-y-4">
                            {myPosts.map((post, index) => {
                                const voteScore = getVoteScore(post);
                                return (
                                    <div key={post._id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-100 mb-2">
                                                    {post.postTitle}
                                                </h3>
                                                <div className="flex flex-wrap gap-1 mb-2">
                                                    {post.tags?.slice(0, 3).map((tag, i) => (
                                                        <span key={i} className="bg-green-400/20 text-green-400 px-2 py-1 rounded text-xs">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                                    <FaCalendarAlt className="text-xs" />
                                                    {formatDate(post.postTime)}
                                                </div>
                                            </div>
                                            <span className="bg-gray-700 text-gray-400 px-2 py-1 rounded text-sm font-medium">
                                                #{index + 1}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 mb-4">
                                            <div className="text-center">
                                                <div className={`text-lg font-semibold ${getVoteColor(voteScore)}`}>
                                                    {voteScore > 0 ? '+' : ''}{voteScore}
                                                </div>
                                                <div className="text-xs text-gray-400">Score</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-lg font-semibold text-blue-400">
                                                    {post.commentsCount || 0}
                                                </div>
                                                <div className="text-xs text-gray-400">Comments</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-lg font-semibold text-green-400">
                                                    {post.upVotedBy?.length || 0}
                                                </div>
                                                <div className="text-xs text-gray-400">Upvotes</div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Link 
                                                to={`/dashboard/comments/${post._id}`} 
                                                className="flex-1 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 px-3 py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium"
                                            >
                                                <FaCommentDots />
                                                View Comments
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(post)}
                                                disabled={deleteMutation.isLoading}
                                                className="bg-red-500/20 text-red-400 hover:bg-red-500/30 px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-medium disabled:opacity-50"
                                            >
                                                <FaTrash />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}

                {/* Stats Summary */}
                {myPosts.length > 0 && (
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                            <div className="text-2xl font-bold text-green-400">
                                {myPosts.length}
                            </div>
                            <div className="text-sm text-gray-400">Total Posts</div>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                            <div className="text-2xl font-bold text-blue-400">
                                {myPosts.reduce((acc, post) => acc + (post.commentsCount || 0), 0)}
                            </div>
                            <div className="text-sm text-gray-400">Total Comments</div>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                            <div className="text-2xl font-bold text-green-400">
                                {myPosts.reduce((acc, post) => acc + (post.upVotedBy?.length || 0), 0)}
                            </div>
                            <div className="text-sm text-gray-400">Total Upvotes</div>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                            <div className="text-2xl font-bold text-yellow-400">
                                {myPosts.reduce((acc, post) => acc + getVoteScore(post), 0)}
                            </div>
                            <div className="text-sm text-gray-400">Total Score</div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default MyPosts;