import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import { FaTrash, FaInfoCircle } from 'react-icons/fa';

const ReportedActivities = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    // Tanstack Query দিয়ে সব রিপোর্ট আনা হচ্ছে
    const { data: reports = [], isLoading } = useQuery({
        queryKey: ['reports'],
        queryFn: async () => (await axiosSecure.get('/reports')).data
    });

    // ব্যবস্থা নেওয়ার জন্য useMutation
    const takeActionMutation = useMutation({
        mutationFn: async ({ commentId, reportId }) => {
            // একসাথে দুটি কাজ করা: কমেন্ট ডিলিট এবং রিপোর্ট ডিলিট
            await axiosSecure.delete(`/comments/${commentId}`);
            await axiosSecure.delete(`/reports/${reportId}`);
        },
        onSuccess: () => {
            toast.success('Action taken! Comment and report have been deleted.');
            // তালিকা রিফ্রেশ করার জন্য
            queryClient.invalidateQueries({ queryKey: ['reports'] });
        },
        onError: () => toast.error('Failed to take action.')
    });

    const handleTakeAction = (commentId, reportId) => {
        if (window.confirm('This will permanently delete the reported comment and the report itself. Are you sure?')) {
            takeActionMutation.mutate({ commentId, reportId });
        }
    };

    if (isLoading) {
        return <div className="text-center my-10"><span className="loading loading-spinner loading-lg"></span></div>;
    }

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Reported Activities ({reports.length})</h2>
            
            {reports.length === 0 ? (
                <div className="text-center p-8 bg-white rounded-lg shadow-md">
                    <FaInfoCircle className="mx-auto text-5xl text-gray-400 mb-4" />
                    <p className="text-gray-600">No reported activities found.</p>
                </div>
            ) : (
                <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                    <table className="table w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th>#</th>
                                <th>Reported Comment</th>
                                <th>Feedback/Reason</th>
                                <th>Commenter's Email</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map((report, index) => (
                                <tr key={report._id}>
                                    <th>{index + 1}</th>
                                    <td className="max-w-xs break-words">{report.commentText}</td>
                                    <td><span className="badge badge-warning font-semibold">{report.feedback}</span></td>
                                    <td>{report.commenterEmail}</td>
                                    <td>
                                        <button 
                                            onClick={() => handleTakeAction(report.commentId, report._id)}
                                            className="btn btn-sm btn-error text-white"
                                            title="Delete comment and dismiss report"
                                        >
                                            <FaTrash /> Take Action
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ReportedActivities;