import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from '../hooks/useAxiosPublic';
import { FaComments, FaArrowUp, FaClock, FaSpinner, FaExclamationCircle } from 'react-icons/fa';
import Avatar from './Avatar';

const PostCard = ({ post }) => {
    const { _id, authorImage, authorName, postTitle, tags, postTime, commentsCount, upVote, downVote } = post;
    const [showComments, setShowComments] = useState(false);
    const axiosPublic = useAxiosPublic();

    const { data: comments = [], isLoading, error } = useQuery({
        queryKey: ['comments', _id],
        queryFn: async () => {
            const res = await axiosPublic.get(`/comments/${_id}`);
            return res.data;
        },
        enabled: showComments, // শুধুমাত্র যখন showComments true হবে, তখনই query চলবে
    });

    const voteDifference = (upVote || 0) - (downVote || 0);
    const formattedTime = new Date(postTime).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 transition-all duration-300 shadow-lg hover:shadow-green-500/20 h-full w-full flex flex-col">
            <div className="flex items-center gap-3 mb-4">
                <Avatar user={{ photoURL: authorImage, displayName: authorName }} size="h-12 w-12" />
                <div>
                    <p className="font-semibold text-green-400">{authorName}</p>
                    <div className='flex items-center gap-1 text-xs text-gray-400'>
                        <FaClock className="text-green-500" />
                        <span>{formattedTime}</span>
                    </div>
                </div>
            </div>

            <div className="flex-grow">
                <Link to={`/post/${_id}`} className="block">
                    <h2 className="text-xl font-bold text-white mb-3 hover:text-green-400 transition-colors duration-200">
                        {postTitle}
                    </h2>
                </Link>
                <div className="flex flex-wrap gap-2 mb-4">
                    {tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded text-sm font-mono hover:bg-green-500/30 transition-colors duration-200">
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-6 pt-4 border-t border-gray-700">
                <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-2 text-gray-300 hover:text-green-400 transition-colors duration-200">
                    <FaComments className="text-lg" />
                    <span className="font-mono">{commentsCount || 0} Comments</span>
                </button>
                <div className="flex items-center gap-2 text-gray-300">
                    <FaArrowUp className="text-lg" />
                    <span className="font-mono">{voteDifference} Votes</span>
                </div>
            </div>

            {showComments && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                    <h3 className="text-lg font-semibold text-green-400 mb-3">Comments</h3>
                    {isLoading ? (
                        <div className="flex justify-center items-center p-4">
                            <FaSpinner className="animate-spin text-2xl text-green-500" />
                        </div>
                    ) : error ? (
                        <div className="text-center p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                            <FaExclamationCircle className="mx-auto text-red-500 text-3xl mb-2" />
                            <p className="text-red-400">Failed to load comments.</p>
                        </div>
                    ) : comments.length > 0 ? (
                        <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                            {comments.map(comment => (
                                <div key={comment._id} className="flex items-start gap-3 bg-gray-700/50 p-3 rounded-lg">
                                    <Avatar user={{ photoURL: comment.commenterImage, displayName: comment.commenterName }} size="h-10 w-10" />
                                    <div>
                                        <p className="font-semibold text-green-300">{comment.commenterName}</p>
                                        <p className="text-gray-300 text-sm">{comment.commentText}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-center py-4">No comments yet.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default PostCard;