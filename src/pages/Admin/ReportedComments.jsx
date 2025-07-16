// src/pages/Admin/ReportedComments.jsx
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import { FaTrash } from 'react-icons/fa';

const ReportedComments = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const { data: reports = [], isLoading, refetch } = useQuery({
        queryKey: ['reports'],
        queryFn: async () => (await axiosSecure.get('/reports')).data
    });

    const takeActionMutation = useMutation({
        mutationFn: async ({ commentId, reportId }) => {
            // একসাথে দুটি কাজ করা: কমেন্ট ডিলিট এবং রিপোর্ট ডিলিট
            await axiosSecure.delete(`/comments/${commentId}`);
            await axiosSecure.delete(`/reports/${reportId}`);
        },
        onSuccess: () => {
            toast.success('Action taken successfully! Comment and report have been deleted.');
            queryClient.invalidateQueries({ queryKey: ['reports'] });
        },
        onError: () => toast.error('Failed to take action.')
    });

    const handleTakeAction = (commentId, reportId) => {
        if(window.confirm('This will delete the comment and the report. Are you sure?')){
            takeActionMutation.mutate({ commentId, reportId });
        }
    };

    if (isLoading) return <div className="text-center"><span className="loading loading-spinner"></span></div>;

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Reported Activities ({reports.length})</h2>
            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Comment Text</th>
                            <th>Feedback/Reason</th>
                            <th>Commenter Email</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((report, index) => (
                            <tr key={report._id}>
                                <th>{index + 1}</th>
                                <td>{report.commentText}</td>
                                <td><span className="badge badge-warning">{report.feedback}</span></td>
                                <td>{report.commenterEmail}</td>
                                <td>
                                    <button 
                                        onClick={() => handleTakeAction(report.commentId, report._id)}
                                        className="btn btn-sm btn-error text-white"
                                    >
                                        <FaTrash /> Take Action
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

export default ReportedComments;