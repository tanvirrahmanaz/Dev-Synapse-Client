import React, { useContext } from 'react';
import { AuthContext } from '../../providers/AuthProvider';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaTrash, FaCommentDots } from 'react-icons/fa'; // FaCommentDots আইকন ইম্পোর্ট করুন
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom'; // Link ইম্পোর্ট করুন

const MyPosts = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    // ... useQuery এবং useMutation আগের মতোই থাকবে ...
    const { data: myPosts = [], refetch } = useQuery({
        queryKey: ['myPosts', user?.email],
        enabled: !!user?.email,
        queryFn: async () => (await axiosSecure.get(`/posts/by-email/${user.email}`)).data,
    });
    
    const deleteMutation = useMutation({
        mutationFn: (id) => axiosSecure.delete(`/posts/${id}`),
        onSuccess: () => {
            toast.success('Post deleted successfully!');
            refetch();
        }
    });

    const handleDelete = (id) => {
        if(window.confirm('Are you sure you want to delete this post?')){
            deleteMutation.mutate(id);
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">My Posts ({myPosts.length})</h2>
            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Post Title</th>
                            <th>Votes</th>
                            <th>Comments</th> {/* <-- নতুন কলাম */}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {myPosts.map((post, index) => (
                            <tr key={post._id}>
                                <th>{index + 1}</th>
                                <td>{post.postTitle}</td>
                                <td>{(post.upVotedBy?.length || 0) - (post.downVotedBy?.length || 0)}</td>
                                <td>
                                    {/* এখানে কমেন্ট বাটনটি যোগ করা হয়েছে */}
                                    <Link 
                                        to={`/dashboard/comments/${post._id}`} 
                                        className="btn btn-ghost btn-sm text-green-600"
                                    >
                                        <FaCommentDots className="text-lg" /> 
                                        ({post.commentsCount || 0})
                                    </Link>
                                </td>
                                <td>
                                    <button onClick={() => handleDelete(post._id)} className="btn btn-ghost btn-sm text-red-500">
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyPosts;