import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosPublic from '../hooks/useAxiosPublic';
import useAxiosSecure from '../hooks/useAxiosSecure';
import { AuthContext } from '../providers/AuthProvider';
import toast from 'react-hot-toast';
import { FaArrowUp, FaArrowDown, FaComment } from 'react-icons/fa';
import { FacebookShareButton, FacebookIcon, WhatsappShareButton, WhatsappIcon } from 'react-share';

const PostDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    // পোস্টের ডেটা আনার জন্য useQuery
    const { data: post, isLoading } = useQuery({
        queryKey: ['post', id],
        queryFn: async () => {
            const res = await axiosPublic.get(`/posts/${id}`);
            return res.data;
        }
    });

    // ভোট আপডেট করার জন্য useMutation
    const voteMutation = useMutation({
        mutationFn: ({ voteType }) => axiosSecure.patch(`/posts/vote/${id}`, { voteType }),
        onSuccess: () => {
            queryClient.invalidateQueries(['post', id]); // ডেটা রিফ্রেশ করার জন্য
            toast.success('Your vote has been counted!');
        },
        onError: () => toast.error('Failed to vote.')
    });

    const handleVote = (voteType) => {
        if (!user) return toast.error('You must be logged in to vote.');
        voteMutation.mutate({ voteType });
    };
    
    // শেয়ার করার জন্য URL
    const shareUrl = window.location.href;

    if (isLoading) return <div className="text-center my-10"><span className="loading loading-lg"></span></div>;
    if (!post) return <div className="text-center my-10">Post not found.</div>;

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <div className="bg-white shadow-lg rounded-lg p-6">
                {/* Author Info */}
                <div className="flex items-center gap-4 mb-4">
                    <img src={post.authorImage} alt={post.authorName} className="w-14 h-14 rounded-full" />
                    <div>
                        <p className="font-bold text-lg">{post.authorName}</p>
                        <p className="text-sm text-gray-500">{new Date(post.postTime).toLocaleString()}</p>
                    </div>
                </div>

                {/* Post Content */}
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.postTitle}</h1>
                <p className="text-gray-700 leading-relaxed mb-6">{post.postDescription}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                    {post.tags.map(tag => <span key={tag} className="badge badge-outline">#{tag}</span>)}
                </div>

                {/* Actions: Vote, Share */}
                <div className="flex items-center justify-between border-t pt-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => handleVote('upVote')} className="btn btn-outline btn-success btn-sm gap-2"><FaArrowUp /> Upvote ({post.upVote})</button>
                        <button onClick={() => handleVote('downVote')} className="btn btn-outline btn-error btn-sm gap-2"><FaArrowDown /> Downvote ({post.downVote})</button>
                    </div>
                    <div className="flex items-center gap-2">
                        <FacebookShareButton url={shareUrl} quote={post.postTitle}>
                            <FacebookIcon size={32} round />
                        </FacebookShareButton>
                        <WhatsappShareButton url={shareUrl} title={post.postTitle}>
                            <WhatsappIcon size={32} round />
                        </WhatsappShareButton>
                    </div>
                </div>
            </div>

            {/* Comment Section */}
            <div className="bg-white shadow-lg rounded-lg p-6 mt-8">
                <h2 className="text-2xl font-bold mb-4">Comments</h2>
                {user ? (
                    <form /* onSubmit={handleCommentSubmit} */ className="flex flex-col gap-2">
                        <textarea className="textarea textarea-bordered" placeholder="Write your comment..."></textarea>
                        <button type="submit" className="btn btn-primary self-end">Post Comment</button>
                    </form>
                ) : (
                    <p>Please <Link to="/login" className="link link-primary">log in</Link> to post a comment.</p>
                )}
                {/* এখানে কমেন্টগুলো দেখানো হবে */}
            </div>
        </div>
    );
};

export default PostDetails;