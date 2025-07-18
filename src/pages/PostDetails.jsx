import React, { useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosPublic from '../hooks/useAxiosPublic';
import useAxiosSecure from '../hooks/useAxiosSecure';
import { AuthContext } from '../providers/AuthProvider';
import toast from 'react-hot-toast';
import { 
    FaArrowUp, 
    FaArrowDown, 
    FaExclamationTriangle, 
    FaFlag, 
    FaShare, 
    FaCode, 
    FaTerminal, 
    FaComments,
    FaHeart,
    FaEye,
    FaCalendarAlt,
    FaUser,
    FaPaperPlane,
    FaGithub,
    FaLaptopCode
} from 'react-icons/fa';
import { FacebookShareButton, FacebookIcon, WhatsappShareButton, WhatsappIcon, TwitterShareButton, TwitterIcon } from 'react-share';
import Avatar from '../components/Avatar';

const PostDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    
    // States
    const [commentReportStates, setCommentReportStates] = useState({});
    const [isPostReportModalOpen, setIsPostReportModalOpen] = useState(false);
    const [postReportFeedback, setPostReportFeedback] = useState('');
    const [isPostReported, setIsPostReported] = useState(false);
    const [showShareOptions, setShowShareOptions] = useState(false);
    const [commentText, setCommentText] = useState('');
    
    // Fetching post data
    const { data: post, isLoading: isPostLoading } = useQuery({
        queryKey: ['post', id],
        queryFn: async () => (await axiosPublic.get(`/posts/${id}`)).data,
    });
    
    // Fetching comments
    const { data: comments = [], isLoading: isCommentsLoading } = useQuery({
        queryKey: ['comments', id],
        queryFn: async () => (await axiosPublic.get(`/comments/${id}`)).data,
    });
    
    // Mutations
    const voteMutation = useMutation({
        mutationFn: ({ voteType }) => axiosSecure.patch(`/posts/vote/${id}`, { voteType }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['post', id] });
            toast.success('Vote updated!', {
                style: { background: '#1f2937', color: '#10b981' }
            });
        },
    });
    
    const commentMutation = useMutation({
        mutationFn: (newComment) => axiosSecure.post('/comments', newComment),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', id] });
            queryClient.invalidateQueries({ queryKey: ['post', id] });
            setCommentText('');
            toast.success('Comment added!', {
                style: { background: '#1f2937', color: '#10b981' }
            });
        },
        onError: () => toast.error('Failed to add comment.')
    });
    
    const commentReportMutation = useMutation({
        mutationFn: (reportData) => axiosSecure.post('/reports', reportData),
        onSuccess: (data, variables) => {
            toast.success('Comment reported!');
            setCommentReportStates(prev => ({ ...prev, [variables.commentId]: { ...prev[variables.commentId], isReported: true } }));
        },
    });
    
    const postReportMutation = useMutation({
        mutationFn: (reportData) => axiosSecure.post('/reports/post', reportData),
        onSuccess: () => {
            toast.success('Post reported!');
            setIsPostReported(true);
            setIsPostReportModalOpen(false);
        },
    });
    
    // Event Handlers
    const handleVote = (voteType) => {
        if (!user) {
            toast.error('Please log in to vote', {
                style: { background: '#1f2937', color: '#ef4444' }
            });
            return;
        }
        voteMutation.mutate({ voteType });
    };
    
    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please log in to comment');
            return;
        }
        if (!commentText.trim()) {
            toast.error('Comment cannot be empty');
            return;
        }
        
        const newComment = { 
            commentText: commentText.trim(), 
            postId: id, 
            commenterEmail: user.email, 
            commenterName: user.displayName, 
            commenterImage: user.photoURL 
        };
        commentMutation.mutate(newComment);
    };
    
    const handleFeedbackChange = (commentId, feedback) => {
        setCommentReportStates(prev => ({ ...prev, [commentId]: { ...prev[commentId], feedback } }));
    };
    
    const handleCommentReport = (comment) => {
        const feedback = commentReportStates[comment._id]?.feedback;
        if (!feedback) return toast.error('Please select a feedback option first.');
        commentReportMutation.mutate({ 
            type: 'comment', 
            commentId: comment._id, 
            postId: id, 
            commentText: comment.commentText, 
            commenterEmail: comment.commenterEmail, 
            feedback 
        });
    };
    
    const handlePostReport = () => {
        if (!postReportFeedback) return toast.error('Please select a reason for reporting.');
        postReportMutation.mutate({ postId: id, feedback: postReportFeedback });
    };
    
    const shareUrl = window.location.href;
    const hasUpvoted = post?.upVotedBy?.includes(user?.email);
    const hasDownvoted = post?.downVotedBy?.includes(user?.email);
    
    // Loading State
    if (isPostLoading || isCommentsLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin mx-auto"></div>
                        <FaLaptopCode className="text-2xl text-green-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <p className="text-green-400 mt-6 text-lg font-mono">Loading post...</p>
                </div>
            </div>
        );
    }
    
    // Not Found State
    if (!post) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
                <div className="text-center">
                    <div className="text-8xl text-gray-700 mb-6">404</div>
                    <FaCode className="text-6xl text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-xl">Post not found in database.</p>
                    <Link to="/" className="btn btn-outline btn-primary mt-4">
                        <FaTerminal /> Back to Forum
                    </Link>
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
            {/* Hero Section with Gradient */}
            <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border-b border-gray-700">
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <div className="flex items-center gap-2 text-green-400 mb-4">
                        <FaTerminal />
                        <span className="font-mono text-sm">~/forum/post/{id}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                        {post.postTitle}
                    </h1>
                    <div className="flex flex-wrap gap-2">
                        {post.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm border border-green-500/30 font-mono">
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    
                    {/* Left Sidebar - Author & Actions */}
                    <div className="lg:col-span-1 space-y-6">
                        
                        {/* Author Card */}
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 sticky top-8">
                            <div className="text-center">
                                <div className="relative inline-block mb-4">
                                    <Avatar user={{ photoURL: post.authorImage, displayName: post.authorName }} size="w-20 h-20" />
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-800 flex items-center justify-center">
                                        <FaUser className="text-xs text-white" />
                                    </div>
                                </div>
                                <h3 className="font-bold text-xl text-green-400 mb-1">{post.authorName}</h3>
                                <p className="text-gray-400 text-sm flex items-center justify-center gap-1">
                                    <FaCalendarAlt className="text-xs" />
                                    {new Date(post.postTime).toLocaleDateString()}
                                </p>
                            </div>
                            
                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-gray-700">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-400">
                                        {(post.upVotedBy?.length || 0) - (post.downVotedBy?.length || 0)}
                                    </div>
                                    <div className="text-xs text-gray-500">Score</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-400">{post.commentsCount || 0}</div>
                                    <div className="text-xs text-gray-500">Comments</div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Voting Panel */}
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
                            <div className="flex flex-col items-center space-y-3">
                                <button 
                                    onClick={() => handleVote('upVote')} 
                                    className={`btn btn-circle btn-lg transition-all ${
                                        hasUpvoted 
                                            ? 'bg-green-600 text-white border-green-500 hover:bg-green-700' 
                                            : 'bg-gray-700 text-green-400 border-gray-600 hover:bg-gray-600 hover:border-green-500'
                                    }`}
                                >
                                    <FaArrowUp className="text-xl" />
                                </button>
                                
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white">
                                        {(post.upVotedBy?.length || 0) - (post.downVotedBy?.length || 0)}
                                    </div>
                                    <div className="text-xs text-gray-500">votes</div>
                                </div>
                                
                                <button 
                                    onClick={() => handleVote('downVote')} 
                                    className={`btn btn-circle btn-lg transition-all ${
                                        hasDownvoted 
                                            ? 'bg-red-600 text-white border-red-500 hover:bg-red-700' 
                                            : 'bg-gray-700 text-red-400 border-gray-600 hover:bg-gray-600 hover:border-red-500'
                                    }`}
                                >
                                    <FaArrowDown className="text-xl" />
                                </button>
                            </div>
                        </div>
                        
                        {/* Share Panel */}
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
                            <button 
                                onClick={() => setShowShareOptions(!showShareOptions)}
                                className="btn btn-outline btn-primary w-full mb-3"
                            >
                                <FaShare /> Share Post
                            </button>
                            
                            {showShareOptions && (
                                <div className="flex justify-center gap-2">
                                    <FacebookShareButton url={shareUrl} quote={post.postTitle}>
                                        <FacebookIcon size={40} round className="hover:opacity-80 transition-opacity" />
                                    </FacebookShareButton>
                                    <WhatsappShareButton url={shareUrl} title={post.postTitle}>
                                        <WhatsappIcon size={40} round className="hover:opacity-80 transition-opacity" />
                                    </WhatsappShareButton>
                                    <TwitterShareButton url={shareUrl} title={post.postTitle}>
                                        <TwitterIcon size={40} round className="hover:opacity-80 transition-opacity" />
                                    </TwitterShareButton>
                                </div>
                            )}
                        </div>
                        
                        {/* Report Button */}
                        {user && (
                            <button 
                                onClick={() => setIsPostReportModalOpen(true)} 
                                className="btn btn-outline btn-error w-full" 
                                disabled={isPostReported}
                            >
                                <FaFlag /> {isPostReported ? 'Reported' : 'Report Post'}
                            </button>
                        )}
                    </div>
                    
                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-8">
                        
                        {/* Post Content */}
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
                            <div className="prose prose-invert prose-lg max-w-none">
                                <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                                    {post.postDescription}
                                </div>
                            </div>
                        </div>
                        
                        {/* Comments Section */}
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <FaComments className="text-2xl text-green-500" />
                                <h2 className="text-2xl font-bold text-white">
                                    Discussion ({comments.length})
                                </h2>
                            </div>
                            
                            {/* Comment Form */}
                            {user ? (
                                <div className="mb-8 p-4 bg-gray-700/30 rounded-lg border border-gray-600">
                                    <div className="flex items-start gap-4">
                                        <Avatar user={user} size="w-10 h-10" />
                                        <div className="flex-1">
                                            <form onSubmit={handleCommentSubmit} className="space-y-4">
                                                <textarea 
                                                    value={commentText}
                                                    onChange={(e) => setCommentText(e.target.value)}
                                                    className="textarea w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-500 focus:ring-green-500/20 min-h-[100px] font-mono" 
                                                    placeholder="Share your thoughts... (Markdown supported)"
                                                />
                                                <div className="flex justify-end">
                                                    <button 
                                                        type="submit" 
                                                        className="btn bg-green-600 hover:bg-green-700 text-white border-green-500 hover:border-green-600 transition-all"
                                                        disabled={!commentText.trim() || commentMutation.isLoading}
                                                    >
                                                        <FaPaperPlane /> 
                                                        {commentMutation.isLoading ? 'Posting...' : 'Post Comment'}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="mb-8 p-6 bg-gray-700/30 border border-gray-600 rounded-lg text-center">
                                    <FaGithub className="text-4xl text-gray-500 mx-auto mb-4" />
                                    <p className="text-gray-300 mb-4">
                                        Join the discussion! Please log in to post comments.
                                    </p>
                                    <Link to="/login" className="btn btn-outline btn-primary">
                                        <FaUser /> Login to Comment
                                    </Link>
                                </div>
                            )}
                            
                            {/* Comments List */}
                            <div className="space-y-4">
                                {comments.map((comment, index) => (
                                    <div key={comment._id} className="bg-gray-700/30 border border-gray-600 rounded-lg p-4 transition-all hover:border-gray-500">
                                        <div className="flex items-start gap-4">
                                            <div className="relative">
                                                <Avatar user={{ photoURL: comment.commenterImage, displayName: comment.commenterName }} size="w-10 h-10" />
                                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800 flex items-center justify-center">
                                                    <span className="text-xs text-white font-bold">
                                                        {index + 1}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <p className="font-semibold text-green-400">{comment.commenterName}</p>
                                                    <span className="text-gray-500 text-xs">•</span>
                                                    <span className="text-gray-500 text-xs font-mono">
                                                        {new Date(comment.createdAt).toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="prose prose-invert prose-sm max-w-none">
                                                    <p className="text-gray-300 break-words whitespace-pre-wrap font-mono leading-relaxed">
                                                        {comment.commentText}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Report Comment */}
                                        {user && user.email !== comment.commenterEmail && (
                                            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-600">
                                                <select 
                                                    className="select select-sm bg-gray-700 border-gray-600 text-white focus:border-red-500 font-mono" 
                                                    onChange={(e) => handleFeedbackChange(comment._id, e.target.value)} 
                                                    disabled={commentReportStates[comment._id]?.isReported}
                                                >
                                                    <option value="">Report reason...</option>
                                                    <option value="Spam">Spam</option>
                                                    <option value="Inappropriate">Inappropriate</option>
                                                    <option value="Hate Speech">Hate Speech</option>
                                                </select>
                                                <button 
                                                    onClick={() => handleCommentReport(comment)} 
                                                    className="btn btn-xs bg-red-600/20 hover:bg-red-600/30 text-red-400 border-red-500/30 hover:border-red-500/50" 
                                                    disabled={!commentReportStates[comment._id]?.feedback || commentReportStates[comment._id]?.isReported}
                                                >
                                                    <FaExclamationTriangle /> 
                                                    {commentReportStates[comment._id]?.isReported ? 'Reported' : 'Report'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                
                                {comments.length === 0 && (
                                    <div className="text-center py-12">
                                        <FaComments className="text-6xl text-gray-600 mx-auto mb-4" />
                                        <p className="text-gray-400 text-lg">No comments yet.</p>
                                        <p className="text-gray-500 text-sm mt-2">Be the first to start the discussion!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Post Report Modal */}
            {isPostReportModalOpen && (
                <dialog open className="modal modal-bottom sm:modal-middle">
                    <div className="modal-box bg-gray-800 border border-gray-700 max-w-md">
                        <div className="text-center mb-6">
                            <FaExclamationTriangle className="text-4xl text-red-500 mx-auto mb-4" />
                            <h3 className="font-bold text-lg text-white">Report This Post</h3>
                        </div>
                        <p className="text-gray-300 mb-4">Please select a reason for reporting this post:</p>
                        <select 
                            className="select select-bordered w-full bg-gray-700 border-gray-600 text-white focus:border-red-500 mb-6 font-mono" 
                            defaultValue="" 
                            onChange={(e) => setPostReportFeedback(e.target.value)}
                        >
                            <option value="" disabled>Select a reason...</option>
                            <option value="Spam or Misleading">Spam or Misleading</option>
                            <option value="Offensive Content">Offensive Content</option>
                            <option value="Violates Community Rules">Violates Community Rules</option>
                            <option value="Copyright Infringement">Copyright Infringement</option>
                            <option value="Other">Other</option>
                        </select>
                        <div className="modal-action">
                            <button 
                                onClick={() => setIsPostReportModalOpen(false)} 
                                className="btn bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handlePostReport} 
                                className="btn bg-red-600 hover:bg-red-700 text-white border-red-500"
                            >
                                <FaFlag /> Submit Report
                            </button>
                        </div>
                    </div>
                </dialog>
            )}
        </div>
    );
};

export default PostDetails;

<style jsx>{`
    .prose-invert a {
        color: #34d399;
    }
    .prose-invert a:hover {
        color: #10b981;
    }
`}</style>