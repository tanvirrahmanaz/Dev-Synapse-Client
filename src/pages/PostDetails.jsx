import React, { useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosPublic from '../hooks/useAxiosPublic';
import useAxiosSecure from '../hooks/useAxiosSecure';
import { AuthContext } from '../providers/AuthProvider';
import toast from 'react-hot-toast';
import { FaArrowUp, FaArrowDown, FaExclamationTriangle } from 'react-icons/fa';
import { FacebookShareButton, FacebookIcon, WhatsappShareButton, WhatsappIcon } from 'react-share';

const PostDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    // প্রতিটি কমেন্টের রিপোর্টিং অবস্থা ট্র্যাক করার জন্য স্টেট
    const [reportStates, setReportStates] = useState({});

    // পোস্টের ডেটা আনার জন্য useQuery
    const { data: post, isLoading: isPostLoading } = useQuery({
        queryKey: ['post', id],
        queryFn: async () => (await axiosPublic.get(`/posts/${id}`)).data,
    });

    // কমেন্ট আনার জন্য useQuery
    const { data: comments = [], isLoading: isCommentsLoading } = useQuery({
        queryKey: ['comments', id],
        queryFn: async () => (await axiosPublic.get(`/comments/${id}`)).data,
    });

    // ভোট আপডেট করার জন্য useMutation
    const voteMutation = useMutation({
        mutationFn: ({ voteType }) => axiosSecure.patch(`/posts/vote/${id}`, { voteType }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['post', id] });
            toast.success('Vote updated!');
        },
    });

    // কমেন্ট যোগ করার জন্য useMutation
    const commentMutation = useMutation({
        mutationFn: (newComment) => axiosSecure.post('/comments', newComment),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', id] });
            queryClient.invalidateQueries({ queryKey: ['post', id] });
            toast.success('Comment added successfully!');
        },
        onError: () => toast.error('Failed to add comment.')
    });

    // কমেন্ট রিপোর্ট করার জন্য useMutation
    const reportMutation = useMutation({
        mutationFn: (reportData) => axiosSecure.post('/reports', reportData),
        onSuccess: (data, variables) => {
            toast.success('Comment reported. Admin will review it.');
            setReportStates(prev => ({
                ...prev,
                [variables.commentId]: { ...prev[variables.commentId], isReported: true }
            }));
        },
    });

    const handleVote = (voteType) => {
        if (!user) return toast.error('You must be logged in to vote.');
        voteMutation.mutate({ voteType });
    };
    
    const handleCommentSubmit = (e) => {
        e.preventDefault();
        const commentText = e.target.comment.value;
        if (!commentText) return toast.error("Comment cannot be empty.");
        const newComment = { commentText, postId: id, commenterEmail: user.email, commenterName: user.displayName, commenterImage: user.photoURL };
        commentMutation.mutate(newComment);
        e.target.reset();
    };

    const handleFeedbackChange = (commentId, feedback) => {
        setReportStates(prev => ({
            ...prev,
            [commentId]: { ...prev[commentId], feedback }
        }));
    };

    const handleReport = (comment) => {
        const feedback = reportStates[comment._id]?.feedback;
        if (!feedback) return toast.error('Please select a feedback option first.');
        reportMutation.mutate({ commentId: comment._id, postId: id, commentText: comment.commentText, commenterEmail: comment.commenterEmail, feedback });
    };
    
    const shareUrl = window.location.href;

    // ব্যবহারকারী ভোট দিয়েছে কিনা তা চেক করার জন্য
    const hasUpvoted = post?.upVotedBy?.includes(user?.email);
    const hasDownvoted = post?.downVotedBy?.includes(user?.email);

    if (isPostLoading || isCommentsLoading) return <div className="text-center my-10"><span className="loading loading-spinner loading-lg"></span></div>;
    if (!post) return <div className="text-center my-10">Post not found.</div>;

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <div className="bg-base-100 shadow-lg rounded-lg p-6">
                {/* Author Info & Post Content */}
                <div className="flex items-center gap-4 mb-4">
                    <img src={post.authorImage} alt={post.authorName} className="w-14 h-14 rounded-full" />
                    <div>
                        <p className="font-bold text-lg">{post.authorName}</p>
                        <p className="text-sm text-gray-500">{new Date(post.postTime).toLocaleString()}</p>
                    </div>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.postTitle}</h1>
                <p className="text-gray-700 leading-relaxed mb-6">{post.postDescription}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                    {post.tags.map(tag => <span key={tag} className="badge badge-outline">#{tag}</span>)}
                </div>

                {/* Actions: Vote, Share */}
                <div className="flex items-center justify-between border-t pt-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => handleVote('upVote')} className={`btn btn-sm gap-2 ${hasUpvoted ? 'btn-success text-white' : 'btn-outline btn-success'}`}>
                            <FaArrowUp /> Upvote ({post.upVotedBy?.length || 0})
                        </button>
                        <button onClick={() => handleVote('downVote')} className={`btn btn-sm gap-2 ${hasDownvoted ? 'btn-error text-white' : 'btn-outline btn-error'}`}>
                            <FaArrowDown /> Downvote ({post.downVotedBy?.length || 0})
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <FacebookShareButton url={shareUrl} quote={post.postTitle}><FacebookIcon size={32} round /></FacebookShareButton>
                        <WhatsappShareButton url={shareUrl} title={post.postTitle}><WhatsappIcon size={32} round /></WhatsappShareButton>
                    </div>
                </div>
            </div>

            {/* Comment Section */}
            <div className="bg-base-100 shadow-lg rounded-lg p-6 mt-8">
                <h2 className="text-2xl font-bold mb-4">Comments ({post.commentsCount || 0})</h2>
                {user ? (
                    <form onSubmit={handleCommentSubmit} className="flex flex-col gap-2 mb-6">
                        <textarea name="comment" className="textarea textarea-bordered" placeholder="Write your comment..."></textarea>
                        <button type="submit" className="btn btn-primary self-end">Post Comment</button>
                    </form>
                ) : (
                    <p className="mb-6">Please <Link to="/login" className="link link-primary">log in</Link> to post a comment.</p>
                )}
                
                {/* Displaying Comments with Report Option */}
                <div className="space-y-6">
                    {comments.map((comment) => (
                        <div key={comment._id} className="p-4 rounded-lg border border-gray-200">
                            <div className="flex items-start gap-3">
                                <img src={comment.commenterImage} alt={comment.commenterName} className="w-10 h-10 rounded-full" />
                                <div className="flex-1">
                                    <p className="font-semibold">{comment.commenterName}</p>
                                    <p className="text-gray-700 break-words">{comment.commentText}</p>
                                </div>
                            </div>
                            {user && (
                                <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                                    <select className="select select-bordered select-xs" onChange={(e) => handleFeedbackChange(comment._id, e.target.value)} disabled={reportStates[comment._id]?.isReported}>
                                        <option value="">Select feedback</option>
                                        <option value="Spam">Spam</option>
                                        <option value="Inappropriate">Inappropriate</option>
                                        <option value="Hate Speech">Hate Speech</option>
                                    </select>
                                    <button onClick={() => handleReport(comment)} className="btn btn-xs btn-outline btn-error" disabled={!reportStates[comment._id]?.feedback || reportStates[comment._id]?.isReported}>
                                        <FaExclamationTriangle /> {reportStates[comment._id]?.isReported ? 'Reported' : 'Report'}
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PostDetails;