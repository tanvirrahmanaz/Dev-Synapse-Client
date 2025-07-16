import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import { FaExclamationTriangle } from 'react-icons/fa';

const CommentsPage = () => {
    const { postId } = useParams();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    // প্রতিটি কমেন্টের জন্য আলাদা স্টেট রাখার জন্য
    const [reportStates, setReportStates] = useState({});
    const [selectedComment, setSelectedComment] = useState(null);

    // কমেন্টগুলো আনার জন্য useQuery
    const { data: comments = [], isLoading } = useQuery({
        queryKey: ['comments', postId],
        queryFn: async () => (await axiosSecure.get(`/comments/${postId}`)).data,
    });

    // রিপোর্ট সাবমিট করার জন্য useMutation
    const reportMutation = useMutation({
        mutationFn: (reportData) => axiosSecure.post('/reports', reportData),
        onSuccess: (data, variables) => {
            toast.success('Comment reported successfully!');
            // সফলভাবে রিপোর্ট করার পর বাটনটি স্থায়ীভাবে ডিজেবল করার জন্য স্টেট আপডেট
            setReportStates(prev => ({
                ...prev,
                [variables.commentId]: { ...prev[variables.commentId], isReported: true }
            }));
        },
        onError: () => toast.error('Failed to report comment.'),
    });

    const handleFeedbackChange = (commentId, feedback) => {
        setReportStates(prev => ({
            ...prev,
            [commentId]: { ...prev[commentId], feedback }
        }));
    };

    const handleReport = (commentId, commentText, commenterEmail) => {
        const feedback = reportStates[commentId]?.feedback;
        if (!feedback) {
            toast.error('Please select a feedback option first.');
            return;
        }

        const reportData = {
            commentId,
            postId,
            commentText,
            commenterEmail,
            feedback
        };
        reportMutation.mutate(reportData);
    };

    if (isLoading) return <div className="text-center"><span className="loading loading-spinner"></span></div>;

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Manage Comments</h2>
            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Commenter Email</th>
                            <th>Comment Text</th>
                            <th>Feedback</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {comments.map(comment => (
                            <tr key={comment._id}>
                                <td>{comment.commenterEmail}</td>
                                <td>
                                    {comment.commentText.length > 20 ? (
                                        <>
                                            {comment.commentText.substring(0, 20)}...
                                            <button onClick={() => setSelectedComment(comment.commentText)} className="link link-primary ml-2">
                                                Read More
                                            </button>
                                        </>
                                    ) : (
                                        comment.commentText
                                    )}
                                </td>
                                <td>
                                    <select 
                                        className="select select-bordered select-sm w-full max-w-xs"
                                        onChange={(e) => handleFeedbackChange(comment._id, e.target.value)}
                                        // যদি বাটন ক্লিক হয়ে থাকে, তাহলে ড্রপডাউনও ডিজেবল হবে
                                        disabled={reportStates[comment._id]?.isReported}
                                    >
                                        <option value="">Select Feedback</option>
                                        <option value="Inappropriate">Inappropriate</option>
                                        <option value="Spam">Spam</option>
                                        <option value="Hate Speech">Hate Speech</option>
                                    </select>
                                </td>
                                <td>
                                    <button
                                        onClick={() => handleReport(comment._id, comment.commentText, comment.commenterEmail)}
                                        className="btn btn-sm btn-outline btn-error"
                                        // ফিডব্যাক সিলেক্ট না করলে অথবা রিপোর্ট করা হয়ে গেলে বাটন ডিজেবল থাকবে
                                        disabled={!reportStates[comment._id]?.feedback || reportStates[comment._id]?.isReported}
                                    >
                                        <FaExclamationTriangle /> {reportStates[comment._id]?.isReported ? 'Reported' : 'Report'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* "Read More" Modal */}
            {selectedComment && (
                <dialog id="comment_modal" className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Full Comment</h3>
                        <p className="py-4">{selectedComment}</p>
                        <div className="modal-action">
                            <button onClick={() => setSelectedComment(null)} className="btn">Close</button>
                        </div>
                    </div>
                </dialog>
            )}
        </div>
    );
};

export default CommentsPage;