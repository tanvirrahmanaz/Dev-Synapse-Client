import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import { FaTrash, FaInfoCircle, FaThList, FaFileAlt, FaCommentAlt } from 'react-icons/fa';

const ReportedActivities = () => {
    const [filter, setFilter] = useState(''); // ফিল্টারের জন্য স্টেট
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    // Tanstack Query দিয়ে ফিল্টার অনুযায়ী রিপোর্ট আনা হচ্ছে
    const { data: reports = [], isLoading, refetch } = useQuery({
        queryKey: ['reports', filter], // ফিল্টার পরিবর্তন হলে কোয়েরি রি-রান হবে
        queryFn: async () => (await axiosSecure.get(`/reports?type=${filter}`)).data
    });

    // ব্যবস্থা নেওয়ার জন্য useMutation (এখন আরও ডাইনামিক)
    const takeActionMutation = useMutation({
        mutationFn: async ({ report }) => {
            // রিপোর্টের ধরন অনুযায়ী সঠিক API কল করা হচ্ছে
            if (report.type === 'comment') {
                await axiosSecure.delete(`/comments/${report.commentId}`);
            } else if (report.type === 'post') {
                await axiosSecure.delete(`/posts/${report.targetId}`); // targetId তে postId থাকবে
            }
            // সবশেষে রিপোর্টটি ডিলিট করা হচ্ছে
            await axiosSecure.delete(`/reports/${report._id}`);
        },
        onSuccess: () => {
            toast.success('Action taken successfully!');
            refetch(); // তালিকা রিফ্রেশ করার জন্য
        },
        onError: () => toast.error('Failed to take action.')
    });

    const handleTakeAction = (report) => {
        if (window.confirm(`This will permanently delete the reported content and the report itself. Are you sure?`)) {
            takeActionMutation.mutate({ report });
        }
    };

    if (isLoading) {
        return <div className="text-center my-10"><span className="loading loading-spinner loading-lg"></span></div>;
    }

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Reported Activities ({reports.length})</h2>

            {/* ফিল্টার বাটন */}
            <div className="mb-6 flex justify-center gap-2">
                <button onClick={() => setFilter('')} className={`btn btn-sm ${filter === '' ? 'btn-primary' : 'btn-ghost'}`}><FaThList /> All Reports</button>
                <button onClick={() => setFilter('post')} className={`btn btn-sm ${filter === 'post' ? 'btn-primary' : 'btn-ghost'}`}><FaFileAlt /> Post Reports</button>
                <button onClick={() => setFilter('comment')} className={`btn btn-sm ${filter === 'comment' ? 'btn-primary' : 'btn-ghost'}`}><FaCommentAlt /> Comment Reports</button>
            </div>
            
            {reports.length === 0 ? (
                <div className="text-center p-8 bg-white rounded-lg shadow-md">
                    <FaInfoCircle className="mx-auto text-5xl text-gray-400 mb-4" />
                    <p className="text-gray-600">No reported activities found for this filter.</p>
                </div>
            ) : (
                <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                    <table className="table w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th>#</th>
                                <th>Reported Content</th>
                                <th>Type</th>
                                <th>Reason</th>
                                <th>Reporter Email</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map((report, index) => (
                                <tr key={report._id}>
                                    <th>{index + 1}</th>
                                    <td className="max-w-xs break-words">
                                        {/* রিপোর্টের ধরন অনুযায়ী কন্টেন্ট দেখানো হচ্ছে */}
                                        {report.type === 'comment' ? report.commentText : `Post ID: ${report.targetId}`}
                                    </td>
                                    <td>
                                        <span className={`badge ${report.type === 'comment' ? 'badge-info' : 'badge-success'}`}>{report.type}</span>
                                    </td>
                                    <td><span className="badge badge-warning font-semibold">{report.feedback}</span></td>
                                    <td>{report.reporterEmail}</td>
                                    <td>
                                        <button onClick={() => handleTakeAction(report)} className="btn btn-sm btn-error text-white" title="Delete content and dismiss report">
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